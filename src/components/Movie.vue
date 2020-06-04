<template>
  <div :class="this.size.value">
    <q-img
      v-if="this.size.label == $t('movie_library.poster_sizes.small')"
      :src="movie.posterUrl.normal"
    />
    <q-img
      v-if="this.size.label == $t('movie_library.poster_sizes.normal')"
      :src="movie.posterUrl.normal"
    />
    <q-img
      v-if="this.size.label == $t('movie_library.poster_sizes.big')"
      :src="movie.posterUrl.big"
    />
  </div>
</template>

<script>
import Movie from "@/interfaces/movie.interface";

export default {
  name: "Movie",
  props: {
    movie: Movie,
    size: Object
  }
};
</script>

<style scoped></style>
