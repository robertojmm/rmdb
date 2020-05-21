import Extractor from "../interfaces/extractor.interface";
import Movie from "@/interfaces/movie.interface";
import axios from "axios";

class TheMovieDBExtractor implements Extractor {
  apiBaseUrl = "https://api.themoviedb.org/3/";
  movieSearchEndPoint =
    "search/movie?api_key=e06f8189e697062442596c50464e3442&";
  params = {
    language: "es",
  };

  apiKey = "e06f8189e697062442596c50464e3442";

  async searchMovie(title: string): Promise<Movie[] | void> {
    title = title.replace(" ", "%20");
    const url =
      this.apiBaseUrl +
      this.movieSearchEndPoint +
      this.stringifyParams() +
      "query=" +
      title +
      "&append_to_response=credits";
    return await axios
      .get(url)
      .then(async (response) => {
        const rawMovies = response.data.results;
        const newMovies: Movie[] = [];

        for (const actual of rawMovies) {
          const poster = await axios
            .get(
              `https://api.themoviedb.org/3/movie/${actual.id}/images?api_key=${this.apiKey}&language=es`
            )
            .then((response) => {
              if (response.data.posters.length < 1) return "";
              return response.data.posters[0].file_path;
            });

          const movie: Movie = {
            id: actual.id,
            title: actual.title,
            plot: actual.overview,
            posterUrl: "https://image.tmdb.org/t/p/original" + poster, //actual.backdrop_path,
            releaseDate: actual.release_date,
            viewed: false,
          };

          if (!poster) movie.posterUrl = "/not-found.png";

          newMovies.push(movie);
        }
        return newMovies;
      })
      .catch(console.log);
  }

  stringifyParams(): string {
    return Object.entries(this.params).reduce((params, [key, value]) => {
      return `${params}${key}=${value}&`;
    }, "");
  }

  //?????????
  fetchMovie() {
    console.log("xd");
  }
}

export default TheMovieDBExtractor;
