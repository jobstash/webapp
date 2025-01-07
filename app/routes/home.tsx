import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "JobStash" },
    { name: "description", content: "Crypto Native Jobs" },
  ];
}

export default function Home() {
  return <p>Hello, JobStash!</p>;
}
