import marquees from '../models/marquees.js'

// 新增最新消息
export const createMarquee = async (req, res) => {
  try {
    const result = await marquees.create({
      newsMarquee: req.body.newsMarquee,
      knowledgesMarquee: req.body.knowledgesMarquee,
      casesMarquee: req.body.casesMarquee
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
export const getMarquees = async (req, res) => {
  try {
    const result = await marquees.find({ show: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 抓到所有最新消息（包含下架），只有管理者能看到
export const getAllMarquees = async (req, res) => {
  try {
    const result = await marquees.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 抓到單一個最新消息，所有人都能看
export const getMarquee = async (req, res) => {
  try {
    // params 是路由參數
    const result = await marquees.findById(req.params.id)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 編輯最新消息，只有管理者能編輯
export const editMarquee = async (req, res) => {
  try {
    const data = {
      newsMarquee: req.body.newsMarquee,
      knowledgesMarquee: req.body.knowledgesMarquee,
      casesMarquee: req.body.casesMarquee
    }
    const result = await marquees.findByIdAndUpdate(req.params.id, data, { new: true })
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
export const deleteMarquee = async (req, res) => {
  try {
    await marquees.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
