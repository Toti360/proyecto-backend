
import fs from 'fs/promises';
import path from 'path';

class ProductManager {
    static ultId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Todos los campos son obligatorios!!");
            return;
        }

        if (this.products.some(item => item.code === code)) {
            console.log("El código debe ser único");
            return;
        }

        const nuevoProducto = {
            id: ++ProductManager.ultId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        this.products.push(nuevoProducto);
        // Guardado en el archivo
        await this.guardarArchivo(this.products);
    }

    async getProducts() {
        let arrayProductos = await this.leerArchivo();
        return arrayProductos;
    }

    async getProductById(id) {
        try {
            const productos = await this.leerArchivo();
            const producto = productos.find(item => item.id === id);
            if (!producto) {
                console.error("Not Found");
                return null;
            } else {
                return producto;
            }
        } catch (error) {
            console.log("Error al obtener el producto: ", error);
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const productos = await this.leerArchivo();
            const index = productos.findIndex(item => item.id === id);
            if (index === -1) {
                console.error("Producto no encontrado");
                return null;
            }

            // Actualiza sólo los campos proporcionados
            const productoActualizado = { ...productos[index], ...updatedFields, id };

            productos[index] = productoActualizado;
            await this.guardarArchivo(productos);
            return productoActualizado;
        } catch (error) {
            console.log("Error al actualizar el producto: ", error);
        }
    }

    async deleteProduct(id) {
        try {
            const productos = await this.leerArchivo();
            const index = productos.findIndex(item => item.id === id);
            if (index === -1) {
                console.error("Producto no encontrado");
                return null;
            }

            productos.splice(index, 1);
            await this.guardarArchivo(productos);
            console.log(`Producto con ID ${id} eliminado.`);
            return true;
        } catch (error) {
            console.log("Error al eliminar el producto: ", error);
            return false;
        }
    }

    // Métodos auxiliares para guardarArchivo y leerArchivo.

    async guardarArchivo(arrayProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
        } catch (error) {
            console.log("Error al guardar el archivo: ", error);
        }
    }

    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const array = JSON.parse(respuesta);
            return array;
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log("El archivo no existe, se creará uno nuevo.");
                await this.guardarArchivo([]);
                return [];
            } else {
                console.log("Error al leer el archivo: ", error);
                throw error;
            }
        }
    }
}

export default ProductManager;

