import { useRef, useEffect } from "react";

export function useKey(key, ref) {
  const callback = useRef(ref);

  useEffect(() => {
    callback.current = ref;
  });

  useEffect(() => {
    function handle(event) {
      if (event.code === key) {
        callback.current(event);
      } else if (key === "ctrls" && event.code==='KeyS' && event.ctrlKey) {
        callback.current(event);
      }
    }

    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [key]);
}
