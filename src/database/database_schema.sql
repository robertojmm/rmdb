/* Enable foreign keys */
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Movies (
    id integer NOT NULL PRIMARY KEY,
    title text NOT NULL,
    plot blob NOT NULL,
    release_date date NOT NULL,
    poster_path text NOT NULL,
    file_path text,
    viewed int NOT NULL,
    director_id integer NOT NULL,
    FOREIGN KEY (director_id) REFERENCES Directors(id)
);

CREATE TABLE IF NOT EXISTS Directors (
    id integer NOT NULL PRIMARY KEY,
    name text NOT NULL
);