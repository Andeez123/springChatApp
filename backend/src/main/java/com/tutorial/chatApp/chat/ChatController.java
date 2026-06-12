package com.tutorial.chatApp.chat;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message") // /app/message
    @SendTo("/chatroom/public") // topic where message is sent
    public ChatMessage receivePublicMessage(@Payload ChatMessage message){
        return message;
    }

    @MessageMapping("/private-message") // /app/private-message
    public void receivePrivateMessage(@Payload ChatMessage message){
        simpMessagingTemplate.convertAndSend("/private/" + message.getReceiverName(), message);
    }

}
