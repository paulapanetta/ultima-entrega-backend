import mongoose from 'mongoose';

const { Schema } = mongoose;

const cartSchema = new Schema({
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number
        }
    ]
});

const CartModel = mongoose.models.Carts || mongoose.model('Carts', cartSchema);

const cartsModel = {
    createCart: async () => {
        try {
            const newCart = new CartModel({ products: [] });
            const savedCart = await newCart.save();
            return savedCart;
        } catch (error) {
            throw new Error(`Error creating cart: ${error.message}`);
        }
    },

    getProductsInCartById: async (cartId) => {
        try {
            const cart = await CartModel.findById(cartId).populate('products.product');
            if (cart) {
                return cart.products;
            } else {
                throw new Error('Cart not found');
            }
        } catch (error) {
            throw new Error(`Error retrieving cart: ${error.message}`);
        }
    },

    addProductToCart: async (cartId, productId, productQuantity) => {
        try {
            const cart = await CartModel.findById(cartId);
            if (cart) {
                const existingProductIndex = cart.products.findIndex(p => p.product.equals(productId));
                if (existingProductIndex !== -1) {
                    cart.products[existingProductIndex].quantity += productQuantity;
                } else {
                    cart.products.push({ product: productId, quantity: productQuantity });
                }
                await cart.save();
            } else {
                throw new Error('Cart not found');
            }
        } catch (error) {
            throw new Error(`Error adding product to cart: ${error.message}`);
        }
    }
};

export default cartsModel;