import themes from "./themes.json";
import { colors } from "quasar";

function changeTheme(name: string): void {
  const theme = themes[name];

  for (const [label, color] of Object.entries(theme)) {
    colors.setBrand(label, color as string);
  }
}

export { themes, changeTheme };
