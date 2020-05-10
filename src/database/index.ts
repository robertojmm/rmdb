import { settings } from "@/settings";
import sqlite3 from "sqlite3";
import axios from "axios";
import Movie from "@/interfaces/movie.interface";
import fs from "fs";
sqlite3.verbose();

class MovieDataBase {
  db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(
      settings.get("directories").main + "/rmdb.sqlite3",
      (error: any) => {
        if (error) {
          throw error;
        }
        console.log("Connected to database.");
      }
    );

    const dbSchema = fs
      .readFileSync("./src/database/database_schema.sql")
      .toString();
    this.db.exec(dbSchema, (error: any) => {
      if (error) {
        throw error;
      }
    });
  }

  base64ImageEncode(filePath: string): string {
    const fileExtension = filePath.split(".").pop();
    const bitmap = fs.readFileSync(filePath);
    return (
      `data:image/${fileExtension};base64, ` +
      new Buffer(bitmap).toString("base64")
    );
  }

  rowsToMovieObjects(rows: any[]): Movie[] {
    const movies: Movie[] = [];

    for (const row of rows) {
      const posterBase64 = this.base64ImageEncode(row.poster_path);

      const movie: Movie = {
        id: row.id,
        title: row.title,
        plot: row.plot,
        posterUrl: posterBase64,
        filePath: row.file_path,
        viewed: row.viewed,
        releaseDate: row.release_date,
      };

      movies.push(movie);
    }

    return movies;
  }

  async insertMovie(movie: Movie): Promise<null | Error> {
    console.log(movie);
    const sql = `INSERT INTO MOVIES 
    (TITLE, PLOT, RELEASE_DATE, POSTER_PATH, FILE_PATH, VIEWED, DIRECTOR_ID) 
    VALUES ($title, $plot, $releaseDate, $posterPath, $filePath, $viewed, $directorId)`;

    const posterExtension = movie.posterUrl.split(".").pop();
    const poster = await axios
      .get(movie.posterUrl, {
        responseType: "arraybuffer",
      })
      .then((response) => response.data);

    const posterName = movie.title.split(" ").join("_");
    const posterPath =
      settings.get("directories").posters +
      "/" +
      posterName +
      "." +
      posterExtension;

    fs.writeFile(posterPath, Buffer.from(poster), "binary", (err: any) => {
      if (err) throw err;
    });

    if (!movie.filePath) movie.filePath = "";

    return new Promise((resolve, reject) => {
      this.db.run(
        sql,
        {
          $title: movie.title,
          $plot: movie.plot,
          $releaseDate: movie.releaseDate,
          $posterPath: posterPath,
          $filePath: movie.filePath,
          $viewed: movie.viewed,
          $directorId: 1,
        },
        (result: any) => {
          if (result instanceof Error) reject(result);
          resolve(result);
        }
      );
    });
  }

  async updateMovie(movie: Movie): Promise<any> {
    console.log(movie);
    const sql = `UPDATE MOVIES SET
    TITLE = $title,
    PLOT = $plot,
    RELEASE_DATE = $releaseDate,
    FILE_PATH = $filePath,
    VIEWED = $viewed,
    DIRECTOR_ID = $directorId
    WHERE ID = $id`;

    return new Promise((resolve, reject) => {
      this.db.run(
        sql,
        {
          $title: movie.title,
          $plot: movie.plot,
          $releaseDate: movie.releaseDate,
          //$posterPath: posterPath,
          $filePath: movie.filePath,
          $viewed: movie.viewed,
          $directorId: 1,
          $id: movie.id,
        },
        (result: any) => {
          if (result instanceof Error) reject(result);
          resolve(result);
        }
      );
    });
  }

  loadAllMovies(): Promise<Movie[] | Error> {
    const sql = `SELECT * FROM MOVIES ORDER BY TITLE`;

    return new Promise((resolve, reject) => {
      this.db.all(sql, (error: Error, rows: any) => {
        if (error) reject(error);

        const movies: Movie[] = this.rowsToMovieObjects(rows);

        resolve(movies);
      });
    });
  }

  searchMovie(title: string): Promise<any> | Error {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM MOVIES WHERE TITLE LIKE $title ORDER BY title ASC`;

      this.db.all(
        sql,
        {
          $title: "%" + title + "%",
        },
        (error: Error, rows: any) => {
          if (error) reject(error);
          resolve(this.rowsToMovieObjects(rows));
        }
      );
    });
  }

  deleteMovie(movie: Movie): Promise<any> {
    const sql = `DELETE FROM MOVIES WHERE ID = $id`;
    const sqlSearchPoster = `SELECT POSTER_PATH FROM MOVIES WHERE ID = $id`;

    // TODO Improve?

    return new Promise((resolve, reject) => {
      this.db.all(
        sqlSearchPoster,
        {
          $id: movie.id,
        },
        (error: Error, rows: any) => {
          if (error) reject(error);
          resolve(rows);
        }
      );
    })
      .then((rows: any) => {
        const posterPath = rows[0].poster_path;
        fs.unlink(posterPath, (error) => {
          if (error) console.log(error);
        });
      })
      .then(() => {
        return new Promise((resolve, reject) => {
          this.db.run(
            sql,
            {
              $id: movie.id,
            },
            (result: any) => {
              if (result instanceof Error) reject(result);
              resolve();
            }
          );
        });
      });
  }
}

const movieDatabase = new MovieDataBase();
export default movieDatabase;
