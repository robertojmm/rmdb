import { settings } from "@/settings";
import sqlite3 from "sqlite3";
import axios from "axios";
import Movie from "@/interfaces/movie.interface";
import fs from "fs";
import sharp from "sharp";
import { remote } from "electron";
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

    const isProduction = remote.app.isPackaged;

    const dbSchemaPath = isProduction
      ? __dirname + "/../database_schema.sql"
      : "./src/database/database_schema.sql";

    const dbSchema = fs.readFileSync(dbSchemaPath).toString();
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
      const posterPaths = JSON.parse(row.poster_path);

      const movie: Movie = {
        id: row.id,
        title: row.title,
        plot: row.plot,
        posterUrl: {
          normal: this.base64ImageEncode(posterPaths.normal),
          big: this.base64ImageEncode(posterPaths.big),
        },
        filePath: row.file_path,
        viewed: !!row.viewed,
        releaseDate: row.release_date,
        director: row.director_name,
      };

      movies.push(movie);
    }

    return movies;
  }

  async getPosters(movie: Movie) {
    const posters: {
      normal?: Buffer;
      big?: Buffer;
    } = {};

    const rawPoster = await axios
      .get(movie.posterUrl.big, {
        responseType: "arraybuffer",
      })
      .then((response) => response.data);

    posters.big = Buffer.from(rawPoster);

    posters.normal = await sharp(posters.big)
      .metadata()
      .then(({ width }) =>
        sharp(posters.big)
          .resize(Math.round(width! * 0.5), null, {
            //.resize(640, 854, {
            fit: "inside",
          })
          .jpeg({
            quality: 70,
          })
          .toBuffer()
      );

    return posters;
  }

  insertDirector(name: string): Promise<number> {
    const sql = `INSERT INTO DIRECTORS (NAME) VALUES ($name);`;

    return new Promise((resolve, reject) => {
      this.db.run(
        sql,
        {
          $name: name,
        },
        function(result: any) {
          if (result instanceof Error) reject(result);
          resolve(this.lastID);
        }
      );
    });
  }

  getDirectorId(name: string) {
    const sql = `SELECT ID FROM DIRECTORS WHERE NAME = $name;`;

    return new Promise((resolve, reject) => {
      this.db.all(
        sql,
        {
          $name: name,
        },
        (error: Error, rows: any) => {
          if (error) reject(error);
          rows.length > 0 ? resolve(rows[0].id) : reject(0);
        }
      );
    }).catch(() => {
      return this.insertDirector(name);
    });
  }

  async insertMovie(movie: Movie): Promise<null | Error> {
    console.log(movie);
    const sql = `INSERT INTO MOVIES 
    (TITLE, PLOT, RELEASE_DATE, POSTER_PATH, FILE_PATH, VIEWED, DIRECTOR_ID) 
    VALUES ($title, $plot, $releaseDate, $posterPath, $filePath, $viewed, $directorId)`;

    const directorId = await this.getDirectorId(movie.director);

    const posterExtension = movie.posterUrl.big.split(".").pop();
    const posters = await this.getPosters(movie);
    const posterName = btoa(movie.title);
    const posterPath = settings.get("directories").posters + "/" + posterName;

    const paths = {
      normal: posterPath + "_md." + posterExtension,
      big: posterPath + "_xl." + posterExtension,
    };

    fs.writeFile(paths.big, posters.big, "binary", (err: any) => {
      if (err) throw err;
    });

    fs.writeFile(paths.normal, posters.normal, "binary", (err: any) => {
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
          $posterPath: JSON.stringify(paths),
          $filePath: movie.filePath,
          $viewed: movie.viewed,
          $directorId: directorId,
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
    const sql = `SELECT MOVIES.ID, TITLE, PLOT, RELEASE_DATE, POSTER_PATH, FILE_PATH, VIEWED, DIRECTORS.NAME AS director_name 
    FROM MOVIES INNER JOIN DIRECTORS ON DIRECTORS.ID = MOVIES.DIRECTOR_ID ORDER BY TITLE;`;

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
      const sql = `SELECT MOVIES.ID, TITLE, PLOT, RELEASE_DATE, POSTER_PATH, FILE_PATH, VIEWED, DIRECTORS.NAME AS director_name 
      FROM MOVIES INNER JOIN DIRECTORS ON DIRECTORS.ID = MOVIES.DIRECTOR_ID
       WHERE TITLE LIKE $title ORDER BY TITLE ASC`;

      this.db.all(
        sql,
        {
          $title: "%" + title + "%",
        },
        (error: Error, rows: any) => {
          if (error) reject(error);

          rows.length > 0 ? resolve(this.rowsToMovieObjects(rows)) : reject();
        }
      );
    }).catch((error) => {
      return new Promise((resolve, reject) => {
        if (error) reject(error);

        const sql = `SELECT MOVIES.ID, TITLE, PLOT, RELEASE_DATE, POSTER_PATH, FILE_PATH, VIEWED, DIRECTORS.NAME AS director_name 
        FROM MOVIES INNER JOIN DIRECTORS ON DIRECTORS.ID = MOVIES.DIRECTOR_ID
         WHERE DIRECTORS.NAME LIKE $name ORDER BY TITLE ASC`;

        this.db.all(
          sql,
          {
            $name: "%" + title + "%",
          },
          (error: Error, rows: any) => {
            if (error) reject(error);
            resolve(this.rowsToMovieObjects(rows));
          }
        );
      });
    });
  }

  filterMovie(viewed: boolean): Promise<any> | Error {
    return new Promise((resolve, reject) => {
      const sql = `SELECT MOVIES.ID, TITLE, PLOT, RELEASE_DATE, POSTER_PATH, FILE_PATH, VIEWED, DIRECTORS.NAME AS director_name 
      FROM MOVIES INNER JOIN DIRECTORS ON DIRECTORS.ID = MOVIES.DIRECTOR_ID
       WHERE VIEWED = $viewed ORDER BY title ASC`;

      this.db.all(
        sql,
        {
          $viewed: viewed,
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
        const posterPath = JSON.parse(rows[0].poster_path);

        fs.unlink(posterPath.normal, (error) => {
          if (error) console.log(error);
        });

        fs.unlink(posterPath.big, (error) => {
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
