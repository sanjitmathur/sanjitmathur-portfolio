import cv2
import numpy as np
import os

def extract_airplane_frames(
    video_path=os.path.join("media", "source-videos", "Airplane_flying_across_dark_sky_202609081202.mp4"),
    output_dir=os.path.join("artifacts", "portfolio", "public", "airplane-frames"),
    target_width=1280,
    target_height=720,
    total_frames=120,
    quality=82
):
    os.makedirs(output_dir, exist_ok=True)
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise RuntimeError(f"Could not open video file {video_path}")
    
    orig_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    orig_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_video_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Airplane video opened: {orig_w}x{orig_h}, {total_video_frames} frames")
    
    # Read frame 1 for lead-in
    cap.set(cv2.CAP_PROP_POS_FRAMES, 1)
    ret1, frame1 = cap.read()
    if not ret1:
        raise RuntimeError("Failed to read frame 1")
    
    # Read frame 239 for lead-out
    cap.set(cv2.CAP_PROP_POS_FRAMES, min(239, total_video_frames - 1))
    ret_end, frame_end = cap.read()
    if not ret_end:
        raise RuntimeError("Failed to read ending frame")

    lead_in = 6
    lead_out = 8
    mid_count = total_frames - lead_in - lead_out

    frames_written = 0

    # 1. Lead-in frames (plane entering from off-screen left)
    for i in range(lead_in):
        shift_x = int(-450 + i * (450 / lead_in))
        M = np.float32([[1, 0, shift_x], [0, 1, 0]])
        shifted = cv2.warpAffine(frame1, M, (orig_w, orig_h), borderValue=(0, 0, 0))
        resized = cv2.resize(shifted, (target_width, target_height), interpolation=cv2.INTER_AREA)
        out_path = os.path.join(output_dir, f"frame_{frames_written:03d}.webp")
        cv2.imwrite(out_path, resized, [cv2.IMWRITE_WEBP_QUALITY, quality])
        frames_written += 1

    # 2. Main video frames
    for k in range(mid_count):
        v_idx = int(round(1 + (k / (mid_count - 1)) * 237))
        cap.set(cv2.CAP_PROP_POS_FRAMES, v_idx)
        ret, frame = cap.read()
        if not ret:
            frame = frame_end
        resized = cv2.resize(frame, (target_width, target_height), interpolation=cv2.INTER_AREA)
        out_path = os.path.join(output_dir, f"frame_{frames_written:03d}.webp")
        cv2.imwrite(out_path, resized, [cv2.IMWRITE_WEBP_QUALITY, quality])
        frames_written += 1

    # 3. Lead-out frames (plane gliding off-screen right)
    for j in range(lead_out):
        shift_x = int((j + 1) * (500 / lead_out))
        M = np.float32([[1, 0, shift_x], [0, 1, 0]])
        shifted = cv2.warpAffine(frame_end, M, (orig_w, orig_h), borderValue=(0, 0, 0))
        resized = cv2.resize(shifted, (target_width, target_height), interpolation=cv2.INTER_AREA)
        out_path = os.path.join(output_dir, f"frame_{frames_written:03d}.webp")
        cv2.imwrite(out_path, resized, [cv2.IMWRITE_WEBP_QUALITY, quality])
        frames_written += 1

    cap.release()
    print(f"Successfully generated {frames_written} frames in {output_dir}")

if __name__ == "__main__":
    extract_airplane_frames()
