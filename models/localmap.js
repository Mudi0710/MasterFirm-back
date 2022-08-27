import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  localmap: {
    type: String,
    required: [true, '聯絡地圖為必填'],
    unique: true
  }
}, { versionKey: false })

export default mongoose.model('localmap', schema)
