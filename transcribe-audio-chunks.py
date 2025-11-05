#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Transcribe audio file in chunks to handle longer audio
"""

import speech_recognition as sr
from pydub import AudioSegment
import os
import sys

# Fix encoding for Windows
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# Load the audio file
audio_file = sys.argv[1] if len(sys.argv) > 1 else "Cole_Hammer_audio.wav"

if not os.path.exists(audio_file):
    print(f"Error: {audio_file} not found")
    exit(1)

print(f"\nTranscribing {audio_file} in chunks...")
print("=" * 60)

recognizer = sr.Recognizer()

try:
    # Load the audio file
    audio = AudioSegment.from_wav(audio_file)

    # Split into 20-second chunks
    chunk_length = 20000  # 20 seconds in milliseconds
    chunks = []

    for i in range(0, len(audio), chunk_length):
        chunk = audio[i:i + chunk_length]
        chunks.append(chunk)

    print(f"Audio split into {len(chunks)} chunks\n")

    full_transcript = []

    for idx, chunk in enumerate(chunks):
        print(f"Processing chunk {idx + 1}/{len(chunks)}...")

        # Export chunk to temporary file
        chunk.export("temp_chunk.wav", format="wav")

        # Transcribe chunk
        with sr.AudioFile("temp_chunk.wav") as source:
            audio_data = recognizer.record(source)

        try:
            text = recognizer.recognize_google(audio_data)
            full_transcript.append(text)
            print(f"  ✓ {text}\n")
        except sr.UnknownValueError:
            print(f"  ✗ Could not understand audio in chunk {idx + 1}\n")
        except sr.RequestError as e:
            print(f"  ✗ API Error: {e}\n")

    print("=" * 60)
    print("Full Transcription:")
    print("=" * 60)
    full_text = " ".join(full_transcript)
    print(full_text)
    print("=" * 60)

    # Clean up
    if os.path.exists("temp_chunk.wav"):
        os.remove("temp_chunk.wav")

except Exception as e:
    print(f"Error: {e}")
