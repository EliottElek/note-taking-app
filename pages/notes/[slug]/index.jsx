import React, { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { serialize } from "next-mdx-remote/serialize";
import rehypeHighlight from "rehype-highlight";
import Button from "../../../components/Button";
import Mdx from "../../../components/Mdx";
import Link from "next/link";
import { useRouter } from "next/router";
import StickyNavbar from "../../../components/StickyNavbar";
import Modal from "../../../components/Modal";
const Slug = ({ note, mdContent }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDeleteNote = async () => {
    try {
      await supabase.from("notes").delete().eq("id", note.id);
      setOpen(false);
      router.push("/");
    } catch (err) {}
  };
  return (
    <div className="relative p-10">
      <StickyNavbar>
        <Link href="/">
          <Button defaultbtn={true}>Back</Button>
        </Link>
        <Link href={router.asPath + "/edit"}>
          <Button>Edit</Button>
        </Link>
        <Button onClick={() => setOpen(true)} deletebtn={true}>
          Delete
        </Button>
      </StickyNavbar>

      <h1>{note?.title}</h1>
      <Mdx mdContent={mdContent} />
      <Modal
        open={open}
        setOpen={setOpen}
        onValidate={handleDeleteNote}
        onCancel={() => setOpen(false)}
      >
        <p className="text-sm text-gray-200">
          Êtes-vous sûr(e) de vouloir supprimer cette note ?
        </p>
      </Modal>
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
      props: { note: data, mdContent: mdxSource },
      revalidate: 1,
    };
  } catch (err) {}
}
