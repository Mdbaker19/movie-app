console.log("movies");
const baseURL = 'https://accidental-petite-cruiser.glitch.me/movies'

fetch(baseURL)
.then(response => response.json())
.then(response => console.log(response))