# Rmdb

## Todo

- General

  - [ ] Component 'changeSettingPath' INPUT that has an \$emit event which sends the new value to the father (use it on movieForm and in settings)

- Add Movies

  - [ ] Allow pages
  - [ ] Auto Update movie library when new movie is added

- Library

* [x] Enable library cache
* [x] Add 'viewed or not viewed' to movies and also to the editor (toggle)
* [ ] Filter movies by 'viewed or not viewed'
* [x] Create movie editor
  - [x] Allow editing/saving changes
    - [x] Update movie component in library when it's updated
  - [x] Delete movie btn
    - [x] Close Editor
    - [x] Refresh movie list (try to just delete Movie Component)
    - [x] Confirm popup !!!!
  - [x] Play Movie
    - [ ] Throw Exception if file not found
  - [x] Open Location
    - [ ] Throw Exception if folder not found
  - [ ] Option to rate movie
* [x] Search movie
* To Improve:

  - [x] Allow multiple movies in same row when poster is getting shrinked
  - [ ] Check why it's needed to reload the app in the first launch
  - [x] Change database script to Class

* Think if this is really necessary:

  - Settings
    - [ ] Load actual settings when route open
    - [ ] clean all library
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
  - Cambiar letras en los botones por tooltips
  - Quitar los colores de los botones
