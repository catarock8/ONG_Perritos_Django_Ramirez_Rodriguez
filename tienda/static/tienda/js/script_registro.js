/*Validar RUT */
$(document).ready(function() {
    function calculateDV(rut) {
      var body = rut.slice(0, -1);
      var dv = rut.slice(-1).toUpperCase();
      var sum = 0;
      var multiplier = 2;

      for (var i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i]) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
      }

      var mod11 = 11 - (sum % 11);
      var calculatedDV = mod11 === 11 ? '0' : mod11 === 10 ? 'K' : mod11.toString();

      return dv === calculatedDV;
    }

    $('#rut').on('input', function() {
      var rut = $(this).val().replace(/[^0-9kK]/g, '');
      if (rut.length > 1) {
        rut = rut.slice(0, -1) + '-' + rut.slice(-1);
      }
      if (rut.length > 5) {
        rut = rut.slice(0, -5) + '.' + rut.slice(-5);
      }
      if (rut.length > 9) {
        rut = rut.slice(0, -9) + '.' + rut.slice(-9);
      }
      $(this).val(rut);
      $('#format-error, #dv-error').hide(); // Oculta los mensajes de error mientras escribe
      $('#rut').removeClass('is-invalid'); // Remueve la clase de inválido
    });

    $('#rut').on('blur', function() {
      var formattedRut = $(this).val();
      if (formattedRut === '') {
        $('#format-error, #dv-error').hide(); // Oculta ambos mensajes de error si el campo está vacío
        $('#rut').removeClass('is-invalid'); // Remueve la clase de inválido si está presente
        return;
      }
      var rut = formattedRut.replace(/\./g, '').replace('-', '');
      var rutPattern = /^\d{7,8}[0-9Kk]$/;

      if (!rutPattern.test(rut)) {
        $('#format-error').show(); // Muestra el mensaje de error de formato
        $('#dv-error').hide(); // Oculta el mensaje de error de DV
        $('#rut').addClass('is-invalid'); // Añade clase para mostrar el campo como inválido
      } else if (!calculateDV(rut)) {
        $('#dv-error').show(); // Muestra el mensaje de error de DV
        $('#format-error').hide(); // Oculta el mensaje de error de formato
        $('#rut').addClass('is-invalid'); // Añade clase para mostrar el campo como inválido
      } else {
        $('#format-error, #dv-error').hide(); // Oculta ambos mensajes de error
        $('#rut').removeClass('is-invalid'); // Remueve la clase de inválido si está presente
      }
    });
  });
/*Validar email */
$(document).ready(function() {
    // Función para validar el formato del email
    function validateEmail(email) {
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    }

    $('#email').on('input', function() {
      $('#email-error').hide(); // Oculta el mensaje de error mientras escribe
      $('#email').removeClass('is-invalid'); // Remueve la clase de inválido
    });

    $('#email').on('blur', function() {
      var email = $(this).val();
      if (email === '') {
        $('#email-error').hide(); // Oculta el mensaje de error si el campo está vacío
        $('#email').removeClass('is-invalid'); // Remueve la clase de inválido si está presente
        return;
      }

      if (!validateEmail(email)) {
        $('#email-error').show(); // Muestra el mensaje de error si el email no es válido
        $('#email').addClass('is-invalid'); // Añade clase para mostrar el campo como inválido
      } else {
        $('#email-error').hide(); // Oculta el mensaje de error si el email es válido
        $('#email').removeClass('is-invalid'); // Remueve la clase de inválido si está presente
      }
    });
  });
/* Validar contraseña */
$(document).ready(function() {
    // Función para validar la contraseña
    function validatePassword(password) {
      var passwordPattern = /^(?=.*[A-Z]).{8,}$/;
      return passwordPattern.test(password);
    }

    // Función para mostrar u ocultar la contraseña
    $('#togglePassword').click(function() {
      var passwordField = $('#password');
      var passwordFieldType = passwordField.attr('type');
      var newType = passwordFieldType === 'password' ? 'text' : 'password';
      passwordField.attr('type', newType);
      $(this).text(newType === 'password' ? 'Mostrar' : 'Ocultar');
    });

    $('#toggleConfirmPassword').click(function() {
      var confirmPasswordField = $('#confirmPassword');
      var confirmPasswordFieldType = confirmPasswordField.attr('type');
      var newType = confirmPasswordFieldType === 'password' ? 'text' : 'password';
      confirmPasswordField.attr('type', newType);
      $(this).text(newType === 'password' ? 'Mostrar' : 'Ocultar');
    });

    // Función para limpiar el mensaje de error
    function clearErrorMessage(errorId) {
      $('#' + errorId).empty().hide();
    }

    $('#password, #confirmPassword').on('input', function() {
      var fieldId = $(this).attr('id');
      clearErrorMessage(fieldId + '-error');
    });

    $('#password').on('blur', function() {
      var password = $(this).val();
      if (password.length === 0) {
        return;
      }
      if (!validatePassword(password)) {
        $('#password-error').text('La contraseña debe tener al menos 8 caracteres y al menos una letra mayúscula').show().css('color', 'red');
      }
    });

    $('#confirmPassword').on('blur', function() {
      var confirmPassword = $(this).val();
      var password = $('#password').val();
        if (confirmPassword.length === 0) {
        return;
      }
      if (confirmPassword !== password) {
        $('#confirmPassword-error').text('Las contraseñas no coinciden').show().css('color', 'red');
      }
    });
  });
/*Validar datos para crear cuenta */
$(document).ready(function() {
    // Función para verificar si un campo está vacío
    function campoVacio(campo) {
        return campo.val().trim() === '';
    }

    // Función para verificar si un campo cumple con las verificaciones
    function verificarCampo(campo, mensajeError) {
        var valor = campo.val().trim();
        if (valor === '') {
            mostrarErrorCampo(campo, mensajeError);
            return false;
        }
        return true;
    }

    // Función para mostrar el error de un campo
    function mostrarErrorCampo(campo, mensajeError) {
        campo.addClass('is-invalid');
        campo.next('.invalid-feedback').text(mensajeError).show();
    }

    // Función para ocultar el error de un campo
    function ocultarErrorCampo(campo) {
        campo.removeClass('is-invalid');
        campo.next('.invalid-feedback').hide();
    }

    // Función para mostrar el modal
    function mostrarModal() {
        $('#staticBackdrop').modal('show');
    }

    // Función para ocultar el modal
    function ocultarModal() {
        $('#staticBackdrop').modal('hide');
    }

    // Manejador de evento para el botón "Crear cuenta"
    $('.btn-danger').on('click', function() {
        // Verificar si algún campo está vacío
        var campos = $('#nombres, #apellidoPaterno, #apellidoMaterno, #rut, #email, #password, #confirmPassword');
        var camposVacios = campos.filter(function() {
            return campoVacio($(this));
        });

        if (camposVacios.length > 0) {
            alert('Todos los campos son obligatorios.');
            camposVacios.each(function() {
                mostrarErrorCampo($(this), 'Campo obligatorio');
            });
            return;
        }

        // Verificar si los campos cumplen con las verificaciones
        var valid = true;
        valid = verificarCampo($('#nombres'), 'Campo obligatorio') && valid;
        valid = verificarCampo($('#apellidoPaterno'), 'Campo obligatorio') && valid;
        valid = verificarCampo($('#apellidoMaterno'), 'Campo obligatorio') && valid;
        valid = verificarCampo($('#rut'), 'Formato de RUT inválido') && valid;
        valid = verificarCampo($('#email'), 'Email no válido') && valid;
        valid = verificarCampo($('#password'), 'La contraseña debe tener al menos 8 caracteres y al menos una letra mayúscula') && valid;
        valid = verificarCampo($('#confirmPassword'), 'Las contraseñas no coinciden') && valid;

        if (!valid) {
            return;
        }


        // Mostrar el modal si todos los campos están llenos y verificados
        mostrarModal();
    });

    // Limpiar los errores al empezar a escribir en un campo
    $('input').on('input', function() {
        ocultarErrorCampo($(this));
    });
});

  
  