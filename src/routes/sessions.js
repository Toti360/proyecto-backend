
import { Router } from "express";
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = "coderhouse";

// Ruta de registro
router.post("/register", async (req, res) => {
    const { usuario, password } = req.body;

    try {
        // Verificamos si el usuario ya existe
        const existeUsuario = await UserModel.findOne({ usuario });

        if (existeUsuario) {
            return res.status(400).send("El usuario ya existe");
        }

        // Creamos el nuevo usuario
        const nuevoUsuario = new UserModel({
            usuario,
            password: createHash(password)
        });

        // Lo guardamos
        await nuevoUsuario.save();

        // Generamos el token de JWT
        const token = jwt.sign({ usuario: nuevoUsuario.usuario, rol: nuevoUsuario.rol }, JWT_SECRET, { expiresIn: "1h" });

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

// Ruta de login
router.post("/login", async (req, res) => {
    const { usuario, password } = req.body;

    try {
        // Buscamos el usuario en MongoDB
        const usuarioEncontrado = await UserModel.findOne({ usuario });

        // Verificamos si el usuario existe
        if (!usuarioEncontrado) {
            return res.status(401).send("Usuario no válido");
        }

        // Verificamos la contraseña
        if (!isValidPassword(password, usuarioEncontrado)) {
            return res.status(401).send("Contraseña incorrecta");
        }

        // Generamos el token de JWT
        const token = jwt.sign({ usuario: usuarioEncontrado.usuario, rol: usuarioEncontrado.rol }, JWT_SECRET, { expiresIn: "1h" });

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
router.get("/productos", (req, res) => {
    const token = req.cookies["coderCookieToken"];
    if (!token) {
        return res.status(401).send("No autenticado");
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send("Token inválido");
        }

        res.json({
            usuario: decoded.usuario,
            rol: decoded.rol
        });
    });
});

// Ruta para cerrar sesión
router.get("/logout", (req, res) => {
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
});

//Ruta exclusiva para admins: 

router.get("/admin", passport.authenticate("jwt", {session:false}), (req, res) => {
    if(req.user.rol !== "admin") {
        return res.status(403).send("Acceso denegado, no eres Admin.!!"); 
    } 
    res.render("admin"); 
})


export default router;
