import express from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import {
  createSlogan,
  getSlogan,
  getAllSlogan,
  editSlogan,
  deleteSlogan
} from '../controllers/slogan.js'

const router = express.Router()

router.post('/', content('multipart/form-data'), auth.jwt, admin, upload, createSlogan)
router.get('/', getSlogan)
router.get('/all', auth.jwt, admin, getAllSlogan)
router.delete('/:id', auth.jwt, admin, deleteSlogan)
router.patch('/:id', content('multipart/form-data'), auth.jwt, admin, upload, editSlogan)

export default router
