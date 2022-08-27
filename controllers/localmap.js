import localmap from '../models/localmap.js'

// 新增最新消息
export const createLocalmap = async (req, res) => {
  try {
    const result = await localmap.create({
      localmap: req.body.localmap
    })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// 抓到所有已上架最新消息，所有人都能看
export const getLocalmaps = async (req, res) => {
  try {
    const result = await localmap.find({ show: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 抓到所有最新消息（包含下架），只有管理者能看到
export const getAllLocalmaps = async (req, res) => {
  try {
    const result = await localmap.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 抓到單一個最新消息，所有人都能看
export const getLocalmap = async (req, res) => {
  try {
    // params 是路由參數
    const result = await localmap.findById(req.params.id)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 編輯最新消息，只有管理者能編輯
export const editLocalmap = async (req, res) => {
  try {
    const data = {
      localmap: req.body.localmap
    }
    const result = await localmap.findByIdAndUpdate(req.params.id, data, { new: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// 刪除最新消息，只有管理者能刪除
export const deleteLocalmap = async (req, res) => {
  try {
    await localmap.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
