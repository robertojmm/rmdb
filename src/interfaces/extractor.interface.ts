interface Extractor {
  apiBaseUrl: string;
  movieSearchEndPoint: string;
  params: Object;

  searchMovie(title: string): void;
  fetchMovie(): void;
}

export default Extractor;
