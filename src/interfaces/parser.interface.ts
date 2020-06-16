interface Parser {
  apiBaseUrl: string;
  movieSearchEndPoint: string;
  params: Record<string, any>;

  searchMovie(title: string): void;
  fetchMovie(): void;
}

export default Parser;
