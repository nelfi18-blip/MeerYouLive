import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>MeetYouLive</h1>
      <nav>
        <Link href="/login">Login</Link>
      </nav>
    </main>
  );
}
