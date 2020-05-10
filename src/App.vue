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
      content-class="bg-grey-3"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item to="/add" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="add_circle"></q-icon>
            </q-item-section>

            <q-item-section>Add movie</q-item-section>
          </q-item>

          <q-item to="/library" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="list"></q-icon>
            </q-item-section>

            <q-item-section>Movie library</q-item-section>
          </q-item>

          <q-separator></q-separator>

          <q-item to="/settings" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="settings"></q-icon>
            </q-item-section>

            <q-item-section>Settings</q-item-section>
          </q-item>

          <q-item to="/about" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="info"></q-icon>
            </q-item-section>

            <q-item-section>About</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <!-- Is this legal?? (Cache) -->
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
