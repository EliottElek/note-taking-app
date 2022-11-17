import React, { useRef, useState } from "react";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/outline";
const Tooltip = ({ children }) => {
  // pseudo-element "after" to make the tooltip arrow
  return (
    <div
      className="absolute flex items-center font-sans py-0.5 px-1.5 rounded-sm dark:bg-slate-600 bg-slate-300 dark:text-slate-200 top-1.5 right-10
        after:content-['']
        after:absolute
        after:w-0
        after:h-0 
        after:left-full
        after:border-b-[5px]
        after:border-t-[5px]
        after:border-transparent
        after:border-l-[7px] 
      dark:after:border-l-slate-600
      after:border-l-slate-300
      "
    >
      {children}
    </div>
  );
};
const CopyToClipBoard = ({ textRef }) => {
  const [open, setOpen] = useState(false);

  //function to copy to clipboard
  const copyToClipBoard = () => {
    if (textRef.current !== null && textRef.current.textContent !== null) {
      navigator.clipboard.writeText(textRef.current.textContent);
      setOpen(true);
      setTimeout(() => setOpen(false), 2000);
    }
  };
  return (
    <>
      {open && (
        <Tooltip>
          Copied <CheckIcon className="text-sky-500 h-5 w-5" />
        </Tooltip>
      )}
      <button
        className="text-slate-200 h-6 w-6 absolute top-2 right-2"
        onClick={copyToClipBoard}
      >
        <DocumentDuplicateIcon className="dark:text-slate-200 text-gray-700 opacity-30 hover:opacity-100 duration-75" />
      </button>
    </>
  );
};

const Pre = ({ children }) => {
  const textInput = useRef(null);
  return (
    <pre
      className="dark:bg-gray-800 bg-gray-100  rounded-lg my-2 mt-4 relative "
      ref={textInput}
    >
      {children}
      <CopyToClipBoard textRef={textInput} />
    </pre>
  );
};

export default Pre;
