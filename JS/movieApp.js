$(document).ready(function() {
    const baseURL = 'https://accidental-petite-cruiser.glitch.me/movies'
    let currentMovie = []
    let movie1 = {
        "title": "up",
        "rating": "5",
        "poster": "https: //m.media-amazon.com/images/M/MV5BMTk3NDE2NzI4NF5BMl5BanBnXkFtZTgwNzE1MzEyMTE@._V1_SX300.jpg",
        "year": "2009",
        "genre": "Animation, Adventure, Comedy, Family",
        "director": "Pete Docter, Bob Peterson(co-director)",
        "plot": "78-year-old Carl Fredricksen travels to Paradise Falls in his house equipped with balloons, inadvertently taking a young stowaway.",
        "actors": "Edward Asner, Christopher Plummer, Jordan Nagai, Bob Peterson",
        "id": 1
    }
    let title = $("#title");
    let rating = $("#ratingStars");
    let genre = $("#genre")



    //title, rating, genre
    function createMovie(i1, i2, i3){
        let newMovie = {
            title: i1,
            rating: i2,
            genre: i3,
        }
        return newMovie
    }






//=====POST
    const addMovie = (movie) => fetch(`${baseURL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movie)
    })
        .then(res => res.json())
        .then(data => {
            console.log(`Success: created ${JSON.stringify(data)}`);
            return data.id; // to access the primary key of the newly created entity
        })
        .catch(console.error);
// addMovie(createMovie('Terminator','5 Stars', "Action")).then((response) => console.log(response));







//===== PUT => EDIT
    const editMovie = movie => fetch(`${baseURL}/${movie.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movie)
    })
        .then(res => res.json())
        .then(data => {
            console.log(`Success: edited ${JSON.stringify(data)}`);
        })
        .catch(console.error);




//======GET
    fetch(baseURL)
        .then(response => response.json())
        .then(response => {
            console.log(response);
           currentMovie = response;
            $("#after").css("display", "block");
            $("#load").fadeOut(300);
        });




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




});