import { createContext, useContext } from "react";
import { type BloodOnTheClocktowerCustomScript } from "../../generated/script-schema";

const rawScriptContext = createContext<BloodOnTheClocktowerCustomScript>([]);

export const RawScriptContextProvider = rawScriptContext.Provider;
export const useRawScript = () => useContext(rawScriptContext);
