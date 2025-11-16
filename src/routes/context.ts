import { createContext } from "svelte";

export const [getAccessToken, setAccessToken] = createContext<string>();