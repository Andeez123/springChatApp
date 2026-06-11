import { useEffect, useRef, useState } from 'react';
import {
    createChatClient,
    joinChat,
    leaveChat,
    sendPublicMessage,
    sendPrivateMessage,
} from '../services/chatSocket';

export default function ChatRoom() {
    const [username, setUsername] = useState('');
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [privateTo, setPrivateTo] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const clientRef = useRef(null);

    const addMessage = (msg) => setMessages((prev) => [...prev, msg]);

    const connect = () => {
        if (!username.trim()) return;

        const client = createChatClient({
            onPublicMessage: addMessage,
            onPrivateMessage: (msg) =>
                addMessage({ ...msg, message: `[Private] ${msg.message}` }),
            onConnect: (c) => {
                joinChat(c, username.trim());
                setConnected(true);
            },
            onError: (err) => console.error('WebSocket error:', err),
        });

        clientRef.current = client;
    };

    useEffect(() => {
        return () => {
            if (clientRef.current?.connected) {
                leaveChat(clientRef.current, username);
                clientRef.current.deactivate();
            }
        };
    }, [username]);

    const handleSend = (e) => {
        e.preventDefault();
        const text = input.trim();
        const client = clientRef.current;
        if (!text || !client?.connected) return;

        if (isPrivate && privateTo.trim()) {
            sendPrivateMessage(client, username, privateTo.trim(), text);
        } else {
            sendPublicMessage(client, username, text);
        }

        setInput('');
    };

    if (!connected) {
        return (
            <div>
                <h1>Join Chat</h1>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button type="button" onClick={connect}>Connect</button>
            </div>
        );
    }

    return (
        <div>
            <h2>Welcome, {username}</h2>

            <ul>
                {messages.map((msg, i) => (
                    <li key={i}>
                        {msg.status === 'JOIN' && <em>{msg.message}</em>}
                        {msg.status === 'LEAVE' && <em>{msg.message}</em>}
                        {msg.status === 'MESSAGE' && (
                            <>
                                <strong>{msg.senderName}</strong>
                                {msg.receiverName && ` → ${msg.receiverName}`}: {msg.message}
                                <small> ({msg.date})</small>
                            </>
                        )}
                    </li>
                ))}
            </ul>

            <form onSubmit={handleSend}>
                <label>
                    <input
                        type="checkbox"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                    />
                    Private message
                </label>
                {isPrivate && (
                    <input
                        placeholder="Send to..."
                        value={privateTo}
                        onChange={(e) => setPrivateTo(e.target.value)}
                    />
                )}
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}