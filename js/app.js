// *************************************Variables
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

// ************************************* A function to register all EventListeners
caragarEventListeners();
function caragarEventListeners() {
    // When you add a course by clicking "Adding to Cart"
    listaCursos.addEventListener('click', agregarCurso);

    // Remove courses from cart
    carrito.addEventListener('click', eliminarCurso);

    // Shows Local Storage courses
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
    });

    // Empty the cart
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = []; // We reset the arrangement

        limpiarHTML();  // We remove all HTML
    });
}

//*****************************************functions
function agregarCurso(e) {
    e.preventDefault();
    
    if(e.target.classList.contains('agregar-carrito')){
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }
}

// Remove a course from the cart
function eliminarCurso(e) {
    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id');

        // Remove from the items arrayCart by the data-id
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);

        carritoHTML(); // Iterate over the cart again and show its HTML
    }
}

// Read the content of the HTML that we clicked on and extract the course information
function leerDatosCurso(curso) {

    //Create an object with the current course content
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    };

    // Check if an item already exists in the cart
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id );
    
    if (existe) {
        // We update the quantity
        const cursos = articulosCarrito.map( curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso;   // Returns the updated object
            }else{
                return curso;   // Returns objects that are not duplicates
            }
        });
        articulosCarrito = [...cursos];
    }else{
        // We add the course to the cart
        // Add items to cart arrangement
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    carritoHTML();
}

// Show the shopping cart in the HTML
function carritoHTML() {

    // Clean the HTML
    limpiarHTML();

    // Go through the cart and generate the HTML
    articulosCarrito.forEach( curso => {
        const { imagen, titulo, precio, cantidad, id} = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src = "${imagen}" width = "100">
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}"> X </a>
            </td>
        `;

        // Add cart HTML
        contenedorCarrito.appendChild(row);
    });

    // Add the shopping cart to storage
    sincronizarStorage();
}

// Add the shopping cart to storage
function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// Remove courses from tbody
function limpiarHTML() {
    // Slow way to clean
    // contenedorCarrito.innerHTML = '';

    //Fast and optimized way
    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}