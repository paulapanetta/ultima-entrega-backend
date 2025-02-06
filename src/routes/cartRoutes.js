import { Router } from 'express';
import { createCart, getCartProducts, addProductToCart, removeProductFromCart, updateCart, clearCart } from '../controllers/cartController.js';

const router = Router();

router.post('/cart', createCart);
router.get('/cart/:cid/products', getCartProducts);
router.put('/cart/:cartId/product', addProductToCart);
router.delete('/cart/:cartId/product/:productId', removeProductFromCart);
router.put('/cart/:cartId', updateCart);
router.delete('/cart/:cartId', clearCart);

export default router;
