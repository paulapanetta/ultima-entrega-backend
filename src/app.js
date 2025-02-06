import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import fs from 'fs/promises';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import mongoose from 'mongoose';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

const uri = "mongodb+srv://fakulencinas:h3llabove@cluster1.almgcny.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await mongoose.disconnect();
  }
}
run().catch(console.dir);

const { Schema } = mongoose;
const exampleSchema = new Schema({
});

const ExampleModel = mongoose.model('Example', exampleSchema);

export default ExampleModel;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));


app.use(express.static(join(__dirname, 'public')));
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);


app.get('/', async (req, res) => {
    const dataPath = join(__dirname, 'data', 'products.json');
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        const products = JSON.parse(data);
        res.render('home', { products });
    } catch (error) {
        console.error("Error leyendo el archivo products.json:", error.message);
        res.status(500).send(`Error al leer la lista de productos: ${error.message}`);
    }
});

app.get('/realtimeproducts', async (req, res) => {
    const dataPath = join(__dirname, 'data', 'products.json');
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        const products = JSON.parse(data);
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error("Error leyendo el archivo products.json:", error.message);
        res.status(500).send(`Error al leer la lista de productos: ${error.message}`);
    }
});


const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});


io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('nuevoProducto', async (product) => {
        const dataPath = join(__dirname, 'data', 'products.json');
        try {
            const data = await fs.readFile(dataPath, 'utf8');
            const products = JSON.parse(data);
            products.push(product);
            await fs.writeFile(dataPath, JSON.stringify(products));
            io.emit('actualizarLista', products);
        } catch (error) {
            console.error("Error al agregar producto:", error.message);
        }
    });

    socket.on('eliminarProducto', async (productId) => {
        const dataPath = join(__dirname, 'data', 'products.json');
        try {
            const data = await fs.readFile(dataPath, 'utf8');
            const products = JSON.parse(data);
            const updatedProducts = products.filter(p => p.id !== productId);
            await fs.writeFile(dataPath, JSON.stringify(updatedProducts));
            io.emit('actualizarLista', updatedProducts);
        } catch (error) {
            console.error("Error al eliminar producto:", error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});