import fs from "fs";
//import movieDatabase from "./database";
import { settings } from "@/settings";
import i18n from "@/i18n";

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

  //movieDatabase.initDB();
}

export default init;
