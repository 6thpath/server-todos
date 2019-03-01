import uuid from 'uuid/v4'

const resolvers = {
  Query: {
    Todo: (root, args, { models }) => {
      const { _id } = args
      return models.todo.find({ _id })
    },
    Todos: (root, args, { models }) => models.todo.find({})
  },
  Mutation: {
    createTodo: async (root, args, { models }) => {
      const newTodo = new models.todo(args)
      newTodo._id = uuid()
      return await newTodo.save()
    },
    updateTodo: async (root, args, { models }) => {
      const { _id, title, content } = args
      await models.todo.updateOne({ _id }, { title, content })
      return await models.todo.findOne({ _id }, { title, content })
    },
    deleteTodo: async (root, args, { models }) => {
      const { _id } = args
      await models.todo.findOneAndRemove({ _id })
      return _id
    }
  }
}

export default resolvers
