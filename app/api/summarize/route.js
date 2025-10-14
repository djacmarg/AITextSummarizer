import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Input text is empty." },
        { status: 400 }
      );
    }

    const api_token = process.env.HF_TOKEN;
    // const apiEndpoin="https://api-inference.huggingface.co/models/google/pegasus-xsum";
    //const apiEndpoint="https://api-inference.huggingface.co/models/allenai/led-large-16384";
    const apiEndpoint =
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${api_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text,
        parameters: { min_length: 150, max_length: 400 },
      }),
    });

    const data = await response.json();
    //console.log("Hugging Face Response:", data);

    // Check if Hugging Face returned an error
    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 500 });
    }

    // Safely extract summary
    const summary =
      Array.isArray(data) && data[0]?.summary_text
        ? data[0].summary_text
        : "No summary generated.";

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
