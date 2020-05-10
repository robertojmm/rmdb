<template>
  <div class="q-pa-md" style="max-width: 500px">
    <q-list bordered class="rounded-borders">
      <q-expansion-item
        expand-separator
        icon="mail"
        label="Inbox"
        caption="5 unread emails"
      >
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>MediaPlayer Path:</q-item-label>
          </q-item-section>
          <q-item-section side style="width: 200px">
            <!-- <q-toggle color="blue" v-model="visible" val="battery" /> -->
            <q-file
              filled
              @input="(file) => changeSettingPath('mediaPlayerPath', file)"
            />
          </q-item-section>
        </q-item>

        <q-expansion-item expand-separator icon="schedule" label="Postponed">
          <q-item tag="label" v-ripple :header-inset-level="1.5">
            <q-item-section>
              <q-item-label>Battery too low</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle color="blue" v-model="visible" val="battery" />
            </q-item-section>
          </q-item>
        </q-expansion-item>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script>
import { settings } from "@/settings";
export default {
  name: "SettingsView",
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    changeSettingPath(name, newValue) {
      console.log(name);
      console.log(newValue.path);
      settings.set(name, newValue.path);
    },
  },
};
</script>

<style scoped></style>
