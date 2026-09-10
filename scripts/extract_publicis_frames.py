import cv2
import os

def extract_publicis_frames(
    video_dir=os.path.join("media", "source-videos"),
    output_dir=os.path.join("artifacts", "portfolio", "public", "publicis-frames"),
    target_width=960,
    target_height=540,
    total_frames=80,
    quality=82
):
    os.makedirs(output_dir, exist_ok=True)
    
    video_file = os.path.join(video_dir, "publicis_new.mp4")
    if not os.path.exists(video_file):
        video_file = os.path.join(video_dir, "Publicis (2).mp4")
    if not os.path.exists(video_file):
        for f in os.listdir(video_dir):
            if f.lower().startswith("publicis") and f.endswith(".mp4"):
                video_file = os.path.join(video_dir, f)
                break
            
    if not video_file or not os.path.exists(video_file):
        raise RuntimeError(f"Could not find Publicis video in {video_dir}")

    cap = cv2.VideoCapture(video_file)
    if not cap.isOpened():
        raise RuntimeError(f"Could not open video file {video_file}")
    
    total_video_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Publicis video opened: {total_video_frames} frames -> extracting {total_frames} frames")

    for i in range(total_frames):
        frame_idx = int(round(i * (total_video_frames - 1) / (total_frames - 1)))
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
        ret, frame = cap.read()
        if not ret:
            print(f"Warning: Failed to read frame {frame_idx}")
            continue

        resized = cv2.resize(frame, (target_width, target_height), interpolation=cv2.INTER_AREA)
        out_path = os.path.join(output_dir, f"frame_{i:03d}.webp")
        cv2.imwrite(out_path, resized, [cv2.IMWRITE_WEBP_QUALITY, quality])

    cap.release()
    print(f"Successfully extracted {total_frames} frames into {output_dir}")

if __name__ == "__main__":
    extract_publicis_frames()
