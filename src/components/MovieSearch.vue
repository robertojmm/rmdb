<template>
  <!--div class="row"-->
  <div class="col-12 col-md-6">
    <q-card class="my-card q-ma-xs" flat bordered>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-overline">{{ getMovieYear() }}</div>
          <div class="text-h5 q-mt-sm q-mb-xs">{{ movie.title }}</div>
          <div class="text-caption text-grey">{{ movie.plot }}</div>
        </q-card-section>

        <q-card-section class="col-5 flex flex-center">
          <q-img ref="sample" width="75%" class="rounded-borders" :src="movie.posterUrl.big" />
        </q-card-section>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <!-- <q-btn flat round icon="event" />
        <q-btn flat>7:30PM</q-btn>-->
        <q-btn @click="loadMovieInto" flat color="primary" icon-right="add">{{ $t("common.add") }}</q-btn>
      </q-card-actions>
    </q-card>
  </div>
  <!--/div-->
</template>

<script>
import Movie from "@/interfaces/movie.interface";

export default {
  name: "MovieSearch",
  methods: {
    loadMovieInto() {
      this.$emit("loadMovie", this.movie);
    },
    getMovieYear() {
      return this.movie.releaseDate.substr(0, 4);
    }
  },
  props: {
    movie: Movie
  }
};
</script>

<style scoped></style>
