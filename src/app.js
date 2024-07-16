import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import viewsRouter from "./routes/views.js";
import ProductManager from "./dao/fs/products-manager.js";
import "./database.js";

const app = express();
const PUERTO = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.get("/", (req, res) => {
    res.send("BIENVENIDOS AL SUPER MAROLIO CON MONGOOSE.!!!");
    })

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PUERTO, () => {
console.log(`El servidor está escuchando en el puerto ${PUERTO}`);
});

const productManager = new ProductManager("./src/data/products.json");

const io = new Server(httpServer);

io.on("connection", async (socket) => {
    console.log("Un Cliente se conectó");

    socket.emit("productos", await productManager.getProducts());

    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);

        //Lista actualizada
        io.sockets.emit("productos", await productManager.getProducts());
    });

    //Agrega Productos con Formulario 
    socket.on("agregarProducto", async (producto) => {
        await productManager.addProduct(producto); 
        //Lista actualizada
        io.sockets.emit("productos", await productManager.getProducts());
    });
});

