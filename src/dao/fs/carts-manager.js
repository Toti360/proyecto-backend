import fs from 'fs/promises';
import path from 'path';

class CartManager {
    constructor(filePath) {
        this.carts = [];
        this.path = path.resolve(filePath);
        this.ultId = 0;

        //Carga los carritos almacenados en el archivo
        this.cargarCarritos();
    }

    async cargarCarritos() {
        try {
            const data = await fs.readFile(this.path, "utf8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
            //Verifico si hay por lo menos un carrito creado
                this.ultId = Math.max(...this.carts.map(cart => cart.id));
            //Utilizo el map para crear un nuevo array que solo tenga los id del carrito y luego con Math.max obtengo el mayor. 
            }
            return this.carts; 
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log(`El archivo ${this.path} no existe, se creará uno nuevo.`);
                await this.guardarCarritos();
                return this.carts;
            } else {
                console.error("Error al cargar los carritos desde el archivo", error);
            }
        }
    }

    async guardarCarritos() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error("Error al guardar los carritos", error);
        }
    }

    async crearCarrito() {
        const nuevoCarrito = {
            id: ++this.ultId,
            products: []
        };

        this.carts.push(nuevoCarrito);

        //Guardo el array
        await this.guardarCarritos();
        return nuevoCarrito;
    }

    async getCarritoById(cartId) {
        try {
            const carrito = this.carts.find(c => c.id === cartId);

            if (!carrito) {
                throw new Error(`No existe un carrito con el id ${cartId}`);
            }

            return carrito;
        } catch (error) {
            console.error("Error al obtener el carrito por ID", error);
            throw error;
        }
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        const carrito = await this.getCarritoById(cartId);
        const existeProducto = carrito.products.find(p => p.product === productId);

        if (existeProducto) {
            existeProducto.quantity += quantity;
        } else {
            carrito.products.push({ product: productId, quantity });
        }

        await this.guardarCarritos();
        return carrito;
    }
}

export default CartManager;

