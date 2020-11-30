$(document).ready(function() {
    const baseURL = 'https://accidental-petite-cruiser.glitch.me/movies';
    const allURL = `https://api.themoviedb.org/3/search/movie?api_key=${movieKey}&query=`;
    const posterURL = "https://image.tmdb.org/t/p/w400";
    let allMovies = [];
    let title = $("#title");
    let rating = $("#ratingStars");
    let genre = $("#genre");

    let flick = setInterval(flicker, 100);
    let normalize = setInterval(normal, 176);

    function flicker(){
        $("#loading").css("opacity", ".2");
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
            setTimeout(stopFlicker, 1500);
            $("#after").css("display", "flex");
            $("#load").fadeOut(1500);
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
                $("#load").fadeOut(1500);
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
    async function getMovieData(movieTitle) {
        let poster;
        await fetch(`${allURL}${movieTitle}`).then((r) => r.json()).then(data => {
            poster = data.results[0].poster_path;
        }).catch(err => console.log(err));
        return poster;
    }




    async function showMovies(arr){
        for(let i = 0; i < arr.length; i++){
            $(".movieSection")[0].insertAdjacentHTML("beforeend", await render(arr[i]));
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


    async function render(data){
        return `<div class="movieCard">
                    <span id="forDelete">${data.id}</span>
                    <button class="delete"><i class="fas fa-times-circle deleteIcon"></i></button>
                    <h2 class="titleOnPoster">${data.title}</h2>
                    <img src="${posterURL}${await getMovieData(data.title)}" class="poster" alt="movieImage">
                    <p>${data.rating}<i class="far fa-star starColor"></i></p>
                    <p>${data.genre}</p>
                    <button class="Edit">Edit</button>
                </div>`;
    }



    $("#submit").on("click", function (){
        newMovie(createMovie(title.val(), rating.val(), genre.val())).then(async data => {
            $(".movieSection")[0].insertAdjacentHTML("afterbegin", await render(data));
        });
        $(this).parent().css("display", "none");
        $("#displayForm").css("display", "flex");
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
            let card = $(this).parent();
            let newMovieObj = {};
            $("#changeMovie").on("click",async function(){
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
                card.replaceWith(await render(newMovieObj));
                $("#edit").css("display", "none");
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