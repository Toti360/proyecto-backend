import ProductModel from "../models/product.model.js";

class ProductManager {

    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {
            if (!title || !description || !price || !thumbnails || !code || !stock || !category) {
                console.log("Todos los campos son obligatorios!!");
                return;
            }

            const existeProducto = await ProductModel.findOne({ code: code });

            if (existeProducto) {
                console.log("El código debe ser único");
                return;
            }

            const newProduct = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            });

            await newProduct.save();

        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        }
    }

    async getProducts(filter = {}, options = {}) {
        try {
            const result = await ProductModel.paginate(filter, options);
            result.docs = result.docs.map(doc => doc.toObject());
            return result;
        } catch (error) {
            console.log("Error al obtener los productos", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const buscado = await ProductModel.findById(id);

            if (!buscado) {
                console.log("Producto no encontrado");
                return null;
            } else {
                console.log("Producto encontrado");
                return buscado;
            }
        } catch (error) {
            console.log("Error al buscar producto por id", error);
            throw error;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const producto = await ProductModel.findByIdAndUpdate(id, updatedFields);
            if (!producto) {
                console.log("No se encuentra el producto a actualizar");
                return null;
            } else {
                console.log("Producto actualizado con éxito!!");
                return producto;
            }
        } catch (error) {
            console.log("Error al actualizar el producto", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const borrado = await ProductModel.findByIdAndDelete(id);
            if (!borrado) {
                console.log("No se encuentra el producto que se debe borrar");
                return null;
            } else {
                console.log("Producto eliminado!");
                return borrado;
            }
        } catch (error) {
            console.log("Error al eliminar el producto", error);
            throw error;
        }
    }
}

export default ProductManager;
