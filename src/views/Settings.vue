<template>
  <div class="fixed-center q-pa-md" style="max-width: 700px; min-width: 700px">
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
          <q-select
            v-model="actualTheme"
            :options="themes"
            @input="changeTheme"
          />
        </q-item-section>
      </q-item>

      <q-separator spaced inset />

      <q-item>
        <q-item-section>
          <q-btn
            label="EXPORT"
            color="primary"
            @click="exportDatabase"
          ></q-btn> </q-item-section
        ><q-item-section>
          <q-btn label="IMPORT" color="primary" @click="importDatabase"></q-btn>
        </q-item-section>
      </q-item>

      <q-separator spaced inset />

      <q-item>
        <q-item-section>
          <q-item-label>{{ $t("settings.clean_db") }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-btn
            label="CLEAN"
            color="negative"
            @click="dialogOpen = true"
          ></q-btn>
        </q-item-section>
      </q-item>

      <confirmDialog
        :dialogOpen.sync="confirmDialogOpen"
        title="Wanna clean database?"
        :callBack="cleanDatabase"
      ></confirmDialog>

      <q-dialog v-model="infoDialogOpen" position="bottom">
        <q-card style="width: 350px">
          <q-card-section class="row items-center no-wrap">
            <span>{{ infoDialogContent }}</span>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-list>
  </div>
</template>

<script>
import ConfirmDialog from "@/components/ConfirmDialog";
import { settings } from "@/settings";
import { changeTheme } from "@/themes";

import { remote } from "electron";
import path from "path";
import AdmZip from "adm-zip";

const dialog = remote.dialog;
const app = remote.app;

export default {
  name: "SettingsView",
  components: {
    ConfirmDialog,
  },
  data() {
    return {
      actualLanguage: null,
      languages: [],
      actualTheme: null,
      themes: [],
      confirmDialogOpen: false,
      infoDialogOpen: false,
      infoDialogContent: "",
    };
  },
  mounted() {
    this.loadLanguages();
    this.loadThemes();
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
      this.$i18n.locale = language.value;
      settings.set("language", language.value);

      this.loadLanguages();
      this.loadThemes();
      this.$root.$emit("languageChange");
    },
    loadThemes() {
      this.themes = [];
      const themes = Object.entries(this.$t("themes"));

      for (const [code, label] of themes) {
        const themeOption = {
          label,
          value: code,
        };

        this.themes.push(themeOption);

        if (settings.get("theme") === code) {
          this.actualTheme = themeOption;
        }
      }
    },
    changeTheme(theme) {
      changeTheme(theme.value);
      settings.set("theme", theme.value);
    },
    cleanDatabase() {
      console.log("TODO");
    },
    exportDatabase() {
      dialog
        .showSaveDialog({
          defaultPath: path.join(app.getPath("desktop"), "RMDB"),
        })
        .then(({ canceled, filePath }) => {
          if (canceled) {
            return;
          }

          this.zipDirectory(settings.get("directories").main, filePath)
            .then(() => this.showInfoDialog("Database exported successfully"))
            .catch(console.error);
        });
    },
    importDatabase() {
      dialog
        .showOpenDialog({
          filters: [{ name: "RMDB zip files", extensions: ["zip"] }],
        })
        .then(({ canceled, filePaths }) => {
          if (canceled) {
            return;
          }

          const output = path.join(settings.get("directories").main, "..");

          this.unzipFile(filePaths[0], output)
            .then(() => {
              this.showInfoDialog("Database imported successfully");
              this.$root.$emit("reloadMovies");
            })
            .catch(console.error);
        });
    },
    zipDirectory(source, out) {
      return new Promise((resolve) => {
        const zip = new AdmZip();
        zip.addLocalFolder(source, "RMDB");
        zip.writeZip(out + ".zip");
        resolve();
      });
    },
    unzipFile(source, out) {
      return new Promise((resolve, reject) => {
        const zip = new AdmZip(source);
        zip.extractAllTo(out, true);
        resolve();
      });
    },
    showInfoDialog(content) {
      this.infoDialogOpen = true;
      this.infoDialogContent = content;

      setTimeout(() => {
        this.infoDialogOpen = false;
      }, 5000);
    },
  },
};
</script>

<style scoped></style>
