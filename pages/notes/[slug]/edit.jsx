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
const Edit = ({ note, mdContentd }) => {
  const [content, setContent] = useState(note?.markdown);
  const [mdContent, setMdContent] = useState(mdContentd);
  const [title, setTitle] = useState(note?.title);
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
      const mdxSource = await serialize(content, {
        mdxOptions: { rehypePlugins: [rehypeHighlight] },
      });
      setMdContent(mdxSource);
    };
    serializeMarkdown();
  }, [setMdContent, content]);

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
      router.push(`/notes/${note.slug}`);
    } catch (err) {}
  };
  return (
    <div className="p-4">
      <StickyNavbar>
        <Button onClick={saveNewPost}>Save post</Button>
        <Button defaultbtn={true} onClick={saveNewPost}>
          <Link href={`/notes/${note.slug}`}>Back</Link>
        </Button>
      </StickyNavbar>

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
        <div>
          <div className="max-w-[200px] my-4">
            <label
              for="countries_disabled"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select tags
            </label>
            <select
              onChange={handleChange}
              placeholder="Choose a tag"
              id="countries_disabled"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              {tags?.map((tag) => (
                <option value={tag.id} key={tag.id}>
                  {tag.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <Editor content={content} setContent={setContent} />

      <Mdx mdContent={mdContent} />
    </div>
  );
};

export default Edit;

export async function getStaticPaths() {
  try {
    let { data } = await supabase.from("notes").select("slug");
    const paths = data.map((note) => {
      return { params: { slug: note.slug } };
    });
    return {
      paths: paths,
      fallback: "blocking", // can also be true or 'blocking'
    };
  } catch (err) {}
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(context) {
  try {
    const slug = context.params.slug;
    let { data } = await supabase
      .from("notes")
      .select(`*`)
      .eq("slug", slug)
      .limit(1)
      .single();
    const mdxSource = await serialize(data.markdown, {
      mdxOptions: { rehypePlugins: [rehypeHighlight] },
    });
    return {
      // Passed to the page component as props
      props: { note: data, mdContentd: mdxSource },
      revalidate: 100,
    };
  } catch (err) {}
}
