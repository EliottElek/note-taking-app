import "../styles/globals.css";
import "highlight.js/styles/atom-one-dark.css";

export default function App({ Component, pageProps }) {
  return (
    <div className="relative">
      <Component {...pageProps} />
    </div>
  );
}
