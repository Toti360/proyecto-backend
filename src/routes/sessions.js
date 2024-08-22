import { Router } from "express";
import UserModel from "../dao/models/user.model.js";
import CartManager from "../dao/db/cart-manager-db.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = "coderhouse";

// Ruta de registro
router.post("/register", async (req, res) => {
const { first_name, last_name, email, password, age, role } = req.body;

try {
    // Verificamos si el usuario ya existe
    const existeUser = await UserModel.findOne({ email: email });

    if (existeUser) {
    return res.status(400).json({ error: "El usuario ya existe" });
    }

    // Creamos un nuevo carrito
    const cartManager = new CartManager();
    const carrito = await cartManager.crearCarrito();

    // Creamos el nuevo usuario
    const newUser = new UserModel({
    first_name,
    last_name,
    email,
    cart_id: carrito._id,
    password: createHash(password),
    age,
    role: role || "usuario",
    });

    // Lo guardamos
    await newUser.save();

    // Generamos el token de JWT
    const token = jwt.sign(
    { email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: "1h" }
    );

    // Generamos la cookie
    res.cookie("coderCookieToken", token, {
    maxAge: 3600000,
    httpOnly: true, // Accesible solo mediante peticiones HTTP
    });

    res.redirect("/productos");

} catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ error: `Error interno del servidor: ${error.message}` });
}
});

// Ruta de login
router.post("/login", async (req, res) => {
const { email, password } = req.body;

try {
    // Buscamos el usuario en MongoDB
    const userEncontrado = await UserModel.findOne({ email });

    // Verificamos si el usuario existe
    if (!userEncontrado) {
    return res.status(401).send("Usuario no válido");
    }

    // Verificamos la contraseña
    if (!isValidPassword(password, userEncontrado)) {
    return res.status(401).send("Contraseña incorrecta");
    }

    // Generamos el token de JWT
    const token = jwt.sign(
    { email: userEncontrado.email, role: userEncontrado.role }, JWT_SECRET, { expiresIn: "1h" }
    );

    // Generamos la cookie
    res.cookie("coderCookieToken", token, {
      maxAge: 3600000, // 1 hora de vida
      httpOnly: true, // Accesible solo mediante peticiones HTTP
    });

    res.redirect("/productos");
} catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ error: `Error interno del servidor: ${error.message}` });
}
});

// Ruta para obtener la información del usuario actual
router.get("/productos", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (req.user) {
    res.render("home", { email: req.user.email });
    } else {
    res.status(401).send("No Autenticado, Token Inválido");
    }
    }
);

// Ruta para cerrar sesión
router.get("/logout", (req, res) => {
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
});

//Ruta exclusiva para admins:

router.get("/admin", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (req.user.role !== "admin") {
    return res.status(403).send("Acceso denegado, no eres Admin 😒!!");
    }
    res.render("admin");
    }
);

export default router;
