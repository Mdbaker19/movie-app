$(document).ready(function() {
    const baseURL = 'https://accidental-petite-cruiser.glitch.me/movies';
    const url = "https://api.themoviedb.org/3/movie/600?api_key=";//=====THE 600 IS CURRENTLY FULL METAL JACKET
    const allURL = `https://api.themoviedb.org/3/search/movie?api_key=${movieKey}&query=`;
    const posterPath = "https://image.tmdb.org/t/p/w500";
    let allMovies = [];
    let title = $("#title");
    let rating = $("#ratingStars");
    let genre = $("#genre");


//======INITIAL GET==========//
    fetch(baseURL)
        .then(response => response.json())
        .then(response => {
            $("#after").css("display", "flex");
            $("#load").fadeOut(300);
            allMovies = response;
            showMovies(allMovies);
            canRemove();
            canEdit();
        });

    //======RECALL THE MOVIES WITH THE EDITED VERSION OF ALL MOVIES ARRAY=======//
    function recallGet() {
        fetch(baseURL)
            .then(response => response.json())
            .then(response => {
                $("#after").css("display", "flex");
                $("#load").fadeOut(300);
                allMovies = response;
                console.log(allMovies);
                canRemove();
                canEdit();
            });
    }


    //========POST===============//
    const newMovie = (movie) => fetch(`${baseURL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movie)
    })
        .then(res => res.json())
        .then(data => {
            $(".movieSection").innerHTML += render(data);
            return data;
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
        recallGet();
        console.log(allMovies);
        console.log(`Success, deleted movie ${id}`);
    }).catch(error => console.log(error));










//=============OTHER FUNCTIONS=================//

    fetch(`${url}${movieKey}`).then((r) => r.json()).then(d => {
        let img = `<img src="${posterPath}${d.poster_path}">`
        $(".movieSection")[0].insertAdjacentHTML("afterbegin", img);
    }).catch(err => console.log(err));


    function getMovieData(movieTitle) {
        fetch(`${allURL}${movieTitle}`).then(r => r.json()).then(d => {
            console.log(d.results[0].poster_path);
            return d.results[0].poster_path;
        });
    }

    getMovieData("up");








    function showMovies(arr){
        for(let i = 0; i < arr.length; i++){
            $(".movieSection")[0].insertAdjacentHTML("afterbegin", render(arr[i]));
        }
    }



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
        <img src="${posterPath}${getMovieData(data.title)}" alt="movieImage">
        <h1>${data.title}</h1>
        <p>${data.rating}</p>
        <p>${data.genre}</p>
        <button class="Edit">Edit</button>
        </div>`;
    }

    $("#submit").on("click", function (){
        newMovie(createMovie(title.val(), rating.val(), genre.val())).then(data => {
            $(".movieSection")[0].insertAdjacentHTML("afterbegin", render(data));
        });
    });


    function canRemove() {
        $("body").on("click", ".delete", function () {
            deleteMovie($(this).parent().children().first()[0].innerText).then();
            $(this).parent().remove();
        });
    }


    function canEdit() {
        $("body").on("click", ".Edit", function () {
            let newId = $(this).parent().children().first()[0].innerText;
            let card = $(this);
            let newMovieObj = {};
            $("#changeMovie").on("click",function(){
                let newTitle = $("#changeTitle").val();
                let newGenre = $("#changeGenre").val();
                let newRating = $("#changeRating").val();
                newMovieObj = {
                    title: newTitle,
                    genre: newGenre,
                    rating: newRating,
                    id: newId
                }
                editMovie(newMovieObj);
                card.parent().html(render(newMovieObj));
                $("#edit").css("display", "none");
            })
            $("#edit").css("display", "flex");

        });
    }






//    var moviesSection = document.querySelector(".movieSection")
// moviesSection.removeChild(moviesSection.children[2])
});