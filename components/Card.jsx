import Link from "next/link";
import React, { useState, useEffect } from "react";
import Modal from "../components/Modal";
import Button from "./Button";
import Mdx from "../components/Mdx";
import rehypeHighlight from "rehype-highlight";
import { serialize } from "next-mdx-remote/serialize";
const Card = ({ note }) => {
  const [open, setOpen] = useState(false);
  const [mdContent, setMdContent] = useState(null);

  useEffect(() => {
    const serializeMarkdown = async () => {
      try {
        const mdxSource = await serialize(note?.markdown, {
          mdxOptions: { rehypePlugins: [rehypeHighlight] },
        });
        setMdContent(mdxSource);
      } catch (err) {}
    };
    serializeMarkdown();
  }, [setMdContent, note?.markdown]);

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-slate-800 dark:border-gray-700">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
        {note.title}
      </h5>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 truncate">
        {note.markdown}
      </p>
      <div className="flex items-center gap-2">
        <Link
          href={`/notes/${note.slug}`}
          className="inline-flex items-center px-3 py-2 text-sm font-medium
        text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800
        focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600
        dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Read more
          <svg
            aria-hidden="true"
            className="w-4 h-4 ml-2 -mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </Link>
        <Button
          onClick={() => setOpen(true)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium
        text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800
        focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600
        dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Preview
        </Button>
      </div>
      <Modal open={open} setOpen={setOpen} displayOnly title={note.title}>
        <p className="dark:text-gray-200 w-full">
          <Mdx mdContent={mdContent} />
        </p>
      </Modal>
    </div>
  );
};

export default Card;
