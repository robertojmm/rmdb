/* eslint-disable vue/no-reserved-keys */ /* eslint-disable vue/no-reserved-keys
*/
<template>
  <div class="col-12">
    <div class="row q-gutter-md">
      <div class="col-8">
        <q-input
          outlined
          v-model="movie.title"
          label="Movie Title"
          :readonly="readonly"
        ></q-input>
      </div>
      <div class="col-3">
        <q-input
          outlined
          v-model="movie.releaseDate"
          label="Release Date"
          :readonly="readonly"
        ></q-input>
      </div>

      <div class="col-8" style="width=100%">
        <q-input
          v-model="movie.plot"
          filled
          type="textarea"
          :readonly="readonly"
        />
        <q-file
          label="File Location"
          v-model="file"
          filled
          @input="(file) => (this.movie.filePath = file.path)"
          :readonly="readonly"
        />
        <q-toggle
          :false-value="'Not viewed'"
          :label="`${viewed}`"
          :true-value="'Viewed'"
          color="secondary"
          v-model="viewed"
          @input="setViewedState"
          :disable="readonly"
        />
      </div>
      <div class="col-3">
        <q-img class="rounded-borders" :src="movie.posterUrl" />
      </div>
    </div>
  </div>
</template>

<script>
import Movie from "@/interfaces/movie.interface";

export default {
  name: "MovieForm",
  data() {
    return {
      file: null,
      viewed: "Not viewed",
    };
  },
  props: {
    movie: Movie,
    readonly: Boolean,
  },
  mounted() {
    if (this.movie.filePath) {
      const fileName = this.movie.filePath.split(/[\\/]+/).pop();
      this.file = new File([], fileName);
    }

    this.viewed = this.movie.viewed === true ? "Viewed" : "Not viewed";
  },
  methods: {
    setViewedState(state) {
      console.log(state);
      this.movie.viewed = state === "Viewed";
    },
  },
};
</script>

<style scoped></style>
