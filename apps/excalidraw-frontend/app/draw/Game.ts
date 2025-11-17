import { Shape } from "@/components/Canvas";
import { getExistingShapes } from "./http";
type Point = { x: number; y: number };
type Shapes =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "pencil";
      points: Point[];
    };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shapes[];
  private roomId: string;
  private SelectedIcon: Shape = "circle";
  socket: WebSocket;
  private clicked: boolean;
  private startX: number;
  private startY: number;
  private pencilX: number;
  private pencilY: number;
  private currentPencilStroke: Point[] | null = null;
  private pencilLineWidth = 2;
  private pencilLineJoin: CanvasLineJoin = "round";
  private pencilLineCap: CanvasLineCap = "round";

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.roomId = roomId;
    this.canvas = canvas;
    this.socket = socket;
    this.clicked = false;
    this.startX = 0;
    this.pencilX = 0;
    this.pencilY = 0;
    this.startY = 0;
    this.existingShapes = [];
    this.ctx = canvas.getContext("2d")!;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  setIcon(Icon: Shape) {
    this.SelectedIcon = Icon;
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.clearAndDrawCanvas();
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.type === "chat") {
        const shape = JSON.parse(parsedData.message);
        this.existingShapes.push(shape.shape);
        this.clearAndDrawCanvas();
      }
    };
  }

  private getCanvasCoordinates(e: MouseEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
      y: (e.clientY - rect.top) * (this.canvas.height / rect.height),
    };
  }

  mouseUpHandler = (e: MouseEvent) => {
    this.clicked = false;

    const coordinates = this.getCanvasCoordinates(e);
    const width = coordinates.x - this.startX;
    const height = coordinates.y - this.startY;
    const selectedIcon = this.SelectedIcon;
    let shape: Shapes | null = null;
    if (selectedIcon === "rect") {
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        height,
        width,
      };
    } else if (selectedIcon === "circle") {
      shape = {
        type: "circle",
        radius: Math.abs(Math.min(width, height) / 2),

        centerX: this.startX + width / 2,
        centerY: this.startY + height / 2,
      };
    } else if (selectedIcon === "pencil") {
      if (this.currentPencilStroke && this.currentPencilStroke.length > 0) {
        shape = {
          type: "pencil",
          points: [...this.currentPencilStroke],
        };
      }
    }
    if (!shape) {
      this.clearAndDrawCanvas();
      return;
    }
    this.existingShapes.push(shape);

    const payload = JSON.stringify({
        type: "chat",
        message: JSON.stringify({ shape }),
        roomId: this.roomId,
      });
      
      console.log("Payload size:", payload.length / 1024, "KB");
      this.socket.send(payload);
    
    this.currentPencilStroke = null;
    this.clearAndDrawCanvas();
    console.log("Shape at mouseUp:", shape);

  };
  mouseDownHandler = (e: MouseEvent) => {
    this.clicked = true;
    const coordinates = this.getCanvasCoordinates(e);
    this.startX = coordinates.x;
    this.startY = coordinates.y;
    // this.pencilX = coordinates.x
    // this.pencilY = coordinates.y

    if (this.SelectedIcon === "pencil") {
      this.currentPencilStroke = [{ x: coordinates.x, y: coordinates.y }];
      this.drawPencilPreview(this.currentPencilStroke);
    }
  };
  mouseMoveHandler = (e: MouseEvent) => {
    if (this.clicked) {
      const coordinates = this.getCanvasCoordinates(e);
      const selectedIcon = this.SelectedIcon;
      const width = coordinates.x - this.startX;
      const height = coordinates.y - this.startY;
      this.clearAndDrawCanvas();
      this.ctx.strokeStyle = "rgba(255,255,255)";
      if (selectedIcon === "rect") {
        this.ctx.strokeRect(this.startX, this.startY, width, height);
      } else if (selectedIcon === "circle") {
        const radius = Math.abs(Math.min(width, height) / 2);
        const centerX = this.startX + width / 2;
        const centerY = this.startY + height / 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (selectedIcon === "pencil") {
        if (!this.currentPencilStroke) {
          this.currentPencilStroke = [{ x: coordinates.x, y: coordinates.y }];
        } else {
          const last =
            this.currentPencilStroke[this.currentPencilStroke.length - 1];
          if (last.x !== coordinates.x && last.y !== coordinates.y) {
            const dx = coordinates.x - last.x;
            const dy = coordinates.y - last.y;

            if (dx * dx + dy * dy > 4) {
              this.currentPencilStroke.push({
                x: coordinates.x,
                y: coordinates.y,
              });
            }
          }
        }
        this.drawPencilPreview(this.currentPencilStroke);
      }
    }
  };
  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);

    if (this.socket) {
      this.socket.onmessage = null;
      this.socket.onopen = null;
      this.socket.onerror = null;
      this.socket.onclose = null;
    }
  }

  drawPencilPreview(points: Point[]) {
    this.clearAndDrawCanvas();
    this.drawPencilStrokes(points);
  }

  clearAndDrawCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(0,0,0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShapes.map((shape) => {
      if (shape.type == "rect") {
        this.ctx.strokeStyle = "rgba(255,255,255)";
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(
          shape.centerX,
          shape.centerY,
          shape.radius,
          0,
          Math.PI * 2
        );
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "pencil") {
        this.drawPencilStrokes(shape.points);
      }
    });
  }

  private drawPencilStrokes(points: Point[]) {
    if (!points || points.length === 0) return;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.lineWidth = this.pencilLineWidth;
    this.ctx.lineCap = this.pencilLineCap;
    this.ctx.lineJoin = this.pencilLineJoin;
    this.ctx.strokeStyle = "rgba(255,255,255)";

    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      this.ctx.lineTo(point.x, point.y);
    }

    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.restore();
  }
}
