export async function getExistingShapes(roomId: string) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3001/api/chat/all-chats/${roomId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token ?? " ",
          },
        }
      );
      if (!res.ok) {
        throw new Error("failed to fetch ");
      }
  
      const data = await res.json();
      const messages = data.chats?.chats ?? [];
      const shapes = messages
        .map((x: { message: string }) => {
          try {
            const messageData = JSON.parse(x.message);
            return messageData.shape;
          } catch (error) {
            console.warn("Invalid JSON message", x.message);
            return null;
          }
        })
        .filter(Boolean); // removes null
      return shapes;
    } catch (error) {
      console.error("Error fetching data", error);
      return [];
    }
  }
  

