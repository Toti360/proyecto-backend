import express from "express";
import ProductManager from "../dao/db/product-manager-db.js";

const router = express.Router();

const productManager = new ProductManager();

//Listar todos los productos con paginación, límite, filtro y ordenamiento
router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const filter = {};

        // Construir el filtro basado en la query
        if (query) {
            const queryObject = JSON.parse(query);
            Object.assign(filter, queryObject);
        }

        // Construir el orden basado en el sort
        const sortOption = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: sortOption
        };

        const result = await productManager.getProducts(filter, options);

        const response = {
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.hasPrevPage ? result.prevPage : null,
            nextPage: result.hasNextPage ? result.nextPage : null,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null
        };

        res.json(response);
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            status: "error",
            error: "Error interno del servidor"
        });
    }
});

//Trae solo producto por id 
router.get("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const producto = await productManager.getProductById(id);
        if (!producto) {
            return res.json({
                error: "Producto no encontrado"
            });
        }

        res.json(producto);
    } catch (error) {
        console.error("Error al obtener producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

//Agregar producto
router.post("/", async (req, res) => {
    const nuevoProducto = req.body;

    try {
        await productManager.addProduct(nuevoProducto);
        res.status(201).json({
            message: "Producto agregado exitosamente!!"
        });
    } catch (error) {
        console.error("Error al agregar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

//Actualizar por Id
router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const productoActualizado = req.body;

    try {
        await productManager.updateProduct(id, productoActualizado);
        res.json({
            message: "Producto actualizado exitosamente"
        });
    } catch (error) {
        console.error("Error al actualizar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

//Eliminar producto
router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        await productManager.deleteProduct(id);
        res.json({
            message: "Producto eliminado exitosamente"
        });
    } catch (error) {
        console.error("Error al eliminar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

export default router;
