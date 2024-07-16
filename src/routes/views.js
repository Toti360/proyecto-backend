import { Router } from "express";
import ProductManager from "../dao/db/product-manager-db.js";
import CartManager from "../dao/db/cart-manager-db.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/realtimeproducts", (req, res) => {
    try {
        res.render("realtimeproducts");
    } catch (error) {
        console.error("Error al mostrar los productos", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

router.get("/productos", async (req, res) => {
    const { page = 1, limit = 10, sort = 'asc' } = req.query;
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { price: sort === 'asc' ? 1 : -1 }
    };

    try {
        const productos = await productManager.getProducts({}, options);
        res.render("home", { productos });
    } catch (error) {
        console.error("Error al mostrar los productos", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carrito = await cartManager.getCarritoById(cartId);
        res.render("cart", { carrito });
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;