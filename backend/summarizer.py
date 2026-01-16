from groq_summarizer import groq_summarize

def load_transcript(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read().strip()

def chunk_text(text, chunk_size=1000):
    words = text.split()
    chunks, current = [], []
    for word in words:
        current.append(word)
        if len(current) >= chunk_size:
            chunks.append(" ".join(current))
            current = []
    if current:
        chunks.append(" ".join(current))
    return chunks

if __name__ == "__main__":
    transcript = load_transcript("transcript.txt")
    chunks = chunk_text(transcript)

    final_notes = []
    for chunk in chunks:
        final_notes.append(groq_summarize(chunk))

    with open("ai_notes.txt", "w", encoding="utf-8") as f:
        f.write("\n\n".join(final_notes))

    print("AI notes generated using Groq!")
