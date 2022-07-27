import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  block: {
    // 0 = Home
    // 1 = Introduction
    // 2 = News
    // 3 = Services
    // 4 = Articles
    // 5 = Articles - Knowledge
    // 6 = Articles - Case
    // 7 = Products
    // 8 = Content
    // 9 = MemberHome
    // 10 = ManageHome
    type: Number,
    required: [true, '輪播區塊為必填']
  },
  image: {
    type: [String],
    required: [true, '至少需上傳一張圖片']
  }
}, { versionKey: false })

export default mongoose.model('carousels', schema)
