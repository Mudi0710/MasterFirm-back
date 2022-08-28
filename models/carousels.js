import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  indexImageMobile: {
    type: [String]
    // required: [true, '至少需上傳一張圖片']
  },
  indexImageDesktop: {
    type: [String]
    // required: [true, '至少需上傳一張圖片']
  },
  newsImageMobile: {
    type: [String]
    // required: [true, '至少需上傳一張圖片']
  },
  newsImageDesktop: {
    type: [String]
    // required: [true, '至少需上傳一張圖片']
  },
  knowledgesImageMobile: {
    type: [String]
    // required: [true, '至少需上傳一張圖片']
  },
  knowledgesImageDesktop: {
    type: [String]
    // required: [true, '至少需上傳一張圖片']
  },
  casesImageMobile: {
    type: [String]
    // required: [true, '至少需上傳一張圖片']
  },
  casesImageDesktop: {
    type: [String]
    // required: [true, '至少需上傳一張圖片']
  }
}, { versionKey: false })

export default mongoose.model('carousels', schema)
