import CartModel from '../models/cartsModel.js';
import mongoose from 'mongoose';

const { Schema } = mongoose;

export const createCart = async (req, res) => {
    try {
        const newCart = new CartModel();
        const savedCart = await newCart.save();
        res.status(201).json(savedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCartProducts = async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid).populate('products.product');
        if (cart) {
            res.json(cart.products);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addProductToCart = async (req, res) => {
    const { cartId, productId, quantity } = req.body;
    try {
        const cart = await CartModel.findById(cartId);
        if (cart) {
            const existingProductIndex = cart.products.findIndex(p => p.product.equals(productId));
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity: quantity });
            }
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeProductFromCart = async (req, res) => {
    const { cartId, productId } = req.params;
    try {
        const cart = await CartModel.findById(cartId);
        if (cart) {
            const updatedProducts = cart.products.filter(p => !p.product.equals(productId));
            cart.products = updatedProducts;
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCart = async (req, res) => {
    const { cartId } = req.params;
    const { products } = req.body;
    try {
        const cart = await CartModel.findById(cartId);
        if (cart) {
            cart.products = products;
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const clearCart = async (req, res) => {
    const { cartId } = req.params;
    try {
        const cart = await CartModel.findById(cartId);
        if (cart) {
            cart.products = [];
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
