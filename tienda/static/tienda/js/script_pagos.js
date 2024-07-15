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

$(document).ready(function() {
    $('#paymentForm').on('submit', function(event) {
        event.preventDefault();
        
        var formData = {
            'nombre': $('#nombre').val(),
            'numero': $('#numero').val(),
            'caducidad': $('#caducidad').val(),
            'cvv': $('#cvv').val(),
            'monto': $('#monto').val(),
            'tipo': $('#tipo').val(),
            'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val()
        };

        var url = $(this).attr('action');

        $.ajax({
            type: 'POST',
            url: url,
            data: formData,
            success: function(response) {
                if (response.status === 'ok') {
                    alert('Pago realizado con éxito!');
                    window.location.href = "{% url 'index' %}"; // Redirigir a la página de inicio o a una página de confirmación
                } else {
                    alert(response.message);
                }
            },
            error: function(response) {
                alert('Error al realizar el pago. Inténtalo de nuevo.');
            }
        });
    });
});

