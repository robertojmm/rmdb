<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="drawer = !drawer" />

        <q-toolbar-title>Robert's Movie Database</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      mini-to-overlay
      :width="200"
      :breakpoint="500"
      bordered
      content-class="drawer-color"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item to="/add" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="add_circle"></q-icon>
            </q-item-section>

            <q-item-section>{{ $t("menu_drawer.add_movie") }}</q-item-section>
          </q-item>

          <q-item to="/library" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="list"></q-icon>
            </q-item-section>

            <q-item-section>
              {{ $t("menu_drawer.movie_library") }}
            </q-item-section>
          </q-item>

          <q-separator></q-separator>

          <q-item to="/settings" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="settings"></q-icon>
            </q-item-section>

            <q-item-section>{{ $t("menu_drawer.settings") }}</q-item-section>
          </q-item>

          <q-item to="/about" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="info"></q-icon>
            </q-item-section>

            <q-item-section>{{ $t("menu_drawer.about") }}</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <keep-alive>
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      miniState: true,
    };
  },
};
</script>

<style lang="scss">
body,
.bg-custom {
  background: var(--q-color-background);
}

.q-field__native + .q-field__label,
.q-field--focused .q-field__label,
.q-field__control-container > input::placeholder {
  color: var(--q-color-placeholder) !important;
}

span,
input,
textarea,
.q-item__label,
.q-field__input + div,
.q-toggle__label {
  color: var(--q-color-text) !important;
}

.q-drawer {
  color: var(--q-color-icons) !important;
}

.q-toolbar__title {
  color: var(--q-color-title);
}

.drawer-color {
  background: var(--q-color-drawer);
}

.q-menu {
  background: var(--q-color-drawer) !important;
}
</style>
