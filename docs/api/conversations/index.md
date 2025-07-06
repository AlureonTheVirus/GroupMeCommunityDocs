---
title: Conversation Features
description: Learn about features and endpoints common to both Group and Direct Message conversations.
---

# Conversation Features

While Groups and Direct Messages have distinct management endpoints, they share a rich set of features for interaction within a chat. This section documents the API endpoints that are common to all types of conversations, whether it's a large group or a one-on-one DM.

Here, you'll find information on how to interact with features like message reactions, calendar events, pinned messages, and shared media galleries. These endpoints typically use a generic `:conversation_id` in their path, which can be substituted with either a `group_id` or a DM's `conversation_id`.

<div class="grid cards" markdown>

-   **📅 [Calendar Events](calendar.md)**
    
    Create, view, update, and RSVP to events in any conversation.

-   **🖼️ [Image Gallery](gallery.md)**
    
    Browse the history of images and files shared in a group or DM.

-   **📌 [Pinned Messages](pins.md)**
    
    Programmatically pin and unpin important messages in a conversation.

-   **❤️ [Reactions & Likes](reactions.md)**

    Like, unlike, and react to messages using both the classic like system and the newer emoji reactions.

</div>