import { useEffect } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io.connect(`${import.meta.env.VITE_BACKEND_URL}`);

function App() {
  useEffect(() => {
    socket.on("receive_message", (data) => {
      alert(data.message);
    });
  }, [socket]);

  const sendMessage = () => {
    socket.emit("send_message", { message: "Hello" }); // "send_message" -> event name, second parametes is the data we want to send to socket on backend
  };
  return (
    <div className="app">
      <input type="text" placeholder="Message..." />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
