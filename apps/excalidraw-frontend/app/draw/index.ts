// import { Slabo_13px } from "next/font/google";

// type Shapes =
//   | {
//       type: "rect";
//       x: number;
//       y: number;
//       width: number;
//       height: number;
//     }
//   | {
//       type: "circle";
//       centerX: number;
//       centerY: number;
//       radius: number;
//     };
// export async function initDraw(
//   roomId: string,
//   canvas: HTMLCanvasElement,
//   socket: WebSocket
// ) {
//   const ctx = canvas.getContext("2d");

//   let existingShapes: Shapes[] = await getExistingShapes(roomId);

//   if (!ctx) {
//     return;
//   }
//   socket.onmessage = (event) => {
//     const parsedData = JSON.parse(event.data);
//     console.log(parsedData, parsedData.type);
//     if (parsedData.type === "chat") {
//       const shape = JSON.parse(parsedData.message);
//       existingShapes.push(shape.shape);
//       clearAndDrawCanvas(existingShapes, canvas, ctx);
//     }
//   };

//   clearAndDrawCanvas(existingShapes, canvas, ctx);
//   let click = false;
//   let startX = 0;
//   let startY = 0;

//   canvas.addEventListener("mousedown", (e) => {
//     click = true;
//     startX = e.clientX;
//     startY = e.clientY;
//   });

//   canvas.addEventListener("mouseup", (e) => {
//     click = false;
//     const width = e.clientX - startX;
//     const height = e.clientY - startY;
//     //@ts-ignore
//     const selectedIcon = window.selectedIcon;
//     let shape: Shapes | null = null;
//     if (selectedIcon === "rect") {
//       shape = {
//         type: "rect",
//         x: startX,
//         y: startY,
//         height,
//         width,
//       };
//     } else if (selectedIcon === "circle") {
//       shape = {
//         type: "circle",
//         radius: Math.abs(Math.max(width, height) / 2),

//         centerX: startX + width / 2,
//         centerY: startY + height / 2,
//       };
//     }
//     if (!shape) return;
//     existingShapes.push(shape);

//     socket.send(
//       JSON.stringify({
//         type: "chat",
//         message: JSON.stringify({ shape }),
//         roomId,
//       })
//     );
//   });

//   canvas.addEventListener("mousemove", (e) => {
//     if (click) {
//       //@ts-ignore
//       const selectedIcon = window.selectedIcon;
//       const width = e.clientX - startX;
//       const height = e.clientY - startY;
//       clearAndDrawCanvas(existingShapes, canvas, ctx);
//       ctx.strokeStyle = "rgba(255,255,255)";
//       if (selectedIcon === "rect") {
//         ctx.strokeRect(startX, startY, width, height);
//       } else if (selectedIcon === "circle") {
//         const radius = Math.abs(Math.max(width, height) / 2);
//         const centerX = startX + width/2
//         const centerY = startY + height/2
//         ctx.beginPath();
//         ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
//         ctx.stroke();
//         ctx.closePath();
//       }
//     }
//   });
// }

// function clearAndDrawCanvas(
//   existingShapes: Shapes[],
//   canvas: HTMLCanvasElement,
//   ctx: CanvasRenderingContext2D
// ) {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.fillStyle = "rgba(0,0,0)";
//   ctx.fillRect(0, 0, canvas.width, canvas.height);

//   existingShapes.map((shape) => {
//     if (shape.type == "rect") {
//       ctx.strokeStyle = "rgba(255,255,255)";
//       ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
//     } else if (shape.type === "circle") {
//       ctx.beginPath();
//       ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
//       ctx.stroke();
//       ctx.closePath();
//     }
//   });
// }

// async function getExistingShapes(roomId: string) {
//   try {
//     const token = localStorage.getItem("token");
//     const res = await fetch(
//       `http://localhost:3001/api/chat/all-chats/${roomId}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           token: token ?? " ",
//         },
//       }
//     );
//     if (!res.ok) {
//       throw new Error("failed to fetch ");
//     }

//     const data = await res.json();
//     const messages = data.chats?.chats ?? [];
//     const shapes = messages
//       .map((x: { message: string }) => {
//         try {
//           const messageData = JSON.parse(x.message);
//           return messageData.shape;
//         } catch (error) {
//           console.warn("Invalid JSON message", x.message);
//           return null;
//         }
//       })
//       .filter(Boolean); // removes null
//     return shapes;
//   } catch (error) {
//     console.error("Error fetching data", error);
//     return [];
//   }
// }


