#!/usr/bin/env python3
"""
Transcribe audio file using Google Speech Recognition API
"""

import speech_recognition as sr
from pydub import AudioSegment
from pydub.utils import mediainfo
import os

# Load the audio file
audio_file = "Cole_Hammer_audio.wav"

if not os.path.exists(audio_file):
    print(f"Error: {audio_file} not found")
    exit(1)

print(f"\nTranscribing {audio_file}...")
print("=" * 60)

recognizer = sr.Recognizer()

try:
    # Load audio file
    with sr.AudioFile(audio_file) as source:
        audio_data = recognizer.record(source)

    print("Sending to Google Speech Recognition API...")

    # Use Google Speech Recognition (free tier)
    text = recognizer.recognize_google(audio_data)

    print(f"\nTranscription:\n{text}\n")
    print("=" * 60)

except sr.UnknownValueError:
    print("Could not understand audio")
except sr.RequestError as e:
    print(f"API Error: {e}")
except Exception as e:
    print(f"Error: {e}")
