import express from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/uploadmultiple.js'
import {
  createCarousel,
  getCarousels,
  getAllCarousels,
  getCarousel,
  editCarousel,
  deleteCarousel
} from '../controllers/carousels.js'

const router = express.Router()

router.post('/', content('multipart/form-data'), auth.jwt, admin, upload, createCarousel)
router.get('/', getCarousels)
router.get('/all', auth.jwt, admin, getAllCarousels)
router.get('/:id', getCarousel)
router.delete('/:id', auth.jwt, admin, deleteCarousel)
router.patch('/:id', content('multipart/form-data'), auth.jwt, admin, upload, editCarousel)

export default router
