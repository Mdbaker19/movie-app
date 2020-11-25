$(document).ready(function() {
    const baseURL = 'https://accidental-petite-cruiser.glitch.me/movies';
    let allMovies = [];
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


//======INITIAL GET==========//
    fetch(baseURL)
        .then(response => response.json())
        .then(response => {
            $("#after").css("display", "flex");
            $("#load").fadeOut(300);
            allMovies = response;
            console.log(allMovies);
            showMovies(allMovies);
            canRemove();
        });

//============POST============//
    const addMovie = (movie) => fetch(`${baseURL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movie)
    })
        .then(res => res.json())
        .then(data => {
            $(".movieSection").innerHTML += render(data);
            console.log(`Success: created ${JSON.stringify(data)}`);
            return data.id; // to access the primary key of the newly created entity
        })
        .catch(console.error);

//============= PUT==EDIT==============//
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


//===================DELETE==============//
const deleteMovie = (id) => fetch(`${baseURL}/${id}`, {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json'
    }
}).then(response => response.json()
).then(() => {
    console.log(`Success, deleted movie ${id}`);
}).catch(error => console.log(error));










//=============OTHER FUNCTIONS=================//








function showMovies(arr){
    for(let i = 0; i < arr.length; i++){
        $(".movieSection")[0].insertAdjacentHTML("afterbegin", render(arr[i]));
    }
}

let url = "https://api.themoviedb.org/3/movie/550?api_key="
fetch(`${url}${movieKey}`).then((r) => r.json()).then(d => {
    console.log(d);
}).catch(err => console.log(err));



    function createMovie(i1, i2, i3){
        let newMovie = {
            title: i1,
            rating: i2,
            genre: i3,
        }
        return newMovie
    }

    function render(data){
        return `<div class="movieCard">
        <span id="forDelete">${data.id}</span>
        <button class="delete">X</button>
        <h1>${data.title}</h1>
        <p>${data.rating}</p>
        <p>${data.genre}</p>
        </div>`;
    }

    $("#submit").on("click", function (){
        addMovie(createMovie(title.val(), rating.val(), genre.val())).then(response => console.log(response));
    });


    function canRemove() {
        $("body").on("click", ".delete", function () {
            deleteMovie($(this).parent().children().first()[0].innerText).then();
        });
    }




//    var moviesSection = document.querySelector(".movieSection")
// moviesSection.removeChild(moviesSection.children[2])
});