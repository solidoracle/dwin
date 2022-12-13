import { darkTheme, Theme } from "@rainbow-me/rainbowkit";
import { merge } from "lodash";
import { fonts } from "./fonts";

export const walletConnectionTheme = merge(
  darkTheme({ overlayBlur: "small" }),
  {
    colors: {
      accentColor: "none",
    },
    fonts: {
      body: fonts.body,
    },
    radii: {
      connectButton: "7px",
    },
  } as Theme
);
