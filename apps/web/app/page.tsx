import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import Signin from "../components/Signin";
import Signout from "../components/Signout";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

import { auth } from "./auth";

export default async function Home() {
  const session = await auth();
  console.log(session);
  return (
    <div className={styles.page}>
      {session&&<h1>Hello {session?.user?.name}</h1>}
      <main className={styles.main}>

        <Signin />
        <Signout />
      </main>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com/templates?search=turborepo&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://turbo.build?utm_source=create-turbo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to turbo.build →
        </a>
      </footer>
    </div>
  );
}
