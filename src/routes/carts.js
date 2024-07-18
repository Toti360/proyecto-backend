import express from "express";
import CartManager from "../dao/db/cart-manager-db.js";

const router = express.Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get("/", async (req, res) => {
    try {
        const cart = await cartManager.obtenerCarritos();
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error al listar los carritos", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

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

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
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

router.delete("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const actualizarCarrito = await cartManager.eliminarProductoDelCarrito(cartId, productId);
        if (actualizarCarrito) {
            res.json(actualizarCarrito.products);
        } else {
            res.status(404).json({ error: "Carrito o producto no encontrado" });
        }
    } catch (error) {
        console.error("Error al eliminar producto del carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.put("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const productos = req.body.products;

    try {
        const actualizarCarrito = await cartManager.actualizarCarrito(cartId, productos);
        if (actualizarCarrito) {
            res.json(actualizarCarrito.products);
        } else {
            res.status(404).json({ error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error("Error al actualizar el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;

    try {
        const actualizarCarrito = await cartManager.actualizarCantidadProducto(cartId, productId, quantity);
        if (actualizarCarrito) {
            res.json(actualizarCarrito.products);
        } else {
            res.status(404).json({ error: "Carrito o producto no encontrado" });
        }
    } catch (error) {
        console.error("Error al actualizar cantidad del producto en el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.delete("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const actualizarCarrito = await cartManager.eliminarTodosLosProductos(cartId);
        if (actualizarCarrito) {
            res.json(actualizarCarrito.products);
        } else {
            res.status(404).json({ error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error("Error al eliminar todos los productos del carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
