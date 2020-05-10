<template>
  <q-dialog v-model="show" :persistent="true">
    <q-layout view="hHh lpR fFf" container class="layout bg-white">
      <q-header elevated class="bg-primary text-white">
        <q-toolbar>
          <q-btn
            color="green"
            label="Play"
            icon="play_arrow"
            @click="playMovie"
          />
          <q-btn
            color="secondary"
            label="Edit"
            icon="edit"
            @click="editBlocked = false"
          />
          <q-btn
            color="negative"
            label="Delete"
            icon="delete"
            @click="removeMovie"
          />
          <q-btn color="warning" label="Open location" icon="folder" />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <MovieForm :movie="updatedMovie" :readonly="editBlocked"></MovieForm>
      </q-page-container>

      <q-footer elevated class="bg-grey-8 text-white">
        <q-toolbar>
          <q-space />
          <q-btn
            color="primary"
            label="Save"
            icon="save"
            @click="updateMovie"
          />
          <q-btn
            color="purple"
            label="Close"
            icon="close"
            @click="closeEditor"
            v-close-popup
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
    };
  },
  mounted() {
    this.updatedMovie = { ...this.movie };
  },
  methods: {
    closeEditor() {
      this.$emit("close");
    },
    playMovie() {
      if (this.movie.filePath) {
        open(this.movie.filePath);
      } else {
        console.log("This Movie doesn't have any file associated");
      }
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
        })
        .catch(console.log);

      this.editBlocked = true;
      //TODO show dialogs
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
</style>