import Store from "electron-store";
import { remote } from "electron";
import Extractor from "./interfaces/extractor.interface";
import Extractors from "@/enums/extractors.enum";
import extractorsList from "@/extractors";

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
    extractor: Extractors.TheMovieDB,
    mediaPlayerPath: "",
  },
});

const extractorName = settings.get("extractor");
const extractorClass = extractorsList[extractorName];
const extractor: Extractor = new extractorClass();

export { settings, extractor };
