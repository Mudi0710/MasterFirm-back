import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  newsMarquee: {
    type: String
  },
  knowledgesMarquee: {
    type: String
  },
  casesMarquee: {
    type: String
  }
}, { versionKey: false })

export default mongoose.model('marquees', schema)
