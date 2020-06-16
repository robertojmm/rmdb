interface Movie {
  id: number;
  title: string;
  plot: string;
  posterUrl: {
    normal: string;
    big: string;
  };
  releaseDate: string;
  filePath?: string;
  viewed: boolean;
  director: string;
}

export default Movie;
