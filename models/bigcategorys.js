import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  bigCategory: {
    // 0 = 靈學知識
    // 1 = 案例分享
    type: Number,
    required: [true, '大分類為必填']
  }
}, { versionKey: false })

export default mongoose.model('bigCategorys', schema)
