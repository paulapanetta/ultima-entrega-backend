import express from 'express';
import { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:pid', getProductById);
router.post('/', addProduct);
router.put('/:pid', updateProduct);
router.delete('/:pid', deleteProduct);

export default router;
