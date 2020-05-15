# Rmdb

## Todo

- General

  - [ ] Component 'changeSettingPath' INPUT that has an \$emit event which sends the new value to the father (use it on movieForm and in settings)

- Add Movies

  - [ ] Allow pages

- Library

* [x] Enable library cache
* [ ] Center poster inside columns (some posters are smaller)
* [x] Add 'viewed or not viewed' to movies and also to the editor (toggle)
  - [ ] Should I move this option from the form to the editor?
* [ ] Filter movies by 'viewed or not viewed'
* [x] Create movie form
  - [x] Allow editing/saving changes
    - [ ] Update movie component in library when it's updated
  - [x] Delete movie btn
    - [x] Close Editor
    - [ ] Refresh movie list
  - [x] Play Movie
    - [ ] Show Dialog if movie doesn't have a file associated
  - [x] Finish 'Open Location' button. Should open the movie folder
    - [ ] Show Dialog if movie doesn't have a file associated
* [x] Search movie
* [x] Open the movie in the media player
* To Improve:

  - [ ] Check if I can improve library cache
  - [x] Allow multiple movies in same row when poster is getting shrinked
  - [ ] Check why it's needed to reload the app in the first launch
  - [x] Change database script to Class

* Settings
  - [ ] Load actual settings when route open
* Info
  - [ ] Start

---

## What is this?

Rmdb is a free open-source app to store all your movies and have a track about them

# Recomendaciones de Carlos:

- [ ] Paquete RIP para hacer los posters de las películas (https://github.com/MarcusCemes/responsive-image-builder). Formato webp. Ajustar el tamaño de los posters en función de la pantalla del usuario

<picture>
  <source src="assets/image_xs.webp">
 <source src="assets/image_xs.png">
</picture>

<source media="min XXX & max XX" src="assets/image_xs.webp">

- [ ] Cambiar componentes en los html a minuscula
