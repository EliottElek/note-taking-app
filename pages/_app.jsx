import "../styles/globals.css";
import useDarkMode from "../lib/useDarkMode";
import { BsSun } from "react-icons/bs";
import { FiMoon } from "react-icons/fi";
export default function App({ Component, pageProps }) {
  const [colorTheme, setTheme] = useDarkMode();

  return (
    <div className="relative">
      <div className="flex items-center px-5 absolute top-0 right-0">
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
      <Component {...pageProps} />
    </div>
  );
}
