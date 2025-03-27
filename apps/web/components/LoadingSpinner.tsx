import styles from "../app/page.module.css";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className={`${styles.secondary} flex items-center gap-2 px-4 py-2`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
        <span>Loading...</span>
      </div>
    </div>
  );
} 