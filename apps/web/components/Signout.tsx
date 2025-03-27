"use client"
import { GoogleLogo } from "./GoogleLogo";
import styles from "../app/page.module.css";
import { useTransition } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { signOutUser } from "../app/actions/auth";

export default function Signout() {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={async () => {
        startTransition(async () => {
          await signOutUser();
        });
      }}
    >
      {isPending ? (
        <LoadingSpinner />
      ) : (
        <button type="submit" className={`${styles.secondary}`}>
          <GoogleLogo className="mx-4"/>{" "} Signout
        </button>
      )}
    </form>
  )
} 