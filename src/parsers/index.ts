import TheMovieDBParser from "./TheMovieDB.parser";
import Parser from "@/interfaces/parser.interface";

let parser: Parser | null;

const Parsers = {
  TheMovieDB: TheMovieDBParser,
};

function getParser(name: string) {
  return Parsers[name as keyof typeof Parsers];
}

function changeParser(name: string): void {
  const newParser = getParser(name); //Parsers[name]//
  parser = new newParser();
}

export { Parsers, parser, changeParser };
