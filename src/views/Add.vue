<template>
  <div>
    <div class="row q-ma-md q-col-gutter-md">
      <div class="col-9">
        <q-input
          :label="$t('movie_add.search')"
          @keyup="performSearch"
          ref="searchInput"
          :disable="disableSearchInput"
        />
      </div>
      <div class="col-2">
        <q-select
          filled
          :label="$t('movie_add.parser')"
          v-model="actualParser"
          :options="parsers"
          style="width: 250px"
          @input="changeParser"
        />
      </div>
    </div>

    <div class="row q-ma-md">
      <movieSearch
        v-on:loadMovie="loadMovieIntoForm"
        v-for="movie in movies"
        v-bind:key="movie.id"
        v-bind:movie="movie"
      />
    </div>

    <div class="row q-ma-md">
      <div class="col-12">
        <movieForm v-if="showForm" :movie="actualMovie" />
      </div>
      <div v-if="showForm" class="col-4">
        <q-btn
          ref="saveButton"
          type="button"
          :label="$t('movie_add.save')"
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

        <q-card-section class="q-pt-none">
          {{ this.dialog.message }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="infoDialogOpen" position="bottom">
      <q-card style="width: 350px">
        <q-card-section class="row items-center no-wrap">
          <span>{{ infoDialogContent }}</span>
        </q-card-section>
      </q-card>
    </q-dialog>

    <backToTopArrow />
  </div>
</template>

<script>
import MovieSearch from "@/components/MovieSearch";
import MovieForm from "@/components/MovieForm";
import BackToTopArrow from "@/components/BackToTopArrow";
import { settings } from "@/settings";
import { movieDatabase } from "@/database";
//import parsersList from "@/enums/parsers.enum";
import { checkPathIsCorrect } from "@/movieFilePath.service";

import { Parsers, parser } from "@/parsers";

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
      actualMovie: {},
      actualParser: null,
      parsers: [],
      dialog: {
        open: false,
        title: "",
        message: "",
      },
      infoDialogOpen: false,
      infoDialogContent: "",
      disableSearchInput: false,
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

        const movies = await parser.searchMovie(movieTitle);
        this.movies = movies;

        this.$q.loading.hide();
      }, 1000);
    },
    loadMovieIntoForm(movie) {
      this.actualMovie = movie;
      this.movies = [];
      this.showForm = true;
    },
    async saveMovie() {
      this.actualMovie.id = -1;
      const movieExist = await movieDatabase.movieExist(this.actualMovie);

      if (movieExist) {
        this.showInfoDialog(this.$t("common.error_movieAlreadyExists"));
        return;
      }

      const newPath = checkPathIsCorrect(this.actualMovie.filePath);
      this.actualMovie.filePath = newPath;

      if (!newPath) {
        this.showInfoDialog(this.$t("common.error_movie_file_path"));
        return;
      }

      movieDatabase
        .insertMovie(this.actualMovie)
        .then((result) => {
          this.showDialog(result);
          this.$root.$emit("reloadMovies");
        })
        .catch(this.showDialog);
    },
    showDialog(result) {
      this.dialog.open = true;

      if (result instanceof Error) {
        this.dialog.title = this.$t("movie_add.error_status");
        this.dialog.message = result;
      } else {
        this.dialog.title = this.$t("movie_add.success_status");
        this.dialog.message = this.$t("movie_add.success_message");

        this.$refs.saveButton.$el.disabled = true;
      }
    },
    showInfoDialog(content) {
      this.infoDialogOpen = true;
      this.infoDialogContent = content;

      setTimeout(() => {
        this.infoDialogOpen = false;
      }, 3000);
    },
    changeParser(parserName) {
      if (parserName === "Manual") {
        this.loadEmptyMovie();
        this.disableSearchInput = true;
      } else {
        this.disableSearchInput = false;
        this.showForm = false;
      }
    },
    loadEmptyMovie() {
      const movie = {
        id: 1,
        title: "",
        plot: "",
        posterUrl: {
          normal: "/not-found.png",
          big: "/not-found.png",
        },
        releaseDate: "1970-01-01",
        filePath: "",
        viewed: false,
        director: "",
      };

      this.loadMovieIntoForm(movie);
    },
  },
  mounted() {
    this.$refs.searchInput.$el.focus();

    this.parsers = ["Manual", ...Object.keys(Parsers)];
    this.actualParser = settings.get("parser");
  },
};
</script>

<style scoped></style>
