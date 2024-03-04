const z = require("zod");

const moviesSchema = z.object({
  title: z.string({
    invalid_type_error: "Movie title must be a string",
    required_error: "Movie title is required.",
  }),
  year: z.number().int().min(1900).max(2024),
  duration: z.number().int().positive(),
  rate: z.optional(z.number().min(0).max(10)),
  poster: z.string().url({
    message: "Poster must be a valid URL",
  }),
  genre: z.array(
    z.enum([
      "Action",
      "Adventure",
      "Comedy",
      "Drama",
      "Fantasy",
      "Horror",
      "Thriller",
      "Sci-Fi",
    ]),
    {
      invalid_type_error: "Movie genre must be a array of enum genre",
      required_error: "Movie genre is required.",
    }
  ),
});

function validateMovie(object) {
  return moviesSchema.safeParse(object);
}

function validatePartialMovie(object) {
  return moviesSchema.partial().safeParse(object);
}

module.exports = {
  validateMovie,
  validatePartialMovie,
};
