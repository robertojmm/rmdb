import open from "open";
import fs from "fs";
import { settings } from "./settings";

export function openByPath(path: string) {
  const movieFolders = settings.get("directories").movies;
  let error = true;

  for (const movieFolder of movieFolders) {
    const fullPath = movieFolder + path;
    console.log(fullPath);

    if (fs.existsSync(fullPath)) {
      open(fullPath);
      error = false;
    }
  }

  return error;
}

export function checkPathIsCorrect(moviePath: string) {
  const movieFolders = settings.get("directories").movies;

  for (const folder of movieFolders) {
    const pathIsCorrect =
      moviePath.startsWith(folder) ||
      moviePath.startsWith("/") ||
      moviePath.startsWith("\\");

    if (pathIsCorrect) {
      const newPath = moviePath.replace(folder, "");
      return newPath;
    }
  }
  return "";
}
