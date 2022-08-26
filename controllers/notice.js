import notice from '../models/notice.js'

// 新增預約須知文章
export const createNotice = async (req, res) => {
  try {
    const result = await notice.create({
      title: req.body.title,
      content: req.body.content,
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

// 抓到預約須知文章
export const getNotice = async (req, res) => {
  try {
    const result = await notice.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 抓到預約須知文章，只有管理者能看到
export const getAllNotice = async (req, res) => {
  try {
    const result = await notice.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 編輯預約須知文章
export const editNotice = async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      content: req.body.content
    }
    // 如果 req.file 不是空的
    if (req.file) data.image = req.file.path
    const result = await notice.findByIdAndUpdate(req.params.id, data, { new: true })
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

// 刪除預約須知文章，只有管理者能刪除
export const deleteNotice = async (req, res) => {
  try {
    await notice.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
