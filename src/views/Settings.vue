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
            <q-select
              v-model="actualLanguage"
              :options="languages"
              @input="changeLanguage"
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
import i18n from "@/i18n";
console.log(i18n);

export default {
  name: "SettingsView",
  data() {
    return {
      visible: false,
      actualLanguage: null,
      languages: [],
    };
  },
  mounted() {
    this.loadLanguages();
  },
  methods: {
    loadLanguages() {
      const languages = Object.entries(this.$t("languages"));
      this.languages = [];

      for (const [languageValue, languageName] of languages) {
        const languageOption = {
          label: languageName,
          value: languageValue,
        };

        this.languages.push(languageOption);

        if (settings.get("language") === languageValue) {
          this.actualLanguage = languageOption;
        }
      }
    },
    changeLanguage(language) {
      this.actualLanguage = language;

      this.$i18n.locale = language.value;
      settings.set("language", language.value);
      this.loadLanguages();
    },
  },
};
</script>

<style scoped></style>
