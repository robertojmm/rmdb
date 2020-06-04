<template>
  <div class="q-ma-md">
    <div class="row q-col-gutter-md">
      <div class="col-4">
        <q-input
          filled
          type="search"
          :placeholder="$t('movie_library.search')"
          @keyup="searchMovie"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-7">
        <!-- <q-slider v-model="movieCaseWidth" :min="50" :max="100" /> -->
        <q-select
          filled
          :label="$t('movie_library.poster_size')"
          v-model="movieCaseWidth"
          :options="moviePosterSizes"
          style="width: 250px"
        />
        <q-badge color="secondary">{{ $t("movie_library.total_movies", { amount: movies.length })}}</q-badge>
      </div>
      <div class="col-1">
        <q-btn color="secondary" icon="cached" @click="loadMovies" />
      </div>
    </div>

    <movieEditor
      v-if="showEditor"
      v-on:close="showEditor = false"
      v-on:update="refreshMovie"
      v-on:remove="removeMovie"
      :movie="actualMovie"
    />

    <div class="row q-ma-xs q-col-gutter-sm">
      <movie
        class="movie"
        v-for="movie in movies"
        v-bind:key="movie.id"
        v-bind:movie="movie"
        :size="movieCaseWidth"
        @dblclick.native="openMovieForm(movie)"
      ></movie>
      <!-- <movie
        class="movie"
        v-for="index in 100"
        :key="index"
        v-bind:movie="movies[0]"
        :size="movieCaseWidth"
        @dblclick.native="openMovieForm(movies[0])"
      ></movie>-->
    </div>
    <backToTopArrow />
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
      movieCaseWidth: {
        label: this.$t("movie_library.poster_sizes.normal"),
        value: "col-2"
      },
      moviePosterSizes: [
        { label: this.$t("movie_library.poster_sizes.small"), value: "col-1" },
        { label: this.$t("movie_library.poster_sizes.normal"), value: "col-2" },
        { label: this.$t("movie_library.poster_sizes.big"), value: "col-3" }
      ]
    };
  },
  mounted() {
    this.loadMovies();
    console.log(this.$t("movie_library"));
  },
  methods: {
    refreshMovie(updatedMovie) {
      const index = this.findMovieIndex(updatedMovie.id);
      this.movies[index] = updatedMovie;
    },
    removeMovie(id) {
      const index = this.findMovieIndex(id);
      this.movies.splice(index, 1);
    },
    findMovieIndex(_id) {
      return this.movies.findIndex(({ id }) => id === _id);
    },
    loadMovies() {
      console.log("loading");
      movieDatabase.loadAllMovies().then(movies => {
        console.log(movies);
        this.movies = movies;
      });
    },
    searchMovie(event) {
      clearTimeout(this.timeOut);
      this.timeOut = setTimeout(() => {
        const title = event.target.value.trim();
        movieDatabase
          .searchMovie(title)
          .then(movies => {
            this.movies = movies;
          })
          .catch(console.error);
      }, 1000);
    },
    openMovieForm(movie) {
      this.actualMovie = movie;
      this.showEditor = true;

      this.findMovieIndex(movie.id);
    }
  },
  components: {
    Movie,
    BackToTopArrow,
    MovieEditor
  }
};
</script>

<style scoped>
.movie {
  transition: transform 0.2s linear;
  transform: scale(1);
}

.movie:hover {
  transition: transform 0.2s linear;
  transform: scale(0.9);

  cursor: pointer;
}
</style>
