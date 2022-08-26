import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '簡介標題為必填']
  },
  content: {
    type: String,
    required: [true, '簡介內容為必填']
  },
  image: {
    type: [String]
  }
}, { versionKey: false })

export default mongoose.model('notice', schema)
