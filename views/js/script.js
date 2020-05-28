const API_TOKEN = "'2abbf7c3-245b-404f-9473-ade729ed4653'";
let url = "/validate-token";
let settings = {
    method: 'GET',
    headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        sessiontoken: localStorage.getItem('token')
    }
};

fetch(url, settings)
    .then(response => {
        if (response.ok) {
            return response.json();
        }

        throw new Error(response.statusText);
    })
    .then(responseJSON => {
        let greeting = document.querySelector('.greeting');
        greeting.innerHTML = `Welcome back ${responseJSON.username}!`;
    })
    .catch(err => {
        console.log(err.message);
        //window.location.href = "/";
    });