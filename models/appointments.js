import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    // 將 ref 對到 users，如此一來就可以使用 populate 去取得 user 的資料
    ref: 'users',
    required: [true, '缺少使用者資訊']
  },
  services: [
    {
      service: {
        type: mongoose.ObjectId,
        ref: 'services',
        required: [true, '缺少諮詢項目']
      },
      people: {
        type: Number,
        required: [true, '缺少預約人數']
      },
      appointmentDate: {
        type: Date,
        required: [true, '缺少預約時段']
      }
    }
  ],
  orderDate: {
    type: Date,
    required: true,
    default: Date.now()
  },
  content: {
    type: String
  },
  totalTime: {
    type: Number,
    required: true,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  }
}, { versionKey: false })

export default mongoose.model('appointments', schema)
