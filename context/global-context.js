import {createContext} from "react";

export const globalInitialState = {user: {}};

export const GlobalContext = createContext(globalInitialState);
