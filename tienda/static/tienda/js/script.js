// PRIMERA FUNCION SOLICITADA
function modoNocturno() {
    console.log("entro aqui");
    document.body.classList.toggle('modo-noc');
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.classList.toggle('navbar-modo-noc');
    }
    const modals = document.querySelectorAll('.modal-content');
    modals.forEach(modal => {
        modal.classList.toggle('modo-noc');
    });
    
    // Guardar el estado del modo nocturno en localStorage
    const isModoNocturno = document.body.classList.contains('modo-noc');
    localStorage.setItem('modoNocturno', isModoNocturno);
}

// SEGUNDA FUNCION SOLICITADA
$(document).ready(function() {
    $('.zoom').hover(
        function() {
            $(this).css('transform', 'scale(1.1)');
        }, 
        function() {
            $(this).css('transform', 'scale(1)');
        }
    );

    // Cargar el carrito desde localStorage al cargar la página
    loadCartFromLocalStorage();

    // Cargar el estado del modo nocturno desde localStorage
    loadModoNocturnoFromLocalStorage();

    // Añadir eventos para los botones "Agregar al Carrito"
    document.querySelectorAll('.agregar-carrito').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            let productoId = this.getAttribute('data-id');
            let productName = this.getAttribute('data-name');
            let productPrice = parseFloat(this.getAttribute('data-price'));
            let productImage = this.getAttribute('data-image');
            addToCart(productName, productPrice, productImage);
            actualizarCantidad(productoId);
        });
    });

    // Añadir evento para el botón "Borrar Todo"
    document.getElementById('clear-cart').addEventListener('click', function() {
        clearCart();
    });
});

// FUNCION PARA EL CARRO DE COMPRAS
let cart = [];
let totalPrice = 0;

function addToCart(productName, productPrice, productImage) {
    // Añadir producto al carrito
    cart.push({ name: productName, price: productPrice, image: productImage });
    // Actualizar el precio total
    totalPrice += productPrice;
    // Actualizar la interfaz de usuario
    updateCartUI();
    // Guardar el carrito en localStorage
    saveCartToLocalStorage();
}

function removeFromCart(index) {
    // Restar el precio del producto eliminado del total
    totalPrice -= cart[index].price;
    // Eliminar el producto del carrito
    cart.splice(index, 1);
    // Actualizar la interfaz de usuario
    updateCartUI();
    // Guardar el carrito en localStorage
    saveCartToLocalStorage();
}

function clearCart() {
    // Vaciar el carrito y reiniciar el precio total
    cart = [];
    totalPrice = 0;
    // Actualizar la interfaz de usuario
    updateCartUI();
    // Guardar el carrito en localStorage
    saveCartToLocalStorage();
}

function updateCartUI() {
    const cartItemsElement = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    // Limpiar la lista del carrito
    cartItemsElement.innerHTML = '';

    // Añadir cada producto del carrito a la lista
    cart.forEach((item, index) => {
        const li = document.createElement('li');

        // Crear y añadir el texto del item
        const text = document.createElement('span');
        text.textContent = `${item.name} - $${item.price}`;
        li.appendChild(text);

        // Crear y añadir la imagen del item
        const img = document.createElement('img');
        img.src = item.image; // URL de la imagen del producto
        img.alt = item.name;
        img.style.width = '50px'; // Tamaño pequeño para la imagen
        img.style.height = '50px'; // Tamaño pequeño para la imagen
        img.style.marginLeft = '10px'; // Espacio entre el texto y la imagen
        li.appendChild(img);

        // Crear y añadir el botón de eliminar
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Eliminar';
        removeButton.style.marginLeft = '10px';
        removeButton.onclick = () => removeFromCart(index);
        li.appendChild(removeButton);

        cartItemsElement.appendChild(li);
    });

    // Actualizar el precio total
    totalPriceElement.textContent = totalPrice;
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('totalPrice', totalPrice.toString());
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    const savedTotalPrice = localStorage.getItem('totalPrice');

    if (savedCart && savedTotalPrice) {
        cart = JSON.parse(savedCart);
        totalPrice = parseFloat(savedTotalPrice);
        updateCartUI();
    }
}

function loadModoNocturnoFromLocalStorage() {
    const isModoNocturno = localStorage.getItem('modoNocturno') === 'true';
    if (isModoNocturno) {
        document.body.classList.add('modo-noc');
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.add('navbar-modo-noc');
        }
        const modals = document.querySelectorAll('.modal-content');
        modals.forEach(modal => {
            modal.classList.add('modo-noc');
        });
    }
}

// Añadir evento al botón "IR A PAGAR"
document.getElementById('go-to-pay').addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = `{% url 'paginadepagos' %}?total=${totalPrice}`;
});

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function setTotalAmount() {
    const totalAmount = getQueryParam('total');
    if (totalAmount) {
        document.getElementById('monto-display').innerText = `Monto a Pagar: $${totalAmount}`;
        document.getElementById('monto').value = totalAmount;
    }
}

window.onload = setTotalAmount;

// Código para manejar el carrito y la cantidad de productos en tiempo real
let carrito = JSON.parse(localStorage.getItem('carrito')) || {};

function actualizarCarrito() {
    document.querySelectorAll('.agregar-carrito').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            let productoId = this.getAttribute('data-id');
            if (carrito[productoId]) {
                carrito[productoId] += 1;
            } else {
                carrito[productoId] = 1;
            }
            localStorage.setItem('carrito', JSON.stringify(carrito));
            actualizarCantidad(productoId);
        });
    });
}

function actualizarCantidad(productoId) {
    fetch(`/api/productos/${productoId}/cantidad/`)
        .then(response => response.json())
        .then(data => {
            document.querySelector(`.cantidad-producto[data-id="${productoId}"]`).innerText = `Quedan: ${data.cantidad}`;
        });
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarCarrito();
    document.querySelectorAll('.cantidad-producto').forEach(element => {
        let productoId = element.getAttribute('data-id');
        actualizarCantidad(productoId);
    });
});

document.getElementById('payment-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    let productos = JSON.parse(localStorage.getItem('carrito')); // Suponiendo que el carrito de compras está almacenado en localStorage

    fetch('{% url "procesar_pago" %}', {
        method: 'POST',
        body: JSON.stringify({
            productos: productos,
            monto: document.getElementById('monto').value,
            nombre: document.getElementById('nombre').value,
            numero: document.getElementById('numero').value,
            caducidad: document.getElementById('caducidad').value,
            cvv: document.getElementById('cvv').value,
            tipo: document.getElementById('tipo').value
        }),
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': '{{ csrf_token }}'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '{% url "index" %}';
        } else {
            alert('Error en el procesamiento del pago.');
        }
    })
    .catch(error => console.error('Error:', error));
});