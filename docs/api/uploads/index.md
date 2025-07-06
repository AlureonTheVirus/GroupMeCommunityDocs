---
title: CDN management
description: Guide to managing the CDN for the GroupMe Community API documentation.
---

# Uploading Media

GroupMe provides its own Content Delivery Network (CDN) to host images, videos, and other files that can be attached to messages. To send a message with a media attachment, you must first upload the file to the appropriate GroupMe service. This process will return a URL on the GroupMe CDN that you can then use in your API calls.

This is a two-step process:

1.  **Upload:** Send your media file to the correct upload service.
2.  **Attach:** Use the URL returned in Step 1 to create a message with an `image`, `video`, or `file` attachment.

## Upload Services

Each type of media has a specific endpoint and set of requirements.

<div class="grid cards" markdown>

-   **🖼️ [Images](images.md)**
    
    Learn how to upload images to the GroupMe image service to get a `picture_url` that can be included in messages. This section covers accepted formats, size limits, and the full API workflow.

-   **🎬 [Videos](video.md)**
    
    This guide details the process for uploading video files. It covers supported video formats, resolution and size constraints, and how to get a shareable URL for use in a `video` attachment.

-   **📎 [Files](files.md)**

    For other content like documents or generic file types, use the file attachment service. This section explains how to upload arbitrary files and attach them to messages.

</div>