import Store from "electron-store";
import { remote } from "electron";
import Parser from "./interfaces/parser.interface";
import Parsers from "@/enums/parsers.enum";
import parsersList from "@/parsers";

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
    parser: Parsers.TheMovieDB,
  },
});

const parserName = settings.get("parser");
const parser: Parser = new parsersList[parserName]();

export { settings, parser };
