import express from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import {
  createIntroduction,
  getIntroduction,
  getAllIntroduction,
  editIntroduction,
  deleteIntroduction
} from '../controllers/introduction.js'

const router = express.Router()

router.post('/', content('multipart/form-data'), auth.jwt, admin, upload, createIntroduction)
router.get('/', getIntroduction)
router.get('/all', auth.jwt, admin, getAllIntroduction)
router.delete('/:id', auth.jwt, admin, deleteIntroduction)
router.patch('/:id', content('multipart/form-data'), auth.jwt, admin, upload, editIntroduction)

export default router
