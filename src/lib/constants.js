// Colors
export const colors = {
  transparent: "transparent",
  white: "#ffffff",
  black: "#000000",
  red: "#ff3b30",
  orange: "#ff9500",
  yellow: "#ffcc00",
  green: "#4cd964",
  tealBlue: "#59c8fa",
  blue: "#007aff",
  purple: "#5755d6",
  pink: "#ff3855",
  text: {
    default: () => colors.black,
    primary: () => colors.blue,
    positive: () => colors.green,
    warning: () => colors.orange,
    negative: () => colors.red
  },
  buttons: {
    default: () => colors.blue,
    primary: () => colors.white,
    positive: () => colors.white,
    warning: () => colors.black,
    negative: () => colors.white
  }
};

// Backgrounds
export const backgrounds = {
  default: () => colors.transparent,
  primary: () => colors.blue,
  positive: () => colors.green,
  warning: () => colors.orange,
  negative: () => colors.red
};

// Margins and Paddings
export const margins = {
  margin: "1rem"
};

export const paddings = {
  primary: "1rem",
  button: "1rem 1.25rem"
};

// Border Radiuses
export const radiuses = {
  primary: "8px"
};