import type { Preview, Decorator } from "@storybook/react-vite";
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  teamsLightTheme,
  teamsDarkTheme,
  type Theme,
} from "@fluentui/react-components";
import { withMsalAndApi } from "./msal-decorator";

const themeMap: Record<string, Theme> = {
  webLight: webLightTheme,
  webDark: webDarkTheme,
  teamsLight: teamsLightTheme,
  teamsDark: teamsDarkTheme,
};

const withFluentTheme: Decorator = (Story, context) => {
  const globalKey = (context.globals?.theme as string) || "webLight";
  const selected = themeMap[globalKey] ?? webLightTheme;

  return (
    <FluentProvider theme={selected} style={{ minHeight: "100vh" }}>
      <Story />
    </FluentProvider>
  );
};

const preview: Preview = {
  decorators: [withFluentTheme, withMsalAndApi],
  parameters: { controls: { expanded: true }, actions: {} },
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Fluent v9 theme",
      defaultValue: "webLight",
      toolbar: {
        icon: "paintbrush",
        dynamicTitle: true,
        items: [
          { value: "webLight", title: "Web Light" },
          { value: "webDark", title: "Web Dark" },
          { value: "teamsLight", title: "Teams Light" },
          { value: "teamsDark", title: "Teams Dark" },
        ],
      },
    },
  },
  tags: ["autodocs"],
};

export default preview;
