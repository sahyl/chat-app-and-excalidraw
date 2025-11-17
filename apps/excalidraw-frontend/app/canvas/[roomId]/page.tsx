"use client";
import { useWebSocket } from "@/app/hooks/useWebSocket";
import Canvas from "@/components/Canvas";
import { useParams } from "next/navigation";

const RoomCanvas =  () => {
  const { roomId } = useParams<{ roomId: string }>();
  const socket = useWebSocket('ws://localhost:8080', roomId)


  if(!socket){
    return (
        <div className="flex h-screen justify-center items-center text-gray-500">
          Connecting to server ...
        </div>
      );

  }

 

  return (
    <Canvas socket={socket} roomId={roomId}/>
  );
};

export default RoomCanvas;
