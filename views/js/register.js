const API_TOKEN = "'2abbf7c3-245b-404f-9473-ade729ed4653'";

function register_new_user(Username, Email, Password) {
    let url = "/users/register";
    let isManager = false;
    let data = {
        username: Username,
        email: Email,
        password: Password,
        isManager: false
    };
    let results = document.getElementById('error-password-confirmation');

    let settings = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            localStorage.setItem('token', responseJSON.token);
            console.log(responseJSON);

            window.location.href = "/login";
        })
        .catch(err => {
            console.log("error");
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}



function watch_register_form() {
    let registerbtn = document.getElementById('register-btn');
    registerbtn.addEventListener('click', event => {
        event.preventDefault();

        let username = document.getElementById('register-username');
        let email = document.getElementById('register-email');
        let password = document.getElementById('register-password');
        let password_confirmation = document.getElementById('password-confirmation');

        let error_username = document.getElementById('error-username');
        let error_email = document.getElementById('error-email');
        let error_password = document.getElementById('error-password');
        let error_password_confirmation = document.getElementById('error-password-confirmation');

        error_username.textContent = "";
        error_email.textContent = "";
        error_password.textContent = "";
        error_password_confirmation.textContent = "";

        if (username.value.replace(/\s/g, '') === "") {
            error_username.textContent = "error usuario vacio";
        } else {
            if (username.value.length < 4) {
                error_username.textContent = "error nombre de usuario demasiado corto";
            }
        }
        if (email.value.replace(/\s/g, '') === "") {
            error_email.textContent = "error correo vacio";
        } else {
            if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value))) {
                error_email.textContent = "error correo invalido";
            }
        }
        if (password.value.replace(/\s/g, '') === "") {
            error_password.textContent = "error contraseña vacia";
        } else {
            if (password_confirmation.value.replace(/\s/g, '') === "") {
                error_password_confirmation.textContent = "error confirmacion vacia";
            } else {
                if (password_confirmation.value !== password.value) {
                    error_password_confirmation.textContent = "error las contraseñas no coinciden";
                } else {
                    if (password.value.length < 8) {
                        error_password_confirmation.textContent = "la contraseña necesita tener mas de 8 caracteres";
                    }
                }
            }
        }
        if (error_username.textContent === "" ||
            error_email.textContent === "" ||
            error_password.textContent === "" ||
            error_password_confirmation.textContent === "") {
            register_new_user(username.value, email.value, password.value);
        }



    })
}

function init() {
    watch_register_form();
}

init();