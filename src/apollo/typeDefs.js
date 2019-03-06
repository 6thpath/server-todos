import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type Bookmark {
    _id: ID
    title: String
    note: String
    bookmarkLink: String
  }
  type Query {
    bookmark(_id: ID!): Bookmark
    bookmarks: [Bookmark]
  }
  type Mutation {
    createBookmark(title: String!, note: String, bookmarkLink: String!): Bookmark
    updateBookmark(_id: ID!, title: String, note: String, bookmarkLink: String): Bookmark
    deleteBookmark(_id: ID!): String
  }

  type Subscription {
    bookmarkUpdate: Bookmark
  }
`

export default typeDefs