import themes from "./themes.json";
import { colors } from "quasar";

function getTheme(name: string) {
  return themes[name as keyof typeof themes];
}

function changeTheme(name: string): void {
  const theme = getTheme(name);

  for (const [label, color] of Object.entries(theme)) {
    colors.setBrand(label, color as string);
  }
}

export { themes, changeTheme, getTheme };
