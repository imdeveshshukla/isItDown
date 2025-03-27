"use client"
import { GoogleLogo } from "./GoogleLogo";
import styles from "../app/page.module.css";
import { useTransition } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { signInWithGoogle } from "../app/actions/auth";

export default function Signin() {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={async () => {
        startTransition(async () => {
          await signInWithGoogle();
        });
      }}
    >
      {isPending ? (
        <LoadingSpinner />
      ) : (
        <button type="submit" className={`${styles.secondary}`}>
          <GoogleLogo className="mx-4"/> <span>{" "}</span> Signin with Google
        </button>
      )}
    </form>
  )
} 