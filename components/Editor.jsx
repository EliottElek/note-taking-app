import React, { useRef } from "react";
import { useTextareaAutoHeight } from "../lib/useTextAuto";
const Editor = ({ content, setContent }) => {
  const ref = useRef();
  useTextareaAutoHeight(ref);
  return (
    <form>
      <div className="w-full mb-4">
        <resizable-textarea>
          <textarea
            id="editor"
            resiz
            className="block text-lg w-full focus:outline-none px-0 text-gray-800  border-none bg-transparent dark:text-white dark:placeholder-gray-400"
            placeholder="Write your content here (markdown supported)"
            required
            ref={ref}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </resizable-textarea>
      </div>
    </form>
  );
};

export default Editor;
