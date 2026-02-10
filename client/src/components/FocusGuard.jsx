import { useEffect, useContext } from "react";
import { FocusContext } from "../context/FocusContext";

function FocusGuard() {
  const { allowedBreakUsed, setAllowedBreakUsed } =
    useContext(FocusContext);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        if (!allowedBreakUsed) {
          const allow = window.confirm(
            "⚠️ You left focus mode.\n\nDo you want a 5-minute break? (Only once)"
          );

          if (allow) {
            setAllowedBreakUsed(true);
            setTimeout(() => {
              alert("⏰ Break over. Back to focus!");
            }, 5 * 60 * 1000);
          } else {
            alert("🚫 Stay focused!");
          }
        } else {
          alert("🚫 No more breaks allowed!");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [allowedBreakUsed]);

  return null;
}

export default FocusGuard;
