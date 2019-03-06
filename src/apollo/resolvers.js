import uuid from 'uuid/v4'
import { PubSub, ApolloError } from 'apollo-server-express'
const pubsub = new PubSub()

const BOOKMARK_UPDATE = 'BOOKMARK_UPDATE'

const resolvers = {
  Query: {
    bookmark: async (root, { _id }, { models }) => {
      try {
        return await models.bookmark.find({ _id })
      } catch (error) {
        throw new ApolloError(error, '400')
      }
    },
    bookmarks: async (root, args, { models }) => {
      try {
        return await models.bookmark.find()
      } catch (error) {
        throw new ApolloError(error, '400')
      }
    }
  },
  Mutation: {
    createBookmark: async (root, args, { models }) => {
      try {
        const newBookmark = new models.bookmark(args)
        newBookmark._id = uuid()
        pubsub.publish(BOOKMARK_UPDATE, { bookmarkUpdate: newBookmark })
        return await newBookmark.save()
      } catch (error) {
        throw new ApolloError(error, '400')
      }
    },
    updateBookmark: async (root, { _id, title, note, bookmarkLink }, { models }) => {
      try {
        const newBookmark = await models.bookmark.updateOne({ _id }, { $set: { title, note, bookmarkLink } })
        pubsub.publish(BOOKMARK_UPDATE, { bookmarkUpdate: newBookmark })
        return await models.bookmark.findOne({ _id })
      } catch (error) {
        throw new ApolloError(error, '400')
      }
    },
    deleteBookmark: async (root, { _id }, { models }) => {
      try {
        const newBookmark = await models.todo.findOneAndRemove({ _id })
        pubsub.publish(BOOKMARK_UPDATE, { bookmarkUpdate: newBookmark })
        return _id
      } catch (error) {
        throw new ApolloError(error, '400')
      }
    }
  },
  Subscription: {
    bookmarkUpdate: {
      subscribe: () => pubsub.asyncIterator([BOOKMARK_UPDATE])
    }
  }
}

export default resolvers
