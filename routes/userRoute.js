import express from 'express';
import { googleSignIn, login, registerUser } from '../controllers/userController.js';

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', login)
router.post('/googleSignIn', googleSignIn)

export default router;