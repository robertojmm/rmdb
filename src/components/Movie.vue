<template>
  <div :class="this.size" style="text-align: center">
    <q-img :src="movie.posterUrl" />
  </div>
</template>

<script>
import Movie from "@/interfaces/movie.interface";

export default {
  name: "Movie",
  props: {
    movie: Movie,
    size: String,
  },
};
</script>

<style scoped></style>
