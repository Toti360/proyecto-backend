const socket = io();

socket.on("productos", (data) => {
    renderProductos(data);
});

const renderProductos = (data) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";

    data.forEach(item => {
        const card = document.createElement("div");

        card.innerHTML = `<p> ${item.id} </p>
                            <p> ${item.title} </p>
                            <p> ${item.description} </p>
                            <p> ${item.price} </p>
                            <p> ${item.thumbnails} </p>
                            <p> ${item.code} </p>
                            <p> ${item.stock} </p>
                            <p> ${item.category} </p>
                            <p> ${item.status} </p>
                            <button> ELIMINAR ❌ </button>
                            `;
        contenedorProductos.appendChild(card);

        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item.id);
        });
    });
};

const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
};

// Agrega Productos con Formulario
document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
});

const agregarProducto = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        thumbnails: document.getElementById("thumbnails").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
    };

    socket.emit("agregarProducto", producto);

    // Limpiar los campos del formulario después de enviar el producto
    document.getElementById("title").value = '';
    document.getElementById("description").value = '';
    document.getElementById("price").value = '';
    document.getElementById("thumbnails").value = 'Sin Imagen';
    document.getElementById("code").value = '';
    document.getElementById("stock").value = '';
    document.getElementById("category").value = '';
    document.getElementById("status").value = 'true';
};
