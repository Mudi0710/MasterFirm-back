import carousels from '../models/carousels.js'

// 新增靈學知識
export const createCarousel = async (req, res) => {
  try {
    const result = await carousels.create({
      // 加上問號(可選串連)是因為：圖片可能沒上傳，所以可能會沒有圖片 => req.file 就會是 undefined，對 undefined 的東西加上 .path 會出現錯誤，所以才加問號讓程式可以忽略並繼續執行
      indexImageMobile: req.files.indexImageMobile?.map(file => {
        return file.path
      }) || [],
      indexImageDesktop: req.files.indexImageDesktop?.map(file => {
        return file.path
      }) || [],
      newsImageMobile: req.files.newsImageMobile?.map(file => {
        return file.path
      }) || [],
      newsImageDesktop: req.files.newsImageDesktop?.map(file => {
        return file.path
      }) || [],
      knowledgesImageMobile: req.files.knowledgesImageMobile?.map(file => {
        return file.path
      }) || [],
      knowledgesImageDesktop: req.files.knowledgesImageDesktop?.map(file => {
        return file.path
      }) || [],
      casesImageMobile: req.files.casesImageMobile?.map(file => {
        return file.path
      }) || [],
      casesImageDesktop: req.files.casesImageDesktop?.map(file => {
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
export const getCarousels = async (req, res) => {
  try {
    const result = await carousels.find({ sell: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 抓到所有靈學知識（包含下架），只有管理者能看到
export const getAllCarousels = async (req, res) => {
  try {
    const result = await carousels.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 抓到單一個靈學知識，所有人都能看
export const getCarousel = async (req, res) => {
  try {
    // params 是路由參數
    const result = await carousels.findById(req.params.id)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 編輯靈學知識，只有管理者能編輯
export const editCarousel = async (req, res) => {
  try {
    const data = {}
    // 如果 req.file 不是空的
    if (req.files.indexImageMobile) {
      data.indexImageMobile = req.files.indexImageMobile?.map(file => {
        return file.path
      })
    }
    if (req.files.indexImageDesktop) {
      data.indexImageDesktop = req.files.indexImageDesktop?.map(file => {
        return file.path
      })
    }
    if (req.files.newsImageMobile) {
      data.newsImageMobile = req.files.newsImageMobile?.map(file => {
        return file.path
      })
    }
    if (req.files.newsImageDesktop) {
      data.newsImageDesktop = req.files.newsImageDesktop?.map(file => {
        return file.path
      })
    }
    if (req.files.knowledgesImageMobile) {
      data.knowledgesImageMobile = req.files.knowledgesImageMobile?.map(file => {
        return file.path
      })
    }
    if (req.files.knowledgesImageDesktop) {
      data.knowledgesImageDesktop = req.files.knowledgesImageDesktop?.map(file => {
        return file.path
      })
    }
    if (req.files.casesImageMobile) {
      data.casesImageMobile = req.files.casesImageMobile?.map(file => {
        return file.path
      })
    }
    if (req.files.casesImageDesktop) {
      data.casesImageDesktop = req.files.casesImageDesktop?.map(file => {
        return file.path
      })
    }
    const result = await carousels.findByIdAndUpdate(req.params.id, data, { new: true })
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
export const deleteCarousel = async (req, res) => {
  try {
    await carousels.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
