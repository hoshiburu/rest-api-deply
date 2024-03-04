const express = require("express");
const crypto = require("node:crypto");

const app = express();
const movies = require("./movies.json");
const { validateMovie, validatePartialMovie } = require("./schemas/movies");

app.disable("x-powered-by");

app.get("/", (req, res) => {
  return res.json({ menssage: "hola mundo" });
});

app.use(express.json());

//Todos los recursos que sean MOVIES se identifican con /movies
app.get("/movies", (req, res) => {
  //res.header("Access-Control-allow-Origin", "*");
  const { genre } = req.query;
  if (genre) {
    const filterMovie = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(filterMovie);
  }
  res.json(movies);
});

app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if (movie) return res.json(movie);
  res.status(404).json({ message: "Movie not found" });
});

app.post("/movies", (req, res) => {
  const result = validateMovie(req.body);
  //result.success
  if (result.error) {
    //400 bad request; 422 unprocessable Entity
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }
  const newMovie = {
    id: crypto.randomUUID(), //crea un uuid v4
    ...result.data,
  };
  //Esto no seria REST, porque lo lo estamos guardando en el estado de la aplicación.
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

app.patch("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  const result = validatePartialMovie(req.body);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  if (movieIndex < 0)
    return res.status(404).json({ message: "Movie no found" });

  const updateMovies = {
    ...movies[movieIndex],
    ...result.data,
  };
  movies[movieIndex] = updateMovies;
  return res.json(updateMovies);
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
