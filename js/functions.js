// Retrieve any saved movies from Local Storage or return empty Array
const getSavedMovies = () => {
  const storedMovies = localStorage.getItem("movies");

  try {
    return storedMovies ? JSON.parse(storedMovies) : [];
  } catch {
    return [];
  }
};
// Save movie (or any changes) to Local Storage
const saveMovie = () =>
  localStorage.setItem("movies", JSON.stringify(movieList));

// Delete movie from list
const deleteMovie = (id) => {
  const index = movieList.findIndex((movie) => movie.id === id);

  if (index > -1) {
    movieList.splice(index, 1);
  }
};
// Sort movies via 2 given options
const sortMovies = (movies, sortBy) => {
  if (sortBy === "byCreated") {
    return movies.sort((a, b) => {
      if (a.createdAt > b.createdAt) {
        return -1;
      } else if (a.createdAt < b.createdAt) {
        return 1;
      } else {
        return 0;
      }
    });
  } else if (sortBy === "alphabetically") {
    return movies.sort((a, b) => {
      if (a.text.toLowerCase() < b.text.toLowerCase()) {
        return -1;
      } else if (a.text.toLowerCase() > b.text.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });
  } else if (sortBy === "byWatched") {
    return movies.sort((a, b) => {
      if (a.watched) {
        return -1;
      } else if (!a.watched) {
        return 1;
      } else {
        return 0;
      }
    });
  }
};
// Render movies to webpage
const renderMovies = (movies, filters) => {
  movieList = sortMovies(movieList, filters.sortBy);

  const filteredMovies = movies.filter((movie) => {
    const searchMatch = movie.text
      .toLowerCase()
      .includes(filters.searchText.toLowerCase());
    const hideMatch = !filters.hideWatched || !movie.watched;

    return searchMatch && hideMatch;
  });

  const unWatched = filteredMovies.filter((movie) => !movie.watched);

  document.querySelector("#movie-list").innerHTML = "";
  document.querySelector("#movie-list").appendChild(generateSummary(unWatched));

  filteredMovies.forEach((movie) =>
    document.querySelector("#movie-list").appendChild(generateMovieDOM(movie))
  );
};
// Toggle movie 'watched' status
const toggleWatched = (id) => {
  const movie = movieList.find((movie) => movie.id === id);

  if (movie) {
    movie.watched = !movie.watched;
  }
};

// Generate all DOM elements for a movie added to list
const generateMovieDOM = (movie) => {
  const movieEl = document.createElement("div");
  let checkEl = document.createElement("input");
  const textEl = document.createElement("span");
  const buttonEl = document.createElement("img");

  buttonEl.src = "../img/outline_delete_white.png";

  movieEl.id = "movieEl";
  checkEl.id = "checkEl";
  buttonEl.id = "buttonEl";

  checkEl.setAttribute("type", "checkbox");
  checkEl.checked = movie.watched;
  textEl.textContent = movie.text;
  buttonEl.textContent = "X";

  movieEl.appendChild(checkEl);
  movieEl.appendChild(textEl);
  movieEl.appendChild(buttonEl);

  buttonEl.addEventListener("click", () => {
    deleteMovie(movie.id);
    saveMovie(movieList);
    renderMovies(movieList, filters);
  });
  checkEl.addEventListener("change", () => {
    toggleWatched(movie.id);
    saveMovie(movieList);
    renderMovies(movieList, filters);
  });
  // Set default item title (if no title is given)
  if (movie.text.length > 0) {
    textEl.textContent = movie.text;
  } else {
    textEl.textContent = "No Title";
  }

  return movieEl;
};
// Generate a summary of how many movies are still to be watched
const generateSummary = (unWatched) => {
  let moviesLeft = document.createElement("h2");
  moviesLeft.textContent = `You have ${unWatched.length} movie(s) to watch!`;
  return moviesLeft;
};
