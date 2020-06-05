<template>
  <div class="q-pa-md" style="max-width: 500px">
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label>{{ $t("settings.language") }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="actualLanguage"
            :options="languages"
            @input="changeLanguage"
          />
        </q-item-section>
      </q-item>

      <q-separator spaced inset />

      <q-item>
        <q-item-section>
          <q-item-label>{{ $t("settings.default_parser") }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-btn label="CLEAN" color="negative"></q-btn>
        </q-item-section>
      </q-item>

      <q-separator spaced inset />

      <q-item>
        <q-item-section>
          <q-item-label>{{ $t("settings.theme") }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-btn label="CLEAN" color="negative"></q-btn>
        </q-item-section>
      </q-item>

      <q-separator spaced inset />

      <q-item>
        <q-item-section>
          <q-item-label>{{ $t("settings.clean_db") }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-btn label="CLEAN" color="negative"></q-btn>
        </q-item-section>
      </q-item>

      <!-- <q-expansion-item expand-separator icon="schedule" label="Postponed">
        <q-item tag="label" v-ripple :header-inset-level="1.5">
          <q-item-section>
            <q-item-label>Battery too low</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle color="blue" v-model="visible" val="battery" />
          </q-item-section>
        </q-item>
      </q-expansion-item> -->
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
      this.$root.$emit("languageChange");
    },
  },
};
</script>

<style scoped></style>
