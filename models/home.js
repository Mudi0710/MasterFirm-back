import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Slogan為必填']
  },
  content: {
    type: String,
    required: [true, '宣傳內容為必填']
  }
}, { versionKey: false })

export default mongoose.model('home', schema)
