const API_TOKEN = "'2abbf7c3-245b-404f-9473-ade729ed4653'";

function search_for_user(username, password) {
    let url = '/users/login';
    let data = { username, password };
    let results = document.getElementById('error-password');

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

            window.location.href = "/profile";
        })
        .catch(err => {
            console.log("error");
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}


function watch_login_btn() {
    let btn = document.getElementById('login-btn');
    btn.addEventListener('click', event => {
        event.preventDefault();

        let username = document.getElementById('login-username');
        let usrError = document.getElementById('error-username');
        let password = document.getElementById('login-password');
        let pwdError = document.getElementById('error-password');

        usrError.textContent = "";
        pwdError.textContent = "";

        //(/\s/g, '') removes spaces from string
        if (username.value.replace(/\s/g, '') === "" || password.value.replace(/\s/g, '') === "") {
            if (username.value.replace(/\s/g, '') === "") {
                usrError.textContent = "error usuario vacio";
            }
            if (password.value.replace(/\s/g, '') === "") {
                pwdError.textContent = "error contraseña vacia";
            }
            return;
        }

        if (username.value.length < 5 || password.value.length < 5) {
            if (username.value.length < 5) {
                usrError.textContent = "error nombre de usuario muy chico";
            }
            if (password.value.length < 5) {
                pwdError.textContent = "error contraseña muy chica";
            }
            return;
        }

        if (usrError.textContent === "" && pwdError.textContent === "") {
            search_for_user(username.value, password.value);
        }



    });
}

function init() {
    watch_login_btn();
}

init();