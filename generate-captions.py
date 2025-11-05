#!/usr/bin/env python3
"""
Generate captions for videos using OpenAI Whisper API
Outputs captions to captionData.js
"""

import os
import json
import subprocess
from pathlib import Path

# Get OpenAI API key from environment
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    print("Error: OPENAI_API_KEY environment variable not set")
    print("Set it with: $env:OPENAI_API_KEY='your-api-key'")
    exit(1)

# Video metadata
VIDEO_MAPPING = {
    1: "Cole - Elixir.mp4",
    2: "Cole Hammer Swing_2.mp4",
    3: "Protein Powder.mp4",
    4: "Sang Vampire.mp4",
    5: "Raver Girl Bath Blood.mp4",
    6: "Mel Conspiracy Rant.mp4",
    7: "Mel Wonder Tour Colored.mp4",
    8: "Lord Brayn Rumors.mp4",
    9: "Flem Diagram.mp4",
    10: "Flem Vials-.mp4"
}

videos_dir = Path(__file__).parent / 'public' / 'videos'

print("\n" + "=" * 60)
print("Caption Generation using OpenAI Whisper API")
print("=" * 60 + "\n")

captions_data = []

for video_id, filename in VIDEO_MAPPING.items():
    filepath = videos_dir / filename

    if not filepath.exists():
        print(f"[{video_id}] ⚠️  {filename} - File not found, skipping")
        continue

    print(f"[{video_id}] Processing: {filename}...")

    try:
        # Call OpenAI Whisper API via subprocess using curl
        # Alternatively, use openai package if installed
        import openai
        openai.api_key = OPENAI_API_KEY

        with open(filepath, "rb") as audio_file:
            transcript = openai.Audio.transcribe(
                model="whisper-1",
                file=audio_file,
                response_format="verbose_json"
            )

        # Extract captions with timestamps
        captions = []
        if "segments" in transcript:
            for segment in transcript["segments"]:
                captions.append({
                    "text": segment["text"].strip(),
                    "startTime": round(segment["start"], 2),
                    "endTime": round(segment["end"], 2)
                })
        else:
            # Fallback if no segments
            captions.append({
                "text": transcript.get("text", ""),
                "startTime": 0,
                "endTime": transcript.get("duration", 0)
            })

        captions_data.append({
            "videoId": video_id,
            "captions": captions
        })

        print(f"    ✓ Generated {len(captions)} captions")

    except Exception as e:
        print(f"    ✗ Error: {str(e)}")
        continue

print("\n" + "=" * 60)
print(f"Generated captions for {len(captions_data)}/{len(VIDEO_MAPPING)} videos")
print("=" * 60 + "\n")

# Write to JavaScript file
output_file = Path(__file__).parent / 'src' / 'data' / 'captionData.js'

js_content = "export const captionData = " + json.dumps(captions_data, indent=2) + ";"

with open(output_file, 'w') as f:
    f.write(js_content)

print(f"✓ Captions saved to: src/data/captionData.js\n")
