import Store from "electron-store";
import { remote } from "electron";

const app = remote.app;
const homePath = app.getPath("documents");

const mainDirectory = homePath + "/RMDB";

const settings = new Store({
  defaults: {
    directories: {
      main: mainDirectory,
      posters: mainDirectory + "/posters",
    },
    language: "en",
    theme: "default",
    parser: "TheMovieDB",
  },
});

export { settings };
