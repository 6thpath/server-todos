import { Schema, model } from 'mongoose'

const todoSchema = new Schema({
  _id: String,
  title: String,
  content: String
})

export default model('Todo', todoSchema)
