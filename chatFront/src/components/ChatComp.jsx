import { useEffect, useRef, useState } from "react"
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { InputText } from 'primereact/inputtext';
import Form from 'react-bootstrap/Form';
import { Button } from 'primereact/button';


const ChatComp = () => {
    const clientRef = useRef(null)
    const [userID, setID] = useState('')
    const [receiver, setReceiver] = useState('')
    const [messages, setMessages] = useState([])
    const [textContent, setTextContent] = useState('')
    const [connected, setConnected] = useState(false)

    useEffect(() => {
        return () => {
            clientRef.current?.deactivate()
        }
    }, [])

    function handleConnect() {
        if (clientRef.current?.active) {
            clientRef.current.deactivate()
        }

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            connectHeaders: { username: userID },
            onConnect: () => {
                setConnected(true)
                client.subscribe(`/private/${userID}`, (response) => {
                    const message = JSON.parse(response.body)
                    setMessages(prev => [...prev, message])
                })
            },
            onStompError: (frame) => {
                console.error("STOMP error:", frame.headers["message"], frame.body)
            },
            onWebSocketError: (event) => {
                console.error("WebSocket error:", event)
            },
        })

        clientRef.current = client
        client.activate()
    }

    function sendPrivateMessage() {
        const payload = {
            senderName: userID,
            receiverName: receiver,
            message: textContent
        }

        clientRef.current.publish({
            destination: "/app/private-message",
            body: JSON.stringify(payload),
        })
        setMessages(prev => [...prev, payload])
        setTextContent('')
    }

    return (
        <div style={{justifyContent: "center"}}>
            <div style={{display: "grid", placeItems: "center", paddingBottom: "10px"}}>
                <h1>Spring chat</h1>
            </div>
            <Form style={{ display: "grid", placeItems: "center", paddingBottom: "10px" }}>
                <Form.Group>
                    <Form.Label>Enter username </Form.Label>
                    <InputText value={userID} onChange={(e) => setID(e.target.value)} />
                </Form.Group>
                <div style={{paddingTop: "10px"}}>
                    <Button label="Submit" type="button" onClick={handleConnect}/>
                </div>
            </Form>

            {userID}

            {connected && (
                <>
                    <div style={{ border: "1px solid #ccc", height: "300px", overflowY: "scroll", padding: "10px" }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{ textAlign: msg.senderName === userID ? "right" : "left" }}>
                                <b>{msg.senderName}: </b>{msg.message}
                            </div>
                        ))}
                    </div>

                    <InputText placeholder="Receiver" value={receiver} onChange={e => setReceiver(e.target.value)} />
                    <InputText placeholder="Message" value={textContent} onChange={e => setTextContent(e.target.value)} />
                    <Button label="Send" onClick={sendPrivateMessage} />
                </>
            )}
        </div>
    )
}

export default ChatComp
