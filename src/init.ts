import fs from "fs";
//import movieDatabase from "./database";
import { settings } from "@/settings";
import i18n from "@/i18n";
import themes from "@/themes";
import { colors } from "quasar";

function init(): void {
  const directories = settings.get("directories");

  const appDirectory = directories.main;
  if (!fs.existsSync(appDirectory)) {
    fs.mkdirSync(appDirectory);
  }

  const postersDirectory = directories.posters;
  if (!fs.existsSync(postersDirectory)) {
    fs.mkdirSync(postersDirectory);
  }

  i18n.locale = settings.get("language");

  const actualTheme: string = settings.get("theme");

  const theme = themes[actualTheme];
  console.log(theme);

  for (const [label, color] of Object.entries(theme)) {
    colors.setBrand(label, color);
  }

  //Load theme
  //movieDatabase.initDB();
}

export default init;
