import express from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import {
  createKnowledge,
  getKnowledges,
  getAllKnowledges,
  getKnowledge,
  editKnowledge,
  deleteKnowledge
} from '../controllers/knowledges.js'

const router = express.Router()

router.post('/', content('multipart/form-data'), auth.jwt, admin, upload, createKnowledge)
router.get('/', getKnowledges)
router.get('/all', auth.jwt, admin, getAllKnowledges)
router.get('/:id', getKnowledge)
router.delete('/:id', auth.jwt, admin, deleteKnowledge)
router.patch('/:id', content('multipart/form-data'), auth.jwt, admin, upload, editKnowledge)

export default router
