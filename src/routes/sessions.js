import { Router } from "express";
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = "coderhouse";

// Ruta de registro
router.post("/register", async (req, res) => {
    const { user, password } = req.body;

    try {
        // Verificamos si el usuario ya existe
        const existeUser = await UserModel.findOne({ user });

        if (existeUser) {
            return res.status(400).send("El usuario ya existe");
        }

        // Creamos el nuevo usuario
        const newUser = new UserModel({
            user,
            password: createHash(password)
        });

        // Lo guardamos
        await newUser.save();

        // Generamos el token de JWT
        const token = jwt.sign({ user: newUser.user, role: newUser.role }, JWT_SECRET, { expiresIn: "1h" });

        // Generamos la cookie
        res.cookie("coderCookieToken", token, {
            maxAge: 3600000,
            httpOnly: true // Accesible solo mediante peticiones HTTP
        });

        res.redirect("/productos");

    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
});

// Ruta de login
router.post("/login", async (req, res) => {
    const { user, password } = req.body;

    try {
        // Buscamos el usuario en MongoDB
        const userEncontrado = await UserModel.findOne({ user });

        // Verificamos si el usuario existe
        if (!userEncontrado) {
            return res.status(401).send("Usuario no válido");
        }

        // Verificamos la contraseña
        if (!isValidPassword(password, userEncontrado)) {
            return res.status(401).send("Contraseña incorrecta");
        }

        // Generamos el token de JWT
        const token = jwt.sign({ user: userEncontrado.user, role: userEncontrado.role }, JWT_SECRET, { expiresIn: "1h" });

        // Generamos la cookie
        res.cookie("coderCookieToken", token, {
            maxAge: 3600000, // 1 hora de vida
            httpOnly: true // Accesible solo mediante peticiones HTTP
        });

        res.redirect("/productos");

    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
});

// Ruta para obtener la información del usuario actual
router.get("/productos", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (req.user) {
        res.render("home", { user: req.user.user });
    } else { 
        res.status(401).send("No Autenticado, Token Inválido");
    }
});

// Ruta para cerrar sesión
router.get("/logout", (req, res) => {
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
});

//Ruta exclusiva para admins: 

router.get("/admin", passport.authenticate("jwt", {session:false}), (req, res) => {
    if(req.user.role !== "admin") {
        return res.status(403).send("Acceso denegado, no eres Admin 😒!!"); 
    } 
    res.render("admin"); 
});


export default router;
