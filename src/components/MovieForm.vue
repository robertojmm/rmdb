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
            :label="$t('movie_form.title')"
            :readonly="readonly"
          ></q-input>
        </div>
        <div class="col-4">
          <q-input
            outlined
            v-model="movie.releaseDate"
            :label="$t('movie_form.release_date')"
            :readonly="readonly"
          ></q-input>
        </div>

        <div class="col-12">
          <q-input
            v-model="movie.plot"
            :label="$t('movie_form.synopsis')"
            rows="9"
            filled
            type="textarea"
            :readonly="readonly"
          />
        </div>

        <div class="col-8">
          <q-file
            :label="$t('movie_form.file_location')"
            v-model="file"
            filled
            @input="(file) => (this.movie.filePath = file.path)"
            :readonly="readonly"
          />
        </div>
        <div class="col-4">
          <q-input
            outlined
            v-model="movie.director"
            :label="$t('movie_form.director')"
            :readonly="readonly"
          ></q-input>
        </div>
        <div class="col-12">
          <q-toggle
            :false-value="$t('common.not_viewed')"
            :label="`${isViewed}`"
            :true-value="$t('common.viewed')"
            color="secondary"
            v-model="isViewed"
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
      isViewed: this.$t("common.not_viewed"),
      viewed: this.$t("common.viewed"),
      notViewed: this.$t("common.not_viewed"),
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

    this.isViewed = this.movie.viewed ? this.viewed : this.notViewed;
  },
  methods: {
    setViewedState(state) {
      this.movie.viewed = state === this.viewed;
    },
  },
};
</script>

<style scoped></style>
