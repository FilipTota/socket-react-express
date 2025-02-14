import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io.connect(`${import.meta.env.VITE_BACKEND_URL}`);

function App() {
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    });
  }, [socket]);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = () => {
    socket.emit("send_message", { message, room }); // "send_messwage" -> event name, second parametes is the data we want to send to socket on backend
    setMessage("");
  };
  return (
    <div className="app">
      <div className="join-room">
        <input
          type="text"
          placeholder="Room number..."
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={joinRoom}>Join</button>
      </div>
      <input
        type="text"
        placeholder="Message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <h1>Message:</h1>
      {messageReceived}
    </div>
  );
}

export default App;
