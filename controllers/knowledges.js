import knowledges from '../models/knowledges.js'

// 新增靈學知識
export const createKnowledge = async (req, res) => {
  try {
    const result = await knowledges.create({
      title: req.body.title,
      content: req.body.content,
      date: req.body.date,
      show: req.body.show,
      // 加上問號(可選串連)是因為：圖片可能沒上傳，所以可能會沒有圖片 => req.file 就會是 undefined，對 undefined 的東西加上 .path 會出現錯誤，所以才加問號讓程式可以忽略並繼續執行
      image: req.files?.map(file => {
        return file.path
      }) || []
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

// 抓到所有已上架靈學知識，所有人都能看
export const getKnowledges = async (req, res) => {
  try {
    const result = await knowledges.find({ sell: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 抓到所有靈學知識（包含下架），只有管理者能看到
export const getAllKnowledges = async (req, res) => {
  try {
    const result = await knowledges.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 抓到單一個靈學知識，所有人都能看
export const getKnowledge = async (req, res) => {
  try {
    // params 是路由參數
    const result = await knowledges.findById(req.params.id)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 編輯靈學知識，只有管理者能編輯
export const editKnowledge = async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      content: req.body.content,
      date: req.body.date,
      show: req.body.show
    }
    // 如果 req.file 不是空的
    if (req.file) data.image = req.file.path
    const result = await knowledges.findByIdAndUpdate(req.params.id, data, { new: true })
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

// 刪除靈學知識，只有管理者能刪除
export const deleteKnowledge = async (req, res) => {
  try {
    await knowledges.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
