// PRIMERA FUNCION SOLICITADA
// aquí está la primera funcion pedida que activa el formato oscuro
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
// con esta funcion al pasar por encima de las imagenes y los botones se van a agrandar un poco
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
