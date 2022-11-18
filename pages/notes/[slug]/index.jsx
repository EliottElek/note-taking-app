import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { serialize } from "next-mdx-remote/serialize";
import rehypeHighlight from "rehype-highlight";
import Button from "../../../components/Button";
import Mdx from "../../../components/Mdx";
import Link from "next/link";
import { useRouter } from "next/router";
import StickyNavbar from "../../../components/StickyNavbar";
import Modal from "../../../components/Modal";
import Loader from "../../../components/Loader";
const Slug = () => {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(null);
  const [mdContent, setMdContent] = useState(null);

  const router = useRouter();

  const handleDeleteNote = async () => {
    try {
      await supabase.from("notes").delete().eq("id", note.id);
      setOpen(false);
      router.push("/");
    } catch (err) {}
  };
  useEffect(() => {
    const loadNote = async () => {
      const slug =
        router.asPath.split("/")[router.asPath.split("/").length - 1];
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
        setMdContent(mdxSource);
      } catch (err) {}
    };
    loadNote();
  }, [setNote, setMdContent, router]);
  return (
    <div className="relative">
      <StickyNavbar>
        <div className="pb-4">
          <Link href="/">
            <Button defaultbtn={true}>Back</Button>
          </Link>
          <Link href={router.asPath + "/edit"}>
            <Button>Edit</Button>
          </Link>
          <Button onClick={() => setOpen(true)} deletebtn={true}>
            Delete
          </Button>
        </div>
      </StickyNavbar>

      {!note ? (
        <div className="flex justify-center w-full h-[40vh] items-center ">
          <Loader />
        </div>
      ) : (
        <div className="p-10">
          <h1>{note?.title}</h1>
          <Mdx mdContent={mdContent} />
        </div>
      )}
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
