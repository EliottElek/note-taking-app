import React from "react";
import useDarkMode from "../lib/useDarkMode";
import { BsSun } from "react-icons/bs";
import { FiMoon } from "react-icons/fi";
const StickyNavbar = ({ children }) => {
  const [colorTheme, setTheme] = useDarkMode();

  return (
    <div className="sticky z-10 p-2 pt-3 top-0 left-0 right-0 flex items-center dark:bg-slate-800 bg-gray-300 border-b dark:border-b-slate-600 justify-between ">
      <div>{children}</div>
      <div className="flex items-center px-5 top-0 right-0">
        {colorTheme === "light" ? (
          <button
            onClick={() => setTheme("light")}
            className="flex items-center text-2xl gap-2 dark:text-gray-100 px-3 py-2 rounded-lg cursor-pointer dark:hover:text-purple-500 hover:text-purple-500 ease-in duration-100"
          >
            <BsSun />
          </button>
        ) : (
          <button
            onClick={() => setTheme("dark")}
            className="flex items-center text-2xl gap-2 dark:text-gray-100 px-3 py-2 rounded-lg cursor-pointer dark:hover:text-purple-500 hover:text-purple-500 ease-in duration-100"
          >
            <FiMoon />
          </button>
        )}
      </div>
    </div>
  );
};

export default StickyNavbar;