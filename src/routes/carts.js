import express from "express";
import CartManager from "../managers/carts-manager.js";


const router = express.Router();
const cartManager = new CartManager("./src/data/carts.json");

//Listar carritos

router.get("/", async (req, res) => {
    try {
        const carritos = await cartManager.cargarCarritos();
        res.json(carritos);
        }
    catch (error) {
        console.error("Error al obtener los carritos", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});


//Crear carrito

router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//Listar productos del carrito. 

router.get("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid);

    try {
        const carrito = await cartManager.getCarritoById(cartId);
        if (carrito) {
            res.json(carrito.products);
        } else {
            res.status(404).json({ error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


//Agregar productos al carrito

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;


    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
        if (actualizarCarrito) {
            res.json(actualizarCarrito.products);
        } else {
            res.status(404).json({ error: "Carrito o producto no encontrado" });
        }
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


export default router;

