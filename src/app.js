import express from "express";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";

const app = express();
const PUERTO = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("BIENVENIDOS AL SUPER");
    })

app.use("/apis/products", productsRouter);
app.use("/apis/carts", cartsRouter);

app.listen(PUERTO, () => {
console.log(`El servidor está escuchando en el puerto ${PUERTO}`);
});

