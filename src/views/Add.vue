<template>
  <div>
    <div class="row q-ma-md q-col-gutter-md">
      <div class="col-10">
        <q-input label="Movie title" @keyup="performSearch" ref="searchInput" />
      </div>
      <div class="col-2">
        <q-select
          filled
          label="Extractor"
          v-model="actualExtractor"
          :options="extractors"
          style="width: 250px"
        />
      </div>
    </div>

    <div class="row q-ma-md">
      <MovieSearch
        v-on:loadMovie="loadMovieIntoForm"
        v-for="movie in movies"
        v-bind:key="movie.id"
        v-bind:movie="movie"
      ></MovieSearch>
    </div>

    <div class="row q-ma-md">
      <MovieForm v-if="showForm" :movie="actualMovie"></MovieForm>
      <div v-if="showForm" class="col-4">
        <q-btn
          ref="saveButton"
          type="button"
          label="Save"
          class="q-mt-md"
          color="primary"
          @click="saveMovie"
        ></q-btn>
      </div>
    </div>

    <q-dialog v-model="dialog.open">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ this.dialog.title }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">{{
          this.dialog.message
        }}</q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <BackToTopArrow />
  </div>
</template>

<script>
import MovieSearch from "@/components/MovieSearch";
import MovieForm from "@/components/MovieForm";
import BackToTopArrow from "@/components/BackToTopArrow";
import { settings, extractor } from "@/settings";
import movieDatabase from "@/database";
import extractorsList from "@/enums/extractors.enum";

export default {
  name: "AddMovie",
  components: {
    MovieSearch,
    MovieForm,
    BackToTopArrow,
  },
  data() {
    return {
      timeOut: undefined,
      movies: [],
      showForm: false,
      sample: "sample",
      actualMovie: {},
      actualExtractor: null,
      extractors: [],
      dialog: {
        open: false,
        title: "",
        message: "",
      },
    };
  },
  methods: {
    performSearch(e) {
      clearTimeout(this.timeOut);
      this.timeOut = setTimeout(async () => {
        const movieTitle = e.target.value.trim();
        if (movieTitle === "") return;

        this.showForm = false;
        this.$q.loading.show();

        const movies = await extractor.searchMovie(movieTitle);
        this.movies = movies;

        this.$q.loading.hide();
      }, 1000);
    },
    loadMovieIntoForm(movie) {
      this.actualMovie = movie;
      this.movies = [];
      this.showForm = true;
    },
    saveMovie() {
      movieDatabase
        .insertMovie(this.actualMovie)
        .then(this.showDialog)
        .catch(this.showDialog);
    },
    showDialog(result) {
      this.dialog.open = true;

      if (result instanceof Error) {
        this.dialog.title = "Error";
        this.dialog.message = result;
      } else {
        this.dialog.title = "Finished";
        this.dialog.message =
          "The movie was added to your collection succesfully";

        this.$refs.saveButton.$el.disabled = true;
      }
    },
  },
  mounted() {
    this.$refs.searchInput.$el.focus();

    this.extractors = Object.keys(extractorsList);
    this.actualExtractor = settings.get("extractor");
  },
};
</script>

<style scoped></style>
