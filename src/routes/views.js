import { Router } from "express";
import ProductManager from "../dao/db/product-manager-db.js";
import CartManager from "../dao/db/cart-manager-db.js";
import jwt from "jsonwebtoken";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// Clave secreta para JWT
const JWT_SECRET = "coderhouse";

// Middleware para verificar JWT
function authenticateJWT(req, res, next) {
    const token = req.cookies["coderCookieToken"];
    if (!token) {
        return res.redirect("/login");
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.redirect("/login");
        }
        req.user = user;
        next();
    });
}

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

router.get("/productos", authenticateJWT, async (req, res) => {
    const { page = 1, limit = 10, sort = 'asc' } = req.query;
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { price: sort === 'asc' ? 1 : -1 }
    };

    try {
        const productos = await productManager.getProducts({}, options);
        res.render("home", { productos: productos.docs, ...productos, user: req.user });
    } catch (error) {
        console.error("Error al mostrar los productos", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get("/carts/:cid", authenticateJWT, async (req, res) => {
    const cartID = req.params.cid;

    try {
        const carrito = await cartManager.getCarritoById(cartID);

        if (!carrito) {
            console.log("No existe el carrito");
            return res.status(404).json({error: "Carrito no encontrado"});
        }

        const productosEnCarrito = carrito.products.map(item => ({
            product: item.product.toObject(),
            quantity: item.quantity
        }));

        res.render("carts", {productos: productosEnCarrito, user: req.user});
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
});

router.get("/login", (req, res) => {
    const token = req.cookies["coderCookieToken"];
    if (token) {
        return res.redirect("/productos"); 
    }
    res.render("login");
});

router.get("/register", (req, res) => {
    const token = req.cookies["coderCookieToken"];
    if (token) {
        return res.redirect("/productos"); 
    }
    res.render("register");
});

router.get("/profile", authenticateJWT, (req, res) => {
    res.render("profile", {user: req.user});
});

router.get("/productos", authenticateJWT, (req, res) => {
    res.render("productos", {user: req.user});
});

export default router;
