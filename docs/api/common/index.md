---
title: Common API Structures
description: An overview of common data structures used across the GroupMe API, such as attachments, events, and emoji.
---

# Common API Structures

While the GroupMe API has many endpoints for interacting with groups, direct messages, and users, several common data structures appear consistently across all of them. Understanding these core structures is essential for building rich, interactive applications.

Messages are the lifeblood of the API, and they often contain more than just simple text. They can carry special objects that represent rich media, describe system-level occurrences, or encode custom emoji. This section provides detailed documentation on these fundamental building blocks.

<div class="grid cards" markdown>

-   **:material-attachment-plus: [Message Attachments](attachments.md)**
    
    Learn how to add rich content to your messages. This guide covers all known attachment types, from images and videos to replies, mentions, and locations.

-   **:material-flag-triangle: [Message Events](events.md)**
    
    Discover the system-generated events that report on changes within a chat, such as members joining, the group name changing, or a message being pinned.

-   **:fontawesome-solid-face-smile-wink: [Emoji (GroupMe PowerUps)](emoji.md)**
    
    Dive into GroupMe's custom emoji system. This document explains the `charmap` structure and how to parse and send messages with "PowerUp" emoji.

</div>