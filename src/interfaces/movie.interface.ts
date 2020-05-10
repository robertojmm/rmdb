interface Movie {
  id: number | string;
  title: string;
  plot: string;
  posterUrl: string;
  releaseDate: string; // Change to object?
  filePath?: string;
  viewed: number;
}

export default Movie;
