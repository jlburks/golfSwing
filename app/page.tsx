"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const video1 = "/user1Swing.mp4";
  const video2 = "/user1Gus17-4.mp4";
  const video3 = "/user1Gus14-2.mp4";

  const videos = [video1, video2, video3];

  const [lines, setLines] = useState([
    { id: 1, x1: 50, y1: 0, x2: 50, y2: 100, color: "lime" },
    { id: 2, x1: 15, y1: 80, x2: 85, y2: 80, color: "yellow" },
    { id: 3, x1: 30, y1: 90, x2: 70, y2: 20, color: "red" },
  ]);

  const [dragging, setDragging] = useState(null);

  function movePoint(e) {
    if (!dragging) return;

    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setLines((prev) =>
      prev.map((line) =>
        line.id === dragging.id
          ? {
              ...line,
              [dragging.pointX]: x,
              [dragging.pointY]: y,
            }
          : line
      )
    );
  }

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
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                onPointerMove={movePoint}
                onPointerUp={() => setDragging(null)}
                onPointerLeave={() => setDragging(null)}
                style={{ pointerEvents: "none" }}
              >
                {lines.map((line) => (
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