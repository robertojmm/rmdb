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
          <q-select
            v-model="actualParser"
            :options="parsers"
            @input="changeParser"
          />
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
            :label="$t('settings.export_btn')"
            color="primary"
            @click="exportDatabase"
          ></q-btn>
        </q-item-section>
        <q-item-section>
          <q-btn
            :label="$t('settings.import_btn')"
            color="primary"
            @click="importDatabase"
          ></q-btn>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-btn
            label="movie folders"
            color="primary"
            @click="configurateFolders = true"
          ></q-btn>
        </q-item-section>
      </q-item>

      <q-separator spaced inset />

      <q-item>
        <q-item-section>
          <q-item-label>{{ $t("settings.clean_db") }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-btn
            :label="$t('settings.clean_btn')"
            color="negative"
            @click="confirmDialogOpen = true"
          ></q-btn>
        </q-item-section>
      </q-item>

      <confirmDialog
        :dialogOpen.sync="confirmDialogOpen"
        :title="$t('settings.clean_dialog')"
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

    <q-dialog v-model="configurateFolders" full-width persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Full Width</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="q-pa-md">
            <q-list bordered separator>
              <template v-for="folder in movieFolders">
                <q-item clickable v-ripple v-bind:key="folder">
                  <q-item-section>
                    <q-item-label>{{ folder }}</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-btn-group>
                      <q-btn color="primary" icon="edit" />
                      <q-btn
                        color="negative"
                        icon="delete"
                        @click="removeMovieFolder(folder)"
                      />
                    </q-btn-group>
                  </q-item-section>
                </q-item>
              </template>

              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>Item with caption</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-btn-group>
                    <q-btn
                      color="primary"
                      icon="colorize"
                      @click="addMovieFolder"
                    />
                    <q-btn color="negative" icon="delete" />
                  </q-btn-group>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import ConfirmDialog from "@/components/ConfirmDialog";
import { settings } from "@/settings";
import { changeTheme } from "@/themes";
import { Parsers, changeParser } from "@/parsers";
import { movieDatabase } from "@/database";

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
      actualParser: null,
      parsers: [],
      confirmDialogOpen: false,
      infoDialogOpen: false,
      infoDialogContent: "",
      configurateFolders: false,
      movieFolders: [],
    };
  },
  mounted() {
    this.loadLanguages();
    this.loadThemes();
    this.loadParsers();
    this.loadMovieFolders();
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
    loadParsers() {
      this.parsers = Object.keys(Parsers);
      this.actualParser = settings.get("parser");
    },
    changeParser(parser) {
      changeParser(parser);
      settings.set("parser", parser);
    },
    loadMovieFolders() {
      this.movieFolders = settings.get("directories").movies;
    },
    addMovieFolder() {
      dialog
        .showOpenDialog({
          properties: ["openDirectory"],
        })
        .then(({ canceled, filePaths }) => {
          if (canceled) {
            return;
          }

          const directories = settings.get("directories");
          directories.movies.push(filePaths[0]);
          settings.set("directories", directories);
          this.loadMovieFolders();
        });
    },
    removeMovieFolder(movieFolder) {
      const directories = settings.get("directories");
      const movieFolders = directories.movies;
      const newMovieFolders = movieFolders.filter(
        (folder) => folder != movieFolder
      );

      directories.movies = newMovieFolders;
      settings.set("directories", directories);
      this.loadMovieFolders();
    },
    cleanDatabase() {
      movieDatabase.cleanDatabase().then(() => {
        this.showInfoDialog("Database cleared");
        this.$root.$emit("reloadMovies");
      });
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
            .then(() => this.showInfoDialog(this.$t("settings.export_success")))
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
              this.showInfoDialog(this.$t("settings.import_success"));
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
      movieDatabase.cleanFolderDirectory();
      return new Promise((resolve) => {
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
