import React from "react";
import useDarkMode from "../lib/useDarkMode";
import { BsGithub, BsSun } from "react-icons/bs";
import { FiMoon } from "react-icons/fi";
const StickyNavbar = ({ children }) => {
  const [colorTheme, setTheme] = useDarkMode();

  return (
    <div className="sticky z-10 p-3 pb-0 pt-4 top-0 left-0 right-0 flex items-center dark:bg-slate-700 bg-gray-100 border-b dark:border-b-slate-600 justify-between ">
      {children}
      <div className="flex items-center px-5 pb-4">
        {colorTheme === "light" ? (
          <button
            onClick={() => setTheme("light")}
            className="flex items-center text-2xl gap-2 dark:text-gray-100 px-3 py-2 rounded-lg cursor-pointer dark:hover:text-green-500 hover:text-green-500 ease-in duration-100"
          >
            <BsSun />
          </button>
        ) : (
          <button
            onClick={() => setTheme("dark")}
            className="flex items-center text-2xl gap-2 dark:text-gray-100 px-3 py-2 rounded-lg cursor-pointer dark:hover:text-green-500 hover:text-green-500 ease-in duration-100"
          >
            <FiMoon />
          </button>
        )}
        <a
        href= "https://github.com/eliottelek/note-taking-app"
          target="_blank"
          className="flex items-center text-2xl gap-2 dark:text-gray-100 px-3 py-2 rounded-lg cursor-pointer dark:hover:text-green-500 hover:text-green-500 ease-in duration-100"
        >
          <BsGithub />
        </a>
      </div>
    </div>
  );
};

export default StickyNavbar;
