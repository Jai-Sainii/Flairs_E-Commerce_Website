import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  verifyPayment,
} from '../controllers/orderController.js';

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, getMyOrders);

router.route('/verifyPayment')
  .post(protect, verifyPayment);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);

export default router;
