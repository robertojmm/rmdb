# Rmdb

## Todo

- General

  - [ ] Component 'changeSettingPath' INPUT that has an \$emit event which sends the new value to the father (use it on movieForm and in settings)
  - [ ] Clean parsers
  - [ ] Clean database class (???)
  - [x] Add directors!!

  - [ ] Avoid duplicated movies
  - [ ] Check if the director has other movies when you delete a movie. In case he doesn't, delete him

- Add Movies

  - [ ] Allow pages
  - [x] Auto Update movie library when new movie is added
  - [x] Manual input

- Library

* [x] Enable library cache
* [x] Add 'viewed or not viewed' to movies and also to the editor (toggle)
* [x] Filter movies by 'viewed or not viewed'
* [x] Create movie editor
  - [x] Allow editing/saving changes
    - [x] Update movie component in library when it's updated
    - [ ] Update movie poster if it has changed
  - [x] Delete movie btn
    - [x] Close Editor
    - [x] Refresh movie list (try to just delete Movie Component)
    - [x] Confirm popup !!!!
  - [x] Play Movie
    - [ ] Throw Exception if file not found
  - [x] Open Location
    - [ ] Throw Exception if folder not found
  - [ ] Option to rate movie
  - [ ] Default image if image can't be found in folder
* [x] Search movie
  - [x] Search also using director's name
* To Improve:

  - [x] Allow multiple movies in same row when poster is getting shrinked
  - [x] Change database script to Class
  - [ ] Change name from "extractor" to "parser"
  - [x] Set min windows size

* Think if this is really necessary:

  - Settings
    - [ ] Load actual settings when route open
    - [x] Language Option
    - [ ] Stablish default parser
    - [ ] clean all library
    - [ ] Themes
    - [ ] Default poster size
  - Info
    - [ ] Start

---

## What is this?

Rmdb is a free open-source app to store all your movies and have a track about them

# Recomendaciones de Carlos:

- [x] Paquete RIP para hacer los posters de las películas (https://github.com/MarcusCemes/responsive-image-builder). Formato webp. Ajustar el tamaño de los posters en función de la pantalla del usuario

<picture>
  <source src="assets/image_xs.webp">
 <source src="assets/image_xs.png">
</picture>

<source media="min XXX & max XX" src="assets/image_xs.webp">

- [x] Cambiar componentes en los html a minuscula

* Preguntar a Carlos:
  - Cambiar letras en los botones por tooltips (hacerlo)
  - Quitar los colores de los botones (hacerlo)
  - Dejar todos los botones como si fueran uno (mismo fondo)

Cambiar extractors a parsers
Idioma
Customizar colores (Paletas) (variables CSS) (--primary) (de cara al final del desarrollo)
