interface Extractor {
  apiBaseUrl: string;
  movieSearchEndPoint: string;
  params: Record<string, any>;

  searchMovie(title: string): void;
  fetchMovie(): void;
}

export default Extractor;
