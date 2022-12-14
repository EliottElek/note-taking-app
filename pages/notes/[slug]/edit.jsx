import React, { useEffect, useState } from "react";
import Editor from "../../../components/Editor";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/router";
import Link from "next/link";
import Mdx from "../../../components/Mdx";
import { serialize } from "next-mdx-remote/serialize";
import rehypeHighlight from "rehype-highlight";
import Button from "../../../components/Button";
import StickyNavbar from "../../../components/StickyNavbar";
import Loader from "../../../components/Loader";
import slugify from "react-slugify";
import shortid from "shortid";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import { useKey } from "../../../lib/saveOnCtrlS";
const Edit = () => {
  const [content, setContent] = useState(null);
  const [mdContent, setMdContent] = useState(null);
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState();
  const [tagId, setTagId] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
  useEffect(() => {
    const loadNote = async () => {
      const slug = router.asPath.split("/")[2];
      console.log(slug);
      try {
        let { data } = await supabase
          .from("notes")
          .select(`*`)
          .eq("slug", slug)
          .limit(1)
          .single();
        const mdxSource = await serialize(data.markdown, {
          mdxOptions: { rehypePlugins: [rehypeHighlight] },
        });
        setNote(data);
        setTitle(data.title);
        setContent(data.markdown);
        setMdContent(mdxSource);
      } catch (err) {}
    };
    loadNote();
  }, [setNote, setMdContent, setTitle, router]);
  const saveNewPost = async () => {
    setLoading(true);
    try {
      const slug = slugify(title) + shortid.generate();
      await supabase
        .from("notes")
        .update({
          markdown: content,
          title: title,
          tags: tagId,
          slug: slug,
        })
        .eq("id", note.id);
      setLoading(false);
    } catch (err) {}
  };
  useKey("ctrls", saveNewPost);

  return (
    <div>
      <Head>
        <title>{note?.title}-edit | My notes</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StickyNavbar>
        <div className="flex flex-col">
          <div className="flex items-center">
            <Link href={`/notes/${note?.slug}`}>
              <Button defaultbtn={true}>
                <ChevronLeftIcon className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <Button onClick={saveNewPost}>
              {loading ? "Saving..." : "Save note"}
            </Button>
          </div>
        </div>
      </StickyNavbar>
      {!note ? (
        <div className="flex justify-center w-full h-[40vh] items-center ">
          <Loader />
        </div>
      ) : (
        <div className="md:p-10 p-4">
          <div>
            <div>
              <input
                type="text"
                id="first_name"
                className="bg-transparent border-none text-3xl focus:outline-none w-full mt-3"
                placeholder="Title of your note..."
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-3">
            <Editor content={content} setContent={setContent} />
            <div className="w-full border-b my-3 dark:border-b-slate-600" />
            <Mdx mdContent={mdContent} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Edit;

const Tab = ({ children, active, onClick }) => (
  <div
    onClick={onClick}
    className={[
      "flex items-center justify-center px-4 py-2 cursor-pointer",
      active && "dark:bg-gray-600 bg-gray-200 rounded-t-lg",
    ].join(" ")}
  >
    {children}
  </div>
);
