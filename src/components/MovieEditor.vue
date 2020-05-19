<template>
  <q-dialog v-model="show" :persistent="true">
    <q-layout view="hHh lpR fFf" container class="layout bg-white">
      <q-header elevated class="bg-primary text-white">
        <q-toolbar class="toolbar">
          <q-btn
            color="green"
            label="Play"
            icon="play_arrow"
            @click="playMovie"
            :disable="!hasFileAssociated"
          />
          <q-btn
            color="secondary"
            label="Edit"
            icon="edit"
            @click="editBlocked = !editBlocked"
          />
          <q-btn
            color="negative"
            label="Delete"
            icon="delete"
            @click="removeMovie"
          />
          <q-btn
            color="warning"
            label="Open location"
            icon="folder"
            @click="openMovieFolder"
            :disable="!hasFileAssociated"
          />
          <q-space />
          <q-btn
            color="purple"
            label="Close"
            icon="close"
            @click="closeEditor"
            v-close-popup
          />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page class="no-overflow">
          <MovieForm :movie="updatedMovie" :readonly="editBlocked" />
        </q-page>
      </q-page-container>

      <q-footer elevated class="bg-grey-8 text-white">
        <q-toolbar>
          <q-space />
          <q-btn
            :disable="editBlocked"
            color="primary"
            label="Save"
            icon="save"
            @click="updateMovie"
          />
        </q-toolbar>
      </q-footer>
    </q-layout>
  </q-dialog>
</template>

<script>
import Movie from "@/interfaces/movie.interface";
import MovieForm from "@/components/MovieForm";
import open from "open";
import movieDatabase from "@/database";

export default {
  name: "MovieEditor",
  data() {
    return {
      show: true,
      updatedMovie: {},
      editBlocked: true,
      hasFileAssociated: false,
    };
  },
  mounted() {
    this.updatedMovie = { ...this.movie };

    this.hasFileAssociated = this.updatedMovie.filePath !== "";
  },
  methods: {
    closeEditor() {
      this.$emit("close");
    },
    playMovie() {
      open(this.updatedMovie.filePath);
    },
    openMovieFolder() {
      const filePathArray = this.updatedMovie.filePath.split(/[\\/]+/);
      filePathArray.pop();
      const folderPath = filePathArray.join("/");
      open(folderPath);
    },
    removeMovie() {
      movieDatabase
        .deleteMovie(this.movie)
        .then(this.closeEditor)
        .catch(console.log);
    },
    updateMovie() {
      movieDatabase
        .updateMovie(this.updatedMovie)
        .then(() => {
          //Finish this
          this.$emit("update", this.updatedMovie);
          this.hasFileAssociated = this.updatedMovie.filePath !== "";
        })
        .catch(console.log);

      this.editBlocked = true;
      //TODO show dialogs saying that the movie is updated
    },
  },
  props: {
    movie: Movie,
  },
  components: {
    MovieForm,
  },
};
</script>

<style scoped>
.layout {
  max-width: 1000px;
  width: 1000px;
  height: 600px;
}

.toolbar > * {
  margin-left: 0.5em;
}

.no-overflow {
  overflow: hidden;
}
</style>
