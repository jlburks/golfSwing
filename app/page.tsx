"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const videos = ["/user1Swing.mp4", "/user1Gus17-4.mp4", "/user1Gus14-2.mp4"];

  // Separate lines for each video (array of lines for each)
  const [videoLines, setVideoLines] = useState(
    videos.map(() => [
      { id: 1, x1: 50, y1: 0, x2: 50, y2: 100, color: "black" },
      { id: 2, x1: 15, y1: 80, x2: 85, y2: 80, color: "yellow" },
      { id: 3, x1: 30, y1: 90, x2: 70, y2: 20, color: "red" },
    ])
  );

  const svgRefs = useRef([]);

  const [dragging, setDragging] = useState(null);

  useEffect(() => {
    function handleMove(e) {
      if (!dragging) return;

      const { videoIndex, pointX, pointY } = dragging;
      const svg = svgRefs.current[videoIndex];
      const rect = svg.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setVideoLines((prev) =>
        prev.map((lines, idx) =>
          idx === videoIndex
            ? lines.map((line) =>
                line.id === dragging.id ? { ...line, [pointX]: x, [pointY]: y } : line
              )
            : lines
        )
      );
    }

    function handleEnd() {
      setDragging(null);
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleEnd);
    window.addEventListener("pointerleave", handleEnd);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleEnd);
      window.removeEventListener("pointerleave", handleEnd);
    };
  }, [dragging]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center p-8">
      <Image
        src="/golfswing.png"
        alt="Golf Analysis"
        width={200}
        height={100}
        priority
      />

      <h1 className="text-3xl font-bold mt-6 mb-8 text-black dark:text-white">
        Swing Analysis
      </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {videos.map((src, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="relative w-[250px] rounded-lg overflow-hidden">
              <video controls className="w-full block">
                <source src={src} type="video/mp4" />
              </video>

              <svg
                ref={(el) => (svgRefs.current[index] = el)}
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ pointerEvents: "none" }}
              >
                {videoLines[index].map((line) => (
                  <g key={line.id}>
                    <line
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke={line.color}
                      strokeWidth="1"
                    />

                    <circle
                      cx={line.x1}
                      cy={line.y1}
                      r="3"
                      fill={line.color}
                      style={{ pointerEvents: "auto", cursor: "grab" }}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        setDragging({
                          id: line.id,
                          pointX: "x1",
                          pointY: "y1",
                          videoIndex: index,
                        });
                      }}
                    />

                    <circle
                      cx={line.x2}
                      cy={line.y2}
                      r="3"
                      fill={line.color}
                      style={{ pointerEvents: "auto", cursor: "grab" }}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        setDragging({
                          id: line.id,
                          pointX: "x2",
                          pointY: "y2",
                          videoIndex: index,
                        });
                      }}
                    />
                  </g>
                ))}
              </svg>
            </div>

                        <p className="mt-2 text-sm text-zinc-500">
              Video {index + 1}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}