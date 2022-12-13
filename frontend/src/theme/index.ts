import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import { colors } from "./colors";
import { fonts } from "./fonts";
import { styles } from "./styles";

const overrides = {
  fonts,
  colors,
  styles,
};

const withDefaults = [withDefaultColorScheme({ colorScheme: "brand" })];

export const theme = extendTheme(overrides, ...withDefaults);
