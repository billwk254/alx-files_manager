import express from 'express';
import UsersController from '../controllers/UsersController';

const router = express.Router();

// Define routes
router.post('/users', UsersController.postNew);

export default router;
