import fs from "fs";
//import movieDatabase from "./database";
import { settings } from "@/settings";

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

  //movieDatabase.initDB();
}

export default init;
