interface Movie {
  id: number | string;
  title: string;
  plot: string;
  posterUrl: {
    normal: string;
    big: string;
  };
  releaseDate: string; // Change to object?
  filePath?: string;
  viewed: boolean;
}

export default Movie;
