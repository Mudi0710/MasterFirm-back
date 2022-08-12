import express from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import {
  createProduct
  // getProducts,
  // getAllproducts,
  // getProduct,
  // editProduct
} from '../controllers/products.js'

const router = express.Router()

// 前情提要：content.js 是用來檢查資料內容（from-data）的格式（content type）
/*
  content type 種類：
  => application/json：代表請求內容是 json
  => image/png：代表請求內容是 圖片檔
  => multipart/form-data：代表請求內容 包含多種資料格式（json、圖片、影片...）
 */
// 檢查關卡：資料格式 => jwt => 管理者身分 => 上傳內容設定 => 商品資料 model
router.post('/', content('multipart/form-data'), auth.jwt, admin, upload, createProduct)
// router.get('/', getProducts)
// router.get('/all', auth.jwt, admin, getAllproducts)
// router.get('/:id', getProduct)
// router.patch('/:id', content('multipart/form-data'), auth.jwt, admin, upload, editProduct)

export default router
