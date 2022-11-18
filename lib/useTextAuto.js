import { useEffect } from "react";

export const useTextareaAutoHeight = (ref) => {
  useEffect(() => {
    const listener = () => {
      ref.current.style.padding = "0px";
      ref.current.style.height = ref.current.scrollHeight + "px";
      ref.current.style.removeProperty("padding");
    };
    ref.current.addEventListener("input", listener);
  }, [ref]);
};
