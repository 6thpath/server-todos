import { Schema, model } from 'mongoose'

const bookmarkSchema = new Schema({
  _id: String,
  title: String,
  note: String,
  bookmarkLink: String
})

export default model('Bookmark', bookmarkSchema)
