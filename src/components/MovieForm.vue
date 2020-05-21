/* eslint-disable vue/no-reserved-keys */ /* eslint-disable vue/no-reserved-keys
*/
<template>
  <div class="row q-ma-sm q-col-gutter-md">
    <div class="col-8">
      <div class="row q-col-gutter-md justify-center items-center">
        <div class="col-8">
          <q-input
            outlined
            v-model="movie.title"
            label="Movie Title"
            :readonly="readonly"
          ></q-input>
        </div>
        <div class="col-4">
          <q-input
            outlined
            v-model="movie.releaseDate"
            label="Release Date"
            :readonly="readonly"
          ></q-input>
        </div>

        <div class="col-12">
          <q-input
            v-model="movie.plot"
            rows="9"
            filled
            type="textarea"
            :readonly="readonly"
          />
        </div>

        <div class="col-8">
          <q-file
            label="File Location"
            v-model="file"
            filled
            @input="(file) => (this.movie.filePath = file.path)"
            :readonly="readonly"
          />
        </div>
        <div class="col-4">
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
      </div>
    </div>

    <div class="col-4">
      <q-img class="rounded-borders" :src="movie.posterUrl.big" width="95%" />
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

    this.viewed = this.movie.viewed ? "Viewed" : "Not viewed";
  },
  methods: {
    setViewedState(state) {
      this.movie.viewed = state === "Viewed";
    },
  },
};
</script>

<style scoped></style>
