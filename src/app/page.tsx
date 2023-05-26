import RichTextArea from "./components/RichTextArea";

export default function Home() {
  return (
    <main className="flex min-h-screen max-w-screen">
      <div className="border-white-100 border-2 p-4 min-w-fit ">
        Variable Type Playground
      </div>
      <RichTextArea />
    </main>
  );
}
