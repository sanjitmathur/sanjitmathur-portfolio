import cv2
import os
import glob

def extract_lab_frames(
    output_dir=os.path.join("artifacts", "portfolio", "public", "lab-frames"),
    target_width=960,
    target_height=540,
    total_frames=80,
    quality=80
):
    os.makedirs(output_dir, exist_ok=True)

    # Search for source video in media/source-videos or root
    video_candidates = [
        os.path.join("media", "source-videos", "lab_of_future.mp4"),
    ]
    video_candidates.extend(glob.glob("*Laptop*"))
    video_candidates.extend(glob.glob(os.path.join("media", "source-videos", "*Laptop*")))

    video_path = None
    for cand in video_candidates:
        if os.path.exists(cand):
            video_path = os.path.abspath(cand)
            break

    if not video_path:
        raise RuntimeError("Could not find Lab of Future source video")

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise RuntimeError(f"Could not open video file at {video_path}")

    total_video_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Lab video opened: {total_video_frames} frames -> extracting {total_frames} frames to {output_dir}")

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
    extract_lab_frames()
