import { createContext, useState } from "react";

export const FocusContext = createContext();

export function FocusProvider({ children }) {
  const [focusActive, setFocusActive] = useState(false);
  const [allowedBreakUsed, setAllowedBreakUsed] = useState(false);

  return (
    <FocusContext.Provider
      value={{
        focusActive,
        setFocusActive,
        allowedBreakUsed,
        setAllowedBreakUsed
      }}
    >
      {children}
    </FocusContext.Provider>
  );
}
