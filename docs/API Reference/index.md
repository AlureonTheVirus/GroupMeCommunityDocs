---
title: "API Overview"
description: "Learn how to interact with GroupMe via the API."
---

# API Overview

GroupMe has a thriving developer community which has created a variety of applications, bots, and tools. However, while the platform has constantly matured, the public documentation has not. In an effort to help other developers understand and utilize the platform better, this is a community-led effort to document everything possible. If you discover something not listed here, or you find an error in what is listed, please bring it up on the discussion page or submit a pull request.

Much of this information is pulled from [dev.groupme.com](https://dev.groupme.com/), which is the official GroupMe developers site. However, most of its information is outdated or incomplete, so please help keep this repo up-to-date.

If you have any questions or would like to get in touch, please join the [GroupMe API Development Group](https://groupme.com/join_group/27317261/ibNNhx) or open an issue.

**This documentation is not associated with GroupMe or Microsoft**

## Quick Links:

<div class="grid cards" markdown>

- :material-robot-excited: __[Webhook Bots]__ – How to create, index, and use bots
- :octicons-arrow-switch-16: __[Websocket Gateway]__ – How to connect to the Push service to get real-time interaction with your program
- :material-account-group: __[Group Management]__ – How to create, join, list, update, etc. groups
- :material-account-group: __[Subgroup Management]__ – How to work with subgroups within a parent group
- :fontawesome-solid-users-gear: __[Member management]__ – How to add, remove, and update members in a group
- :material-message: __[Group Messages]__ – How to list and send messages in groups
- :material-calendar: __[Calendar Events]__ – How to list, create, and edit calendar events in a group
- :material-poll: __[Polls]__ – Information on how to make and view polls
- :material-message-badge: __[Message Events]__ – How to parse system message events
- :octicons-search-16: __[Directory Management]__ – How to list, search, and join public and campus group directories
- :material-message: __[Direct Messages]__ – How to list, read, and send DMs, as well as how to block/unblock users
- :material-contacts: __[Users/Contact Management]__ – How to create, destroy, and manage contacts; as well as fetch info on other users outside of groups
- :material-attachment-plus: __[Attachments]__ – Information on how message attachments work, as well as how to upload images to be sent as attachments
- :fontawesome-solid-face-smile-wink: __[Reactions]__ – How to react to messages, and how to see your reactions and the likes leaderboard in groups
- :material-pin: __[Pins]__ – How to use GroupMe's message pinning functionality
- :fontawesome-solid-face-smile-wink: __[Emoji]__ – How GroupMe's custom emoji system works, as well as how to display and send emoji
- :material-video: __[Videos]__ – Information on how to upload videos to be sent as attachments
- :material-image: __[Image Service]__ – How to upload Images to GroupMe's CDN
- :material-account-cog: __[Account Management]__ – How to access/update information about your account, turning on/off SMS mode, and configuring profile details
- :material-cellphone-key: __[Oauth/MFA]__ – How to manage API tokens and handle multi-factor authentication with GroupMe

</div>

  [Group Management]: groups.md
  [Subgroup Management]: subgroups.md
  [Member management]: members.md
  [Group Messages]: messages.md
  [Direct Messages]: dms.md
  [Reactions]: reactions.md
  [Calendar Events]: calendar.md
  [Directory Management]: directories.md
  [Users/Contact Management]: contacts.md
  [Webhook Bots]: bots.md
  [Account Management]: self.md
  [Attachments]: attachments.md
  [Videos]: video.md
  [Polls]: polls.md
  [Websocket Gateway]: websocket.md
  [Emoji]: emoji.md
  [Pins]: pins.md
  [Oauth/MFA]: oauth.md
  [Image Service]: images.md
  [Message Events]: events.md

***

## Contributing

The GroupMe Community Docs are constantly evolving and updating! Check out the [Contributing Checklist](https://github.com/groupme-js/GroupMeCommunityDocs/issues/32) for insights on what documentation we're still in need of for full API coverage. 
