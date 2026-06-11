import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export function connect() {
    const socket = new SockJS('http://localhost:8080/ws')
    const stompClient = Stomp.over(socket)
    
    stompClient.connect({ currentUserID }, (frame) => {
        currentUserID = currentUserID
        console.log("Connected to socket: " + frame)

        stompClient.subscribe(`user/${currentUserID}/private`, (response) => {
            const message = JSON.parse(response.body)
            displayIncomingMessage(message.senderName, message.message)
        })
    }, (error) => {
        console.error("Socket connection error: ", error)
    })
}

export function sendPrivateMessage(textMessage, currentUserID, targetUserID) {
    const payload = {
        senderName: currentUserID,
        receiverName: targetUserID,
        message: textMessage
    }


}