import fs from "fs";
//import movieDatabase from "./database";
import { settings } from "@/settings";
import i18n from "@/i18n";
import { changeTheme } from "@/themes";

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
  changeTheme(actualTheme);
}

export default init;
