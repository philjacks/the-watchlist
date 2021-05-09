let movieList = getSavedMovies();
let filters = {
  searchText: "",
  hideWatched: false,
  sortBy: "byCreated"
};

document.querySelector("#movie-input").addEventListener("submit", e => {
  const timestamp = moment().valueOf();
  e.preventDefault();
  movieList.push({
    id: uuidv4(),
    text: e.target.elements.addMovie.value,
    watched: false,
    createdAt: timestamp
  });
  saveMovie(movieList);

  renderMovies(movieList, filters);
  e.target.elements.addMovie.value = "";
});

document.querySelector("#filter").addEventListener("input", e => {
  filters.searchText = e.target.value;
  renderMovies(movieList, filters);
});

document.querySelector("#hide-watched").addEventListener("change", e => {
  filters.hideWatched = e.target.checked;
  renderMovies(movieList, filters);
});

document.querySelector("#sort-by").addEventListener("change", e => {
  filters.sortBy = e.target.value;
  renderMovies(movieList, filters);
});

renderMovies(movieList, filters);
