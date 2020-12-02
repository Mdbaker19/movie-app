$(document).ready(function() {
    const baseURL = 'https://accidental-petite-cruiser.glitch.me/movies';
    const allURL = `https://api.themoviedb.org/3/search/movie?api_key=${movieKey}&query=`;
    const posterURL = "https://image.tmdb.org/t/p/w400";
    let allMovies = [];
    let title = $("#title");
    let genre = $("#genre");
    let countLocation = $("#movieCount");
    let counter = 0;

    let usingEdit = false;

    let flick = setInterval(flicker, 100);
    let normalize = setInterval(normal, 176);

    function flicker(){
        $("#loading").css("opacity", ".5");
    }
    function normal(){
        $("#loading").css("opacity", "1");
    }
    function stopFlicker(){
        clearInterval(flick);
        clearInterval(normalize);
    }


//======INITIAL GET==========//
    fetch(baseURL)
        .then(response => response.json())
        .then(response => {
            $("#after").css("display", "flex");
            $("#load").fadeOut(1500);
            setTimeout(stopFlicker, 1800);
            allMovies = response;
            counter = allMovies.length;
            countLocation.html(counter);
            showMovies(allMovies);
            editAndDeleteMovie();
        });

    //======RECALL THE MOVIES WITH THE EDITED VERSION OF ALL MOVIES ARRAY=======//
    function recallGet() {
        fetch(baseURL)
            .then(response => response.json())
            .then(response => {
                allMovies = response;
                counter = allMovies.length;
                countLocation.html(counter);
                editAndDeleteMovie();
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
            counter = allMovies.length;
            countLocation.html(counter);
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
    }).catch(error => console.log(error));






//=============OTHER FUNCTIONS=================//
    async function getMovieData(movieTitle) {
        let poster;
        let ratingAvg;
        await fetch(`${allURL}${movieTitle}`).then((r) => r.json()).then(data => {
            poster = data.results[0].poster_path;
            ratingAvg = data.results[0].vote_average;
        }).catch(err => console.log(err));
        return poster;
    }
    async function getRating(movieTitle) {
        let ratingAvg;
        await fetch(`${allURL}${movieTitle}`).then((r) => r.json()).then(data => {
            ratingAvg = data.results[0].vote_average;
        }).catch(err => console.log(err));
        return ratingAvg;
    }



    async function showMovies(arr){
        arr.forEach((movie) => {
            if(movie.title.startsWith("The ")){
                movie.swapped = true;
                movie.title = movie.title.replace("The ", "");
            }
        });
        arr.sort((a, b) => (a.title > b.title) ? 1 : -1);
        arr.forEach((movie) => {
            if(movie.hasOwnProperty("swapped")){
                movie.title = movie.title.split(" ");
                movie.title.unshift("The");
                movie.title = movie.title.join(" ");
            }
        });
        for(let i = 0; i < arr.length; i++){
            $(".movieSection")[0].insertAdjacentHTML("beforeend", await render(arr[i]));
        }
    }


    function createMovie(i1, i3){
        let newMovie = {
            title: i1,
            genre: i3,
        }
        return newMovie
    }


    async function render(data){
        return `<div class="movieCard">
                    <span id="forDelete">${data.id}</span>
                    <button class="Edit">Edit</button>
                    <h2 class="titleOnPoster">${data.title}</h2>
                    <img src="${posterURL}${await getMovieData(data.title)}" class="poster" alt="movieImage">
                    <p>${await getRating(data.title)}<i class="far fa-star starColor"></i></p>
                    <p>${data.genre}</p>
                </div>`;
    }

    title.on("input", function(){
        usingEdit = false;
    });

    window.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !usingEdit) {
            newMovie(createMovie(title.val(), genre.val())).then(async data => {
                $(".movieSection")[0].insertAdjacentHTML("afterbegin", await render(data));
            });
        }
    });



    $("#submit").on("click", function (){
        newMovie(createMovie(title.val(), rating.val(), genre.val())).then(async data => {
            $(".movieSection")[0].insertAdjacentHTML("afterbegin", await render(data));
        });
    });


    function editAndDeleteMovie() {
        $("body").on("click", ".Edit", function () {
            usingEdit = true;
            let newId = $(this).parent().children().first()[0].innerText;
            let card = $(this).parent();
            let newMovieObj = {};
            let currTitle = card.children()[2].innerText;
            let currGenre = card.children()[5].innerText;
            let currRating = card.children()[4].innerText;
            $("#changeTitle").val(`${currTitle}`);
            $("#changeGenre").val(`${currGenre}`);
            $(".delete").on("click", function (){
                deleteMovie(newId).then();
                card.remove();
                $("#edit").css("display", "none");
            });
            window.addEventListener("keydown",async function(e){
                let newTitle = $("#changeTitle").val();
                let newGenre = $("#changeGenre").val();
                newMovieObj = {
                    title: newTitle,
                    genre: newGenre,
                    rating: currRating,
                    id: newId
                }
                if(e.key === "Enter" && usingEdit) {
                    editMovie(newMovieObj);
                    card.replaceWith(await render(newMovieObj));
                    $("#edit").css("display", "none");
                }
            });
            $("#closeEdit").on("click", function (){
                $("#edit").css("display", "none");
            });
            $("#edit").css("display", "flex");

        });
    }

    const formArea = $("#formSection");
    let timer;
    formArea.on("mouseenter",function(){
        $(this).css("opacity","100%");
        clearTimeout(timer);
    });

    formArea.on("mouseleave",function(){
        timer = setTimeout(formFade, 2000);
    });

    function formFade(){
        formArea.css("opacity", "10%");
    }

});