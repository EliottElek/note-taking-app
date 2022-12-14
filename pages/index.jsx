import Head from "next/head";
import Loader from "../components/Loader";
import Card from "../components/Card";
import { supabase } from "../lib/supabase";
import Button from "../components/Button";
import StickyNavbar from "../components/StickyNavbar";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FiEdit } from "react-icons/fi";
export default function Home() {
  const [notes, setNotes] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let { data } = await supabase
        .from("notes")
        .select("slug, title, markdown, id");
      setNotes(data);
    };
    fetchData();
  }, []);
  return (
    <div>
      <Head>
        <title>My notes</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StickyNavbar>
        <div className="pb-4">
          <Link href="/new">
            <Button defaultbtn={true}>
              Add a new note <FiEdit />
            </Button>
          </Link>
        </div>
      </StickyNavbar>

      {!notes ? (
        <div className="flex justify-center mt-10 items-center">
          <Loader />
        </div>
      ) : (
        <main className={"main__grid"}>
          {notes?.map((note) => (
            <Card key={note.id} note={note} />
          ))}
        </main>
      )}
    </div>
  );
}
