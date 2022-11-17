import React from "react";
import { MDXRemote } from "next-mdx-remote";
import Pre from "./Pre";

const components = {
  pre: Pre,
  a: (props) => <a className="underline" {...props} />,
};
const Mdx = ({ mdContent }) => {
  if (!mdContent) return;
  return <MDXRemote {...mdContent} components={components} />;
};

export default Mdx;
