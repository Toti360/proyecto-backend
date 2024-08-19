import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import viewsRouter from "./routes/views.js";
import ProductManager from "./dao/fs/products-manager.js";
import "./database.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import sessionRouter from "./routes/sessions.js";
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import cookieParser from "cookie-parser";

const app = express();
const PUERTO = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(cookieParser());

app.use(session({
    secret: "secretCoder", 
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://aburoxana:917325@cluster0.wvf05f6.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0",
    })
}));


//Pasport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());



app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.get("/", (req, res) => {
res.send("BIENVENIDOS AL SUPER MAROLIO CON MONGOOSE.!!!");
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", sessionRouter);


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

