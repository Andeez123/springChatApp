package com.tutorial.chatApp.chat;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class ChatMessage {

    private String senderName;
    private String receiverName;
    private String message;
    private String date;
    private Status status;
}
