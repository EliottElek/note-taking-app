import React, { useEffect, useState } from "react";
import Editor from "../components/Editor";
import { supabase } from "../lib/supabase";
import slugify from "react-slugify";
import { useRouter } from "next/router";
import Mdx from "../components/Mdx";
import { serialize } from "next-mdx-remote/serialize";
import rehypeHighlight from "rehype-highlight";
import Button from "../components/Button";
import Link from "next/link";
import shortid from "shortid";
import StickyNavbar from "../components/StickyNavbar";
const New = () => {
  const [content, setContent] = useState("");
  const [mdContent, setMdContent] = useState(null);
  const [title, setTitle] = useState("");
  const [tagId, setTagId] = useState(null);
  const router = useRouter();
  const handleChange = (e) => setTagId(e.target.value);

  const [tags, setTags] = useState([]);

  useEffect(() => {
    const loadTags = async () => {
      try {
        let { data } = await supabase.from("tags").select("*");
        setTags(data);
      } catch (err) {}
    };
    loadTags();
  }, [setTags]);

  useEffect(() => {
    const serializeMarkdown = async () => {
      try {
        const mdxSource = await serialize(content, {
          mdxOptions: { rehypePlugins: [rehypeHighlight] },
        });
        setMdContent(mdxSource);
      } catch (err) {}
    };
    serializeMarkdown();
  }, [setMdContent, content]);

  const createNewPost = async () => {
    if (title === "") return;
    try {
      const slug = slugify(title) + shortid.generate();
      await supabase.from("notes").insert({
        markdown: content,
        title: title,
        tags: tagId,
        slug: slug,
      });
      router.push("/notes/" + slug);
    } catch (err) {}
  };
  return (
    <div>
      <StickyNavbar>
        <div className="flex pb-4">
          <Link href="/">
            <Button defaultbtn={true}>Cancel</Button>
          </Link>
          <Button onClick={createNewPost}>Publish note</Button>
        </div>
      </StickyNavbar>
      <div className="mt-2 md:p-10 p-4 text-lg">
        <div>
          <input
            type="text"
            id="first_name"
            class="bg-transparent border-none  text-3xl focus:outline-none my-4"
            placeholder="Title of your note..."
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <Editor content={content} setContent={setContent} />
        <Mdx mdContent={mdContent} />
      </div>
    </div>
  );
};

export default New;
