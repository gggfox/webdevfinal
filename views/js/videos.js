let apiKey = "AIzaSyCepMSKBmBYkCIjoLAqZv1qe53B0GY5tSo"

function display_results(data) {
    let display = document.getElementById('video-results');

    //display 10 results at a time
    display.innerHTML = "";
    for (let i = 0; i < data.items.length; i++) {
        let videoTitle = data.items[i].snippet.title;
        let videoImg = data.items[i].snippet.thumbnails.default.url;
        let videoId = data.items[i].id.videoId;

        //console.log(videoId);
        display.innerHTML += `
        <span class="api_response">
            <a class="video-link" href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
                <h3 class="searchable-text">${videoTitle}</h3>
                <img class="searchable"src="${videoImg}"/>
            </a>
        </span>
        `;
    }
}



function print() {
    let query = "Liquid Cooling";
    let url =
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${query}&key=${apiKey}`;
    let settings = {
        method: 'GET'
    };
    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            display_results(responseJSON);
        })
        .catch(err => {
            console.log(err.message);
        })
}


function init() {
    print();
}

init();