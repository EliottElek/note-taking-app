import React from "react";
import { supabase } from "../../../lib/supabase";
import { serialize } from "next-mdx-remote/serialize";
import rehypeHighlight from "rehype-highlight";
import Button from "../../../components/Button";
import Mdx from "../../../components/Mdx";
import Link from "next/link";
import { useRouter } from "next/router";
const Slug = ({ note, mdContent }) => {
  const { asPath } = useRouter();

  return (
    <div>
      <Link href="/">
        <Button>Back</Button>
      </Link>
      <Link href={asPath + "/edit"}>
        <Button defaultBtn>Edit</Button>
      </Link>
      <h1>{note.title}</h1>
      <Mdx mdContent={mdContent} />
    </div>
  );
};

export default Slug;

export async function getStaticPaths() {
  try {
    let { data } = await supabase.from("notes").select("slug");
    const paths = data.map((note) => {
      return { params: { slug: note.slug } };
    });
    return {
      paths: paths,
      fallback: false, // can also be true or 'blocking'
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
      props: { note: data, mdContent: mdxSource },
    };
  } catch (err) {}
}
