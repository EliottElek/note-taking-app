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
const Edit = () => {
  const [content, setContent] = useState(null);
  const [mdContent, setMdContent] = useState(null);
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState();
  const [tagId, setTagId] = useState(null);
  const [raw, setRaw] = useState(true);
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
    try {
      await supabase
        .from("notes")
        .update({
          markdown: content,
          title: title,
          tags: tagId,
        })
        .eq("id", note.id);
      router.push(`/notes/${note?.slug}`);
    } catch (err) {}
  };
  return (
    <div className="p-4">
      <StickyNavbar>
        <div className="flex flex-col">
          <div>
            <Button defaultbtn={true} onClick={saveNewPost}>
              <Link href={`/notes/${note?.slug}`}>Back</Link>
            </Button>
            <Button onClick={saveNewPost}>Save post</Button>
          </div>
          <div className="flex gap-2 items-center mt-4">
            <Tab active={raw} onClick={() => setRaw(true)}>
              Raw
            </Tab>
            <Tab active={!raw} onClick={() => setRaw(false)}>
              Preview
            </Tab>
          </div>
        </div>
      </StickyNavbar>
      {!note ? (
        <div className="flex justify-center w-full h-[40vh] items-center ">
          <Loader />
        </div>
      ) : (
        <>
          <div>
            <div>
              <input
                type="text"
                id="first_name"
                className="bg-transparent border-none text-3xl focus:outline-none w-full mt-3"
                placeholder="Title of your note..."
                required
                disabled={!raw}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-3">
            {raw ? (
              <Editor content={content} setContent={setContent} />
            ) : (
              <Mdx mdContent={mdContent} />
            )}
          </div>
        </>
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
