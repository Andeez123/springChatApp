package com.tutorial.chatApp.chat;


import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    // add user: when a new user connects to the chat app, hits this endpoint


    // send message: dispatch message by user
    /* each time the method receives messages on this endpoint, the message is sent to
    * the specified topic*/
    @MessageMapping("/chat.sendMessage") //url for this method
    @SendTo("/topic/public")  //send to which topic/queue
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage){
        return chatMessage;
    }

    @MessageMapping("/chat.addUser") //url for this method
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor){
        //establish a connection between user and websocket

        // adds username to web socket session
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        return chatMessage;
    }
}
