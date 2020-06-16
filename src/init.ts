import fs from "fs";
import { settings } from "@/settings";
import i18n from "@/i18n";
import { changeTheme } from "@/themes";
import { changeParser } from "@/parsers";
import { initDB } from "@/database";

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

  const actualParser: string = settings.get("parser");
  changeParser(actualParser);

  initDB();
}

export default init;
