"use client";
import { useEffect, useRef, useState } from "react";
import Topbar from "./Topbar";
import { Game } from "@/app/draw/Game";

export type Shape = "rect" | "circle" | "pencil";

const Canvas = ({ roomId, socket }: { roomId: string; socket: WebSocket }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game , setGame] = useState<Game>()
  const [selectedIcon, setSelectedIcon] = useState<Shape>("rect");

  useEffect(() => {
    game?.setIcon(selectedIcon)
  }, [selectedIcon , game]);

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(canvasRef.current ,roomId, socket);
      setGame(g)

      return ()=>{
        g.destroy()
      }
    }
  }, [canvasRef]);
  return (
    <div>
      <div className="h-screen overflow-hidden">
        <canvas ref={canvasRef} height={1000} width={2000}></canvas>
        <Topbar selectedIcon={selectedIcon} setSelectedIcon={setSelectedIcon} />
      </div>
    </div>
  );
};

export default Canvas;
