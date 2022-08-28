import services from '../models/services.js'

// 新增商品
export const createService = async (req, res) => {
  try {
    const result = await services.create({
      name: req.body.name,
      description: req.body.description,
      sell: req.body.sell,
      price: req.body.price,
      time: req.body.time,
      icon: req.body.icon,
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

// 抓到所有已上架商品，所有人都能看
export const getServices = async (req, res) => {
  try {
    const result = await services.find({ sell: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 抓到所有商品（包含下架），只有管理者能看到
export const getAllServices = async (req, res) => {
  try {
    const result = await services.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 抓到單一個商品，所有人都能看
export const getService = async (req, res) => {
  try {
    // params 是路由參數
    const result = await services.findById(req.params.id)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 編輯商品，只有管理者能編輯
export const editService = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      description: req.body.description,
      sell: req.body.sell,
      price: req.body.price,
      time: req.body.time,
      icon: req.body.icon
    }
    // 如果 req.file 不是空的
    if (req.files.image) {
      data.image = req.files.image?.map(file => {
        return file.path
      })
    }
    const result = await services.findByIdAndUpdate(req.params.id, data, { new: true })
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

// 刪除商品，只有管理者能刪除
export const deleteService = async (req, res) => {
  try {
    await services.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
