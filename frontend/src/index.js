import './setup'
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import {VideoChatProvider} from "./context/VideoChatContext"
import { AuthProvider } from "./context/AuthContext";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <AuthProvider>
      <VideoChatProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </VideoChatProvider>
    </AuthProvider>
);
