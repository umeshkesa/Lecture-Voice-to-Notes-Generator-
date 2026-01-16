import whisper

def transcribe_audio(audio_path):
    model = whisper.load_model("base")
    result = model.transcribe(audio_path)
    return result["text"]

if __name__ == "__main__":
    audio_file = r"C:\Users\kesau\Downloads\Lecture-Voice-to-Notes\audio_samples\sample_lecture3.mp3"
    text = transcribe_audio(audio_file)

    print(text)

    with open("transcript.txt", "w", encoding="utf-8") as f:
        f.write(text)
