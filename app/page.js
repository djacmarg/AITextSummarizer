"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setSummary("Please enter some text to summarize.");
      return;
    }

    setLoading(true);
    setSummary("");

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSummary(data.error || "Failed to generate summary");
      } else {
        setSummary(data.summary || "No summary returned");
      }
    } catch (err) {
      setSummary("Error connecting to server: " + err.message);
    }

    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4 text-center">
        AI Text Summarizer
      </h1>
      <h6 className="text-xl font-normal mb-4 text-center">
        (Next.js 15 + Hugging Face)
      </h6>

      <form onSubmit={handleSubmit} className="w-full mb-4">
        <textarea
          className="w-full border rounded-lg p-3 text-sm"
          rows="6"
          placeholder="Paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-3 w-full"
        >
          {loading ? "Summarizing..." : "Summarize Text"}
        </button>
      </form>

      {summary && (
        <div className="w-full bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Summary:</h2>
          <p className="text-gray-700">{summary}</p>
        </div>
      )}
    </main>
  );
}
