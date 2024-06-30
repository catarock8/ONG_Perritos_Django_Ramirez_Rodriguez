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
