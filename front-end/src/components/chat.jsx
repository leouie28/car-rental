import { SendHorizonal } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import socket from '../socket';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to server")
    })

    socket.on('chat message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = () => {
    if (!msgInput.trim()) return;

    socket.emit('chat message', msgInput);
    setMsgInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="p-4 max-w-md mx-auto border rounded shadow">
      <h2 className="text-lg font-bold mb-2">🗨️ Chat</h2>
      <div className="h-64 overflow-y-auto border p-2 mb-2 bg-gray-50 rounded">
        {messages.map((msg, i) => (
          <div key={i} className="text-sm py-1">{msg}</div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          value={msgInput}
          onChange={(e) => setMsgInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send
          <SendHorizonal />
        </button>
      </div>
    </div>
  );
};

export default Chat;