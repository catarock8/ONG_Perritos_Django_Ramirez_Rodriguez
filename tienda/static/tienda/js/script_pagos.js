document.addEventListener("DOMContentLoaded", function() {
    // Function to get URL parameters
    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    // Get the total parameter from URL
    let total = getParameterByName('total');
    
    // Display the total on the page
    if (total) {
        document.getElementById('monto-display').innerText = `Monto a Pagar: $${total}`;
        document.getElementById('monto').value = total;
    }
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