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
      const mdxSource = await serialize(content, {
        mdxOptions: { rehypePlugins: [rehypeHighlight] },
      });
      setMdContent(mdxSource);
    };
    serializeMarkdown();
  }, [setMdContent, content]);

  const createNewPost = async () => {
    try {
      await supabase.from("notes").insert({
        markdown: content,
        title: title,
        tags: tagId,
        slug: slugify(title),
      });
      router.push("/");
    } catch (err) {}
  };
  return (
    <div className="p-4">
      <div>
        <div>
          <input
            type="text"
            id="first_name"
            class="bg-transparent border-none text-3xl focus:outline-none"
            placeholder="Title of your note..."
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <div className = "max-w-[200px] my-4">
            <label
              for="countries_disabled"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select tags
            </label>
            <select
              onChange={handleChange}
              placeholder="Choose a tag"
              id="countries_disabled"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
      <div className="flex gaap-3">
        <Button onClick={createNewPost}>Publish post</Button>
        <Link href="/">
          <Button defaultBtn>Cancel</Button>
        </Link>
      </div>
      <Mdx mdContent={mdContent} />
    </div>
  );
};

export default New;
