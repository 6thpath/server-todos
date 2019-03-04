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
app.use((_, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  return next()
})

const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: false,
  playground: {
    settings: {
      'editor.cursorShape': 'line'
    }
  },
  introspection: true,
  context: async ({ req, connection }) => {
    // Authentication + Authorize here
    if (connection) {
      return connection.context
    } else {
      // let token = req.headers.authorization || null
      return { models }
    }
  }
})

server.applyMiddleware({ app })

const httpServer = createServer(app)
server.installSubscriptionHandlers(httpServer)

app.listen({ port:process.env.PORT || 80 }, () => {
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`)
})

// "start": "nodemon --exec babel-node src/index.js"