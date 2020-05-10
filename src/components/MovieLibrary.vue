<template>
  <div class="q-ma-md">
    <div class="row q-col-gutter-md">
      <div class="col-4">
        <q-input filled type="search" placeholder="Search" @keyup="searchMovie">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-7">
        <!-- <q-slider v-model="movieCaseWidth" :min="50" :max="100" /> -->
        <q-select
          filled
          label="Poster Size"
          v-model="movieCaseWidth"
          :options="moviePosterSizes"
          style="width: 250px"
        />
        <q-badge color="secondary"
          >Total of movies: {{ movies.length }}</q-badge
        >
      </div>
      <div class="col-1">
        <q-btn color="secondary" icon="cached" @click="loadMovies" />
      </div>
    </div>

    <div class="row q-ma-md q-col-gutter-md">
      <MovieEditor
        v-if="showEditor"
        v-on:close="showEditor = false"
        v-on:update="xd"
        :movie="actualMovie"
      />
      <Movie
        v-for="movie in movies"
        v-bind:key="movie.id"
        v-bind:movie="movie"
        :size="movieCaseWidth.value"
        @dblclick.native="openMovieForm(movie)"
      ></Movie>
    </div>
    <BackToTopArrow />
  </div>
</template>

<script>
import Movie from "@/components/Movie";
import MovieEditor from "@/components/MovieEditor";
import BackToTopArrow from "@/components/BackToTopArrow";
import movieDatabase from "@/database";

export default {
  name: "MovieLibrary",
  data() {
    return {
      showEditor: false,
      movies: [],
      search: "",
      timeOut: undefined,
      movieCaseWidth: { label: "Normal", value: "col-2" },
      moviePosterSizes: [
        { label: "Small", value: "col-1" },
        { label: "Normal", value: "col-2" },
        { label: "Big", value: "col-3" },
      ],
    };
  },
  created() {
    console.log("created");
  },
  mounted() {
    this.loadMovies();
    console.log("mounted");
  },
  methods: {
    xd(e) {
      console.log("-------");
      console.log(e);
      console.log(this.actualMovie);
      this.actualMovie = e;
      console.log(this.actualMovie);
    },
    loadMovies() {
      console.log("loading");
      movieDatabase.loadAllMovies().then((movies) => {
        console.log(movies);
        this.movies = movies;
      });
    },
    searchMovie(e) {
      clearTimeout(this.timeOut);
      this.timeOut = setTimeout(() => {
        const title = e.target.value.trim();
        movieDatabase
          .searchMovie(title)
          .then((movies) => {
            this.movies = movies;
          })
          .catch(console.error);
      }, 1000);
    },
    openMovieForm(movie) {
      this.actualMovie = movie;
      this.showEditor = true;
    },
  },
  components: {
    Movie,
    BackToTopArrow,
    MovieEditor,
  },
};
</script>

<style scoped></style>
