const { gql } = require('apollo-server-express')

const typeDefs = gql`
  type Todo {
    _id: ID
    title: String
    content: String
  }
  type Query {
    Todo(_id: ID!): Todo
    Todos: [Todo]
  }
  type Mutation {
    createTodo(title: String!, content: String!): Todo
    updateTodo(_id: ID!, title: String!, content: String!): Todo
    deleteTodo(_id: ID!): String
  }
`

export default typeDefs