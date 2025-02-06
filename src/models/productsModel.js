import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';


const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnails: [String]
});

const Product = mongoose.model('Product', productSchema);

const productsModel = {
    getAllProducts: async () => {
        try {
            const products = await Product.find();
            return products;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    getProductById: async (productId) => {
        try {
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    addProduct: async (newProductData) => {
        try {
            const newProduct = new Product(newProductData);
            const savedProduct = await newProduct.save();
            return savedProduct;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    updateProductById: async (productId, updatedProductData) => {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                updatedProductData,
                { new: true }
            );
            if (!updatedProduct) {
                throw new Error('Product not found');
            }
            return updatedProduct;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    deleteProductById: async (productId) => {
        try {
            const deletedProduct = await Product.findByIdAndDelete(productId);
            if (!deletedProduct) {
                throw new Error('Product not found');
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
};

export default productsModel;