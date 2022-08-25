import express from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import {
  createCase,
  getCases,
  getAllCases,
  getCase,
  editCase,
  deleteCase
} from '../controllers/cases.js'

const router = express.Router()

router.post('/', content('multipart/form-data'), auth.jwt, admin, upload, createCase)
router.get('/', getCases)
router.get('/all', auth.jwt, admin, getAllCases)
router.get('/:id', getCase)
router.delete('/:id', auth.jwt, admin, deleteCase)
router.patch('/:id', content('multipart/form-data'), auth.jwt, admin, upload, editCase)

export default router
