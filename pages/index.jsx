import Head from "next/head";
import Loader from "../components/Loader";
import Card from "../components/Card";
import { supabase } from "../lib/supabase";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function Home() {
  const [notes, setNotes] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let { data } = await supabase
        .from("notes")
        .select("slug, title, markdown");
      setNotes(data);
    };
    fetchData();
  }, []);
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Link href="/new">
        <Button>Add a new note</Button>
      </Link>

      <main className={"main__grid"}>
        {!notes ? (
          <Loader />
        ) : (
          notes?.map((note) => (
            <Link key={note.id} href={`/notes/${note.slug}`}>
              <Card note={note} />
            </Link>
          ))
        )}
      </main>
    </div>
  );
}
