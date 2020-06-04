<template>
  <q-dialog v-model="show" :persistent="true">
    <q-layout view="hHh lpR fFf" container class="layout bg-white">
      <q-header elevated class="bg-primary text-white">
        <q-toolbar class="toolbar">
          <q-btn
            flat
            icon="play_arrow"
            @click="playMovie"
            :disable="!hasFileAssociated"
          />
          <q-btn flat icon="edit" @click="editBlocked = !editBlocked" />
          <q-btn flat icon="delete" @click="confirmRemoveMovie = true" />
          <q-btn
            flat
            icon="folder"
            @click="openMovieFolder"
            :disable="!hasFileAssociated"
          />
          <q-space />
          <q-btn flat icon="close" @click="closeEditor" v-close-popup />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page class="no-overflow">
          <movieForm :movie="updatedMovie" :readonly="editBlocked" />

          <q-dialog v-model="confirmRemoveMovie" persistent>
            <q-card>
              <q-card-section class="row items-center">
                <span class="q-ml-sm"
                  >Are you sure you wanna delete '{{
                    updatedMovie.title
                  }}'?</span
                >
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" v-close-popup />
                <q-btn
                  flat
                  label="Sure"
                  color="negative"
                  @click="removeMovie"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-page>
      </q-page-container>

      <q-footer elevated class="bg-grey-8 text-white">
        <q-toolbar>
          <q-space />
          <q-btn :disable="editBlocked" flat icon="save" @click="updateMovie" />
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
      confirmRemoveMovie: false,
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
        .then(() => {
          this.$emit("remove", this.movie.id);
          this.closeEditor();
        })
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
