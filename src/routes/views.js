import { Router } from "express";
import ProductManager from "../managers/products-manager.js";

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

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
    try {
        const productos = await productManager.getProducts();
        res.render("home", { productos });
    } catch (error) {
        console.error("Error al mostrar los productos", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

export default router;
