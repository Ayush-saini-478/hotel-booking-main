import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import { protect } from '../middlewares/authMiddleware.js'
import { createRoom, getAllRooms, getOwnerRooms, toggleRoomAvailability } from '../controllers/roomController.js';

const roomRouter = express.Router();

roomRouter.post('/', protect, upload.array("images", 4), createRoom);
roomRouter.get('/', getAllRooms);
roomRouter.get('/owner', protect, getOwnerRooms);
roomRouter.post('/toggle-availability', protect, toggleRoomAvailability);

export default roomRouter;