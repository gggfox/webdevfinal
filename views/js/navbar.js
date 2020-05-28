let url = "/validate-token";
let settings = {
    method: 'GET',
    headers: {
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
        console.log(responseJSON);
        if (responseJSON !== null) {
            let profilebtn = document.querySelector('.nav-link-login');
            profilebtn.href = "/profile";
            console.log(profilebtn.href);
        }
    })
    .catch(err => {
        console.log(err.message);
    });