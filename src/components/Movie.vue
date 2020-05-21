<template>
  <div :class="this.size.value">
    <q-img v-if="this.size.label == 'Small'" :src="movie.posterUrl" />
    <q-img v-if="this.size.label == 'Normal'" :src="movie.posterUrl" />
    <q-img v-if="this.size.label == 'Big'" :src="movie.posterUrl" />
  </div>
</template>

<script>
import Movie from "@/interfaces/movie.interface";

export default {
  name: "Movie",
  props: {
    movie: Movie,
    size: Object,
  },
};
</script>

<style scoped></style>
