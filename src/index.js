import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs, resolvers } from './apollo'
import mongoose from 'mongoose'
import models from './models'

mongoose.connect(
  `mongodb://${process.env.MONGO_URL}`,
  { useNewUrlParser: true },
  () => console.log('Database connected!')
)

const app = express()
app.use(cors())

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    settings: {
      'general.betaUpdates': false,
      'editor.cursorShape': 'line', // possible values: 'line', 'block', 'underline'
      'editor.fontSize': 14,
      'editor.fontFamily': `'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
      'editor.theme': 'dark', // possible values: 'dark', 'light'
      'editor.reuseHeaders': true, // new tab reuses headers from last tab
      'request.credentials': 'omit', // possible values: 'omit', 'include', 'same-origin'
      'tracing.hideTracingResponse': true
    }
  },
  introspection: true,
  context: async ({ connection }) => {
    if (connection) {
      return connection.context
    } else {
      return { models }
    }
  }
})

server.applyMiddleware({ app })

const httpServer = createServer(app)
server.installSubscriptionHandlers(httpServer)

app.listen({ port: process.env.PORT }, () => {
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`)
})
