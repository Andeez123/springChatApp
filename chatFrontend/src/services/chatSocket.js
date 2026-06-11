import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = import.meta.env.VITE_WS_URL ?? 'http://localhost:8080/ws';

export function createChatClient({ onPublicMessage, onPrivateMessage, onConnect, onError }) {
  const client = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 5000,
    onConnect: () => {
      client.subscribe('/chatroom/public', (frame) => {
        onPublicMessage(JSON.parse(frame.body));
      });

      client.subscribe('/user/private', (frame) => {
        onPrivateMessage(JSON.parse(frame.body));
      });

      onConnect?.(client);
    },
    onStompError: (frame) => {
      onError?.(frame.headers['message'] ?? 'STOMP error');
    },
  });

  client.activate();
  return client;
}

function buildMessage({ senderName, receiverName, message, status }) {
  return JSON.stringify({
    senderName,
    receiverName: receiverName ?? '',
    message: message ?? '',
    date: new Date().toLocaleString(),
    status,
  });
}

export function sendPublicMessage(client, senderName, message, status = 'MESSAGE') {
  client.publish({
    destination: '/app/message',
    body: buildMessage({ senderName, message, status }),
  });
}

export function sendPrivateMessage(client, senderName, receiverName, message) {
  client.publish({
    destination: '/app/private-message',
    body: buildMessage({
      senderName,
      receiverName,
      message,
      status: 'MESSAGE',
    }),
  });
}

export function joinChat(client, username) {
  sendPublicMessage(client, username, `${username} joined the chat`, 'JOIN');
}

export function leaveChat(client, username) {
  sendPublicMessage(client, username, `${username} left the chat`, 'LEAVE');
}