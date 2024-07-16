import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  ChakraProvider,
  ColorModeScript,
  Container,
  extendTheme,
} from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { RouterProvider } from "react-router";
import { router } from "./route/route.jsx";
import { RecoilRoot } from "recoil";
import { SelectProvider } from "./context/selectConversetion.jsx";
import { SocketProvider } from "./context/socketContext.jsx";
const styles = {
  global: (props) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: mode("gray.100", "#101010")(props),
    },
  }),
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: "true",
};
const colors = {
  gray: {
    light: "#616161",
    dark: "#1e1e1e",
  },
};
const breakpoints = {
  smm: "1100px",
};
const theme = extendTheme({ styles, config, colors, breakpoints });
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <SelectProvider>
        <SocketProvider>
          <ChakraProvider theme={theme}>
            <Container>
              <RouterProvider router={router}>
                <ColorModeScript
                  initialColorMode={theme.config.initialColorMode}
                />

                <App />
              </RouterProvider>
            </Container>
          </ChakraProvider>
        </SocketProvider>
      </SelectProvider>
    </RecoilRoot>
  </React.StrictMode>
);
