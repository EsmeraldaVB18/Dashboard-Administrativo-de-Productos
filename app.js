let skip = 0;
const limit = 10;
let totalProductos = 0;
let paginaActual = 1;

const tabla = document.getElementById("tablaProductos");
const infoPagina = document.getElementById("infoPagina");

const cargarProductos = async (filtros = {}) => {

    let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;

    if (filtros.busqueda) {
        url = `https://dummyjson.com/products/search?q=${filtros.busqueda}`;
    }

    if (filtros.categoria) {
        url = `https://dummyjson.com/products/category/${filtros.categoria}`;
    }

    if (filtros.ordenar) {
        url += `&sortBy=${filtros.ordenar.campo}&order=${filtros.ordenar.tipo}`;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();

        totalProductos = data.total || data.products.length;

        renderizarTabla(data.products);
        actualizarPaginacion();

    } catch (error) {
        console.error("Error:", error);
    }
};

const renderizarTabla = (productos) => {

    tabla.innerHTML = "";

    productos.forEach(producto => {
        tabla.innerHTML += `
        <tr>
            <td>${producto.id}</td>
            <td><img src="${producto.thumbnail}" width="50"></td>
            <td>${producto.title}</td>
            <td>$${producto.price}</td>
            <td>${producto.category}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarProducto(${producto.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${producto.id})">Eliminar</button>
            </td>
        </tr>
        `;
    });
};

const actualizarPaginacion = () => {
    const totalPaginas = Math.ceil(totalProductos / limit);
    infoPagina.textContent = `Página ${paginaActual} de ${totalPaginas}`;
};

document.getElementById("btnSiguiente").addEventListener("click", () => {
    if (skip + limit < totalProductos) {
        skip += limit;
        paginaActual++;
        cargarProductos();
    }
});

document.getElementById("btnAnterior").addEventListener("click", () => {
    if (skip >= limit) {
        skip -= limit;
        paginaActual--;
        cargarProductos();
    }
});

document.getElementById("btnBuscar").addEventListener("click", () => {
    skip = 0;
    paginaActual = 1;
    const valor = document.getElementById("inputBusqueda").value;
    cargarProductos({ busqueda: valor });
});

document.getElementById("selectOrden").addEventListener("change", (e) => {
    const valor = e.target.value;
    if (!valor) return;

    const [campo, tipo] = valor.split("-");
    cargarProductos({
        ordenar: { campo, tipo }
    });
});

const cargarCategorias = async () => {
    const res = await fetch("https://dummyjson.com/products/category-list");
    const categorias = await res.json();

    const select = document.getElementById("selectCategorias");

    categorias.forEach(cat => {
        select.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
};

document.getElementById("selectCategorias").addEventListener("change", (e) => {
    skip = 0;
    paginaActual = 1;
    cargarProductos({ categoria: e.target.value });
});

const eliminarProducto = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

    await fetch(`https://dummyjson.com/products/${id}`, {
        method: "DELETE"
    });

    alert("Producto eliminado (simulado)");
    cargarProductos();
};

const editarProducto = async (id) => {

    const nuevoTitulo = prompt("Nuevo título:");
    const nuevoPrecio = prompt("Nuevo precio:");

    if (!nuevoTitulo || !nuevoPrecio) return;

    await fetch(`https://dummyjson.com/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: nuevoTitulo,
            price: nuevoPrecio
        })
    });

    alert("Producto actualizado (simulado)");
    cargarProductos();
};

cargarProductos();
cargarCategorias();