const baseURL = 'https://accidental-petite-cruiser.glitch.me/movies'
$(document).ready(function() {
    fetch(baseURL)
        .then(response => response.json())
        .then(response => {
            console.log(response);
            $("#after").css("display", "block");
            $("#load").fadeOut(300);
        });
});


//===== PUT => EDIT





//======GET




//=======DELETE
const deleteMovie = (id) => fetch(`${baseURL}/${id}`, {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json'
    }
}).then(response => response.json()
).then(() => {
    console.log(`Success, deleted movie ${id}`);
}).catch(error => console.log(error));

// deleteMovie(1).then((data) => console.log(data));

// ========= EDIT


