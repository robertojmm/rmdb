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

          const director = await this.getDirector(actual.id);

          const movie: Movie = {
            id: actual.id,
            title: actual.title,
            plot: actual.overview,
            posterUrl: {
              normal: "",
              big: "https://image.tmdb.org/t/p/original" + poster,
            }, //actual.backdrop_path,
            releaseDate: actual.release_date,
            viewed: false,
            director: director,
          };

          if (!poster) movie.posterUrl.big = "/not-found.png";

          newMovies.push(movie);
        }
        return newMovies;
      })
      .catch(console.log);
  }

  async getDirector(movieId: number): Promise<string> {
    const url = `${this.apiBaseUrl}movie/${movieId}/credits?api_key=${this.apiKey}`;
    return axios.get(url).then((response) => {
      const crew = response.data.crew;
      let director = undefined;
      if (crew.length > 0) {
        director = crew.find((employee: any) => employee.job === "Director");
      }
      return director ? director.name : "Unknown";
    });
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
