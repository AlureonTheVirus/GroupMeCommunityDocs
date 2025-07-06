---
title: Example Projects
description: A collection of example projects that utilize the GroupMe Community API.
---

# Example Projects

The GroupMe API allows for two primary methods of creating bots: **Webhook Bots** and **User Bots**. Each has distinct advantages and is suited for different tasks. Understanding their differences is key to building your project.

## Webhook Bots vs. User Bots

### Webhook Bots (Callback/Webhook Bots)

Webhook Bots are the most common and straightforward type. They function like a web server, passively listening for events.

-   **How they work:** You provide GroupMe with a **Callback URL**. When a message is posted in a group where your bot is present, GroupMe sends an HTTP POST request to that URL containing the message data.
-   **Identity:** They are distinct entities with their own name and avatar, created through the [Bot Creation Form](https://dev.groupme.com/bots/new).
-   **Authentication:** They use a `bot_id` to post messages.
-   **Scope:** They are "blind" by default and can only see messages in the specific groups they have been added to.
-   **Best for:** Simple, event-driven tasks within a single group, like responding to commands, posting daily updates, or running games.

### User Bots (Push/WebSocket Bots)

User Bots are more powerful and complex. They act on behalf of a real user account, subscribing to a real-time stream of events. By their nature they can do nearly everything a regular user can do (with some exceptions), but they are more complex to set up and manage.

-   **How they work:** Instead of waiting for a callback, they open a persistent **WebSocket connection** to GroupMe's Push Service. This gives them a real-time firehose of all activity visible to the user account they are linked to.
-   **Identity:** They act *as a user*. They post messages and perform actions under that user's name and do not have their own separate bot identity.
-   **Authentication:** They use a user's personal `access_token`.
-   **Scope:** They can see everything the associated user can see—all group chats, direct messages, and events like users joining/leaving.
-   **Best for:** Advanced applications that require monitoring activity across multiple groups, managing chats, or providing real-time logging or cross-group functionality.

## Our Examples

Here are some example projects to help you get started.

<div class="grid cards" markdown>

  - :ping_pong: [PingPong Bot](pingpong.md) – A simple bot that replies "pong" when you say "ping". (getting started with callbacks and attachments)
  - :t_rex: [DinoBot](dinobot.md) – A bot that responds to messages in a GroupMe group by sending dinosaur emojis. (emoji system demo)

</div>