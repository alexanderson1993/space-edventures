import { lighten, darken } from "polished";

const generateColor = color => ({
  base: color,
  light: lighten(0.2, color),
  dark: darken(0.2, color)
});

const generateBackground = color => ({
  level0: color,
  level1: lighten(0.015, color),
  level2: lighten(0.03, color),
  level3: lighten(0.045, color)
});

export default (theme = {}) => ({
  ...theme,
  color: {
    primary: generateColor(theme.colorPrimary || "#30fffe"),
    header: generateColor(theme.colorHeader || "#a1ecfb"),
    control: generateColor(theme.colorControl || "#acf9fb"),
    ...theme.color
  },
  background: {
    primary: generateBackground(theme.backgroundPrimary || "#031212"),
    ...theme.background
  }
});
