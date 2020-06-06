interface MovieParams {
  $id: number | string;
  $title: string;
  $plot: string;
  $posterPath?: string;
  $releaseDate: string;
  $filePath?: string;
  $viewed: boolean;
  $directorId: number;
}

export default MovieParams;
