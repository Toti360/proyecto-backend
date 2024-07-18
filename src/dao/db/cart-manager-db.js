import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

class CartManager {

    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({ products: [] });
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.log("Error al crear carrito", error);
            throw error;
        }
    }

    async getCarritoById(cartId) {
        try {
            const carrito = await CartModel.findById(cartId).populate('products.product');

            if (!carrito) {
                throw new Error(`No existe un carrito con el id ${cartId}`);
            }

            return carrito;
        } catch (error) {
            console.error("Error al obtener el carrito por ID", error);
            throw error;
        }
    }

    async obtenerCarritos() {
        try {
            const carts = await CartModel.find();
            return carts;
        } catch (error) {
            console.error("Error al listar los carritos existentes");
        }
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(cartId);
            const existeProducto = carrito.products.find(item => item.product._id.toString() === productId);

            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ product: productId, quantity });
            }

            carrito.markModified("products");
            await carrito.save();
            return carrito;

        } catch (error) {
            console.error("Error al agregar el producto al carrito", error);
            throw error;
        }
    }

    async eliminarProductoDelCarrito(cartId, productId) {
        try {
            const carrito = await this.getCarritoById(cartId);
            carrito.products = carrito.products.filter(item => item.product._id.toString() !== productId);

            carrito.markModified("products");
            await carrito.save();
            return carrito;

        } catch (error) {
            console.error("Error al eliminar el producto del carrito", error);
            throw error;
        }
    }

    async actualizarCarrito(cartId, productos) {
        try {
            const carrito = await this.getCarritoById(cartId);
            carrito.products = productos;

            carrito.markModified("products");
            await carrito.save();
            return carrito;

        } catch (error) {
            console.error("Error al actualizar el carrito", error);
            throw error;
        }
    }

    async actualizarCantidadProducto(cartId, productId, quantity) {
        try {
            const carrito = await this.getCarritoById(cartId);
            const producto = carrito.products.find(item => item.product._id.toString() === productId);

            if (producto) {
                producto.quantity = quantity;
                carrito.markModified("products");
                await carrito.save();
                return carrito;
            } else {
                throw new Error(`Producto con id ${productId} no encontrado en el carrito`);
            }

        } catch (error) {
            console.error("Error al actualizar la cantidad del producto", error);
            throw error;
        }
    }

    async eliminarTodosLosProductos(cartId) {
        try {
            const carrito = await this.getCarritoById(cartId);
            carrito.products = [];

            carrito.markModified("products");
            await carrito.save();
            return carrito;

        } catch (error) {
            console.error("Error al eliminar todos los productos del carrito", error);
            throw error;
        }
    }
}

export default CartManager;
