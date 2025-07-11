---
title: "Contacts"
description: "Learn how to interact with GroupMe's user relationship system via the API."
---

# Users and Contacts

Unless otherwise stated, endpoints are relative to https://api.groupme.com/v3/ and must include the token of the user making the call - so, for example, if an endpoint is `GET /groups`, the request you make should be using the URL `https://api.groupme.com/v3/groups?token=aSDFghJkl`, where `aSDFghJkl` is replaced with the user's token.

URLs which include a variable, such as `GET /groups/:id`, have their variables marked with a colon. So a request to that endpoint would look like `https://api.groupme.com/v3/groups/1234567?token=aSDFghJkl`, where `1234567` is replaced with the group's ID, and `aSDFghJkl` is replaced with the user's token.

Finally, all responses are wrapped in a response envelope of the following form:

```json linenums="1"
{
  "response": {
    "id": "12345",
    "name": "Family"
    ...
  },
  "meta": {
    "code": 200,
    "errors": []
  }
}
```

If the request succeeds, `meta.errors` will be null, and if the request fails, `response` will be null.

***

## Index User

Returns some basic profile information, like the name, bio, and groups you share with another user.

> [!important]
> This request is relative to `https://v2.groupme.com/`, not `https://api.groupme.com/v3/`.

```json linenums="1" title="HTTP Request"
GET https://v2.groupme.com/users/:user_id
```

**Parameters**

* *include_shared_groups*

    boolean - if `false`, the `shared_groups` property contained in the response will be `null`.

```json linenums="1" title="HTTP Response"
Status: 200 OK
{
  "user": {
    "app_installed": true,
    "avatar_url": "https://i.groupme.com/1067x1067.jpeg.424df7036b634cdda5237b67b613df34",
    "created_at": 1567108132,
    "direct_message_capable": true,
    "id": "74938777",
    "name": "Peter",
    "bio": "api enthusiast",
    "directories": [
      {
        "id": 2738,
        "name": "University of Maryland",
        "short_name": "UMD"
      }
    ],
    "photo_urls": [
      "https://i.groupme.com/2270x4032.jpeg.1e27f1524d854fc6b394b10897ff4035",
      "https://i.groupme.com/1170x2079.jpeg.c2269c395fd8466aa68318620d1418be",
      "https://i.groupme.com/2270x4032.jpeg.dbe59e543a274fcb8f6fc6117f182692",
      "https://i.groupme.com/1112x1975.jpeg.c735b54e2e5f4dfa9ea32ea48f01580b"
    ]
  },
  "relationship": null,
  "shared_groups": [
    {
      "group_id": 27317261,
      "group_name": "Public GroupMe API Development Chat",
      "group_avatar": "https://i.groupme.com/60x60.jpeg.4bf0915fb1944497b3e372f86835eabe"
    },
  ],
  "major_codes": [
    2102
  ],
  "graduation_year": "",
  "campus_profile_visibility": "visible"
}
```

***

## Index Blocks
<!-- official-doc: https://dev.groupme.com/docs/v3#blocks_index -->

A list of contacts you have blocked. These people cannot DM you or add you to groups.

```json linenums="1" title="HTTP Request"
GET /blocks?user=<user>
```

**Parameters**

* *user* (required)

    string - Your user ID

```json linenums="1" title="HTTP Response"
Status: 200 OK
{
  "blocks": [
    {
      "user_id": "1234567890",
      "blocked_user_id": "1234567890",
      "created_at": 1302623328
    }
  ]
}
```

***

## Block Between?
<!-- official-doc: https://dev.groupme.com/docs/v3#blocks_between -->

Asks if a block exists between you and another user id

```json linenums="1" title="HTTP Request"
GET /blocks/between?user=<user>&otherUser=<otherUser>
```

**Parameters**

* *user* (required)
  
    string - Your user ID

* *otherUser* (required)
  
    string - The other user's ID

```json linenums="1" title="HTTP Response"
Status: 200 OK
{
  "between": true
}
```

***

## Block
<!-- official-doc: https://dev.groupme.com/docs/v3#blocks_create -->

Creates a block between you and the contact

```json linenums="1" title="HTTP Request"
POST /blocks?user=<user>&otherUser=<otherUser>
```

**Parameters**

* *user* (required)

	string - your user id.
	
* *otherUser* (required)

	string — user id of person you want to block.
	
```json linenums="1" title="HTTP Response"
Status: 201 Created
{
  "block": {
    "user_id": "1234567890",
    "blocked_user_id": "1234567890",
    "created_at": 1302623328
  }
}
```

***

## Unblock
<!-- official-doc: https://dev.groupme.com/docs/v3#blocks_delete -->

Removes block between you and other user

```json linenums="1" title="HTTP Request"
DELETE /blocks?user=<user>&otherUser=<otherUser>
```

**Parameters**

* *user* (required)

	string - your user id.
	
* *otherUser* (required)

	string — user id of person you want to block.

```json linenums="1" title="HTTP Response"
Status: 200 OK
```

***

## Unblock (Alternative method)
<!-- official-doc: https://dev.groupme.com/docs/v3#blocks_post_delete -->

Removes block between you and other user

```json linenums="1" title="HTTP Request"
POST /blocks/delete?user=<user>&otherUser=<otherUser>
```

**Parameters**

* *user* (required)

	string - your user id.
	
* *otherUser* (required)

	string — user id of person you want to block.

```json linenums="1" title="HTTP Response"
Status: 200 OK
```

## Index Relationships

This endpoint lists all the users in your GroupMe contact book. However, the server—not the client—decides how many results to return in each response. To retrieve the full list of contacts, you’ll need to make repeated requests using the since parameter.

Each response is ordered by creation time. To get the next page of results:

1. Take the created_at_iso8601 timestamp from the last contact in the response.

2. Use that timestamp as the `since` parameter in your next request.

Repeat this process until the response contains an empty list, which means you've reached the end of the contact list.

> [!important]
> This request is relative to `https://api.groupme.com/v4/`, not `https://api.groupme.com/v3/`.

```json linenums="1" title="HTTP Request"
GET https://api.groupme.com/v4/relationships
```

**Parameters**

* *include_blocked*

    boolean - if `false`, users that return `blocked: true` will be omitted from the response.

* *since*

    string - an ISO 8601 timestamp, marking the last contact you've received

```json linenums="1" title="HTTP Response"
Status: 200 OK
[
  {
    "id": "10416580",
    "created_at": 1658526371,
    "created_at_iso8601": "2022-07-22T21:46:11.637999Z",
    "updated_at": 1678148063,
    "updated_at_iso8601": "2023-03-07T00:14:23.125308Z",
    "user_id": "10416580",
    "name": "Bob",
    "avatar_url": "https://i.groupme.com/887x887.jpeg.5db37ecbb4b444f5b87a58406dc3e2b9",
    "reason": 3,
    "hidden": false,
    "app_installed": true,
    "mri": "8:gid:d1299e35-01bc-4d90-b520-e216ab375aa8",
    "blocked": false
  },
  {
    "id": "9822918",
    "created_at": 1658790566,
    "created_at_iso8601": "2022-07-25T23:09:26.874527Z",
    "updated_at": 1678148063,
    "updated_at_iso8601": "2023-03-07T00:14:23.126924Z",
    "user_id": "9822918",
    "name": "Alice",
    "avatar_url": "https://i.groupme.com/492x492.jpeg.47d67a5c7e3b4aa59150fd12aff8a502",
    "reason": 3,
    "hidden": false,
    "app_installed": true,
    "mri": "8:gid:a05385a5-ca5a-4747-b963-2d97aa0f401a",
    "blocked": false
  }
  ...
]
```

***

## Add Relationship

Add a contact given a user ID and their share token. This can be grabbed from the user's share URL, i.e.: `https://groupme.com/contact/:user_id/:share_token`

> [!important]
> This request is relative to `https://api.groupme.com/v4/`, not `https://api.groupme.com/v3/`.

```json linenums="1" title="HTTP Request"
POST https://api.groupme.com/v4/relationships/create
{
  "user_id": "93645911",
  "token": "njLqSwBU"
}
```

**Parameters**

* *user_id*

    string - the user's ID

* *token*

    string - the share token of the user you're adding as a contact. This is extracted from that user's share URL.

```json linenums="1" title="HTTP Response"
Status: 201 Created
{}
```

***

## Import Relationship From Contact

Imports a list of phone contacts into the user's GroupMe relationships. Returns a batch ID, so that you can fetch the results of the import as they could take some time to process.

!!! warning "Breaking Change: Device Verification"

    This endpoint now requires platform-level device verification (e.g., Apple App Attest or Google Play Integrity). Requests must include valid attestation headers (`X-verify-token`), or they will be rejected.

    This change was introduced by GroupMe to mitigate automated abuse. Unfortunately, it also blocks all third-party clients, including many valuable community projects. As such, this endpoint is no longer accessible to third-party applications and is retained here for historical reference only.

```json linenums="1" title="HTTP Request"
POST /relationships/import_contacts
[
  {
    "name": "Bob",
    "guid": "7FC59EDB-A35D-43DA-A5D2-9D94C37C7E69",
    "phone_number": "+13195557012"
  },
  {
    "name": "Alice",
    "guid": "2F0D88D3-CFB5-468F-BDA5-E3B3213A6D7D",
    "phone_number": "+13855551493"
  }
]
```

**Parameters**

* *name*

    string - the contact’s display name (e.g., from your address book).

* *guid*

    string - a client-generated unique identifier for this contact (UUID format recommended). Used to track contacts across requests and responses.

* *phone_number*

    string - the contact's phone number. No dashes, spaces, or parens. Must include the country code.

```json linenums="1" title="HTTP Response"
Status: 202 Accepted
{
  "batch_id": "f392a4802e01013ef9156aba1bbf95fc"
}
```

***

## Fetch Relationship Import Results

Retrieves an array of results from a previously submitted relationship import. Each result includes a matched GroupMe user, mapped back to the original contact via the guid.

> [!important]
> This request is relative to `https://api.groupme.com/v4/`, not `https://api.groupme.com/v3/`.

```json linenums="1" title="HTTP Request"
GET https://api.groupme.com/v4/relationships/batch/:batch_id
```

**Parameters**

* *batch_id*

    string - The batch ID received from the `/relationships/import_contacts` endpoint.

```json linenums="1" title="HTTP Response"
Status: 200 OK
[
  {
    "id": "86864140",
    "user_id": "86864140",
    "name": "Bob",
    "avatar_url": null,
    "reason": 2,
    "app_installed": true,
    "hidden": false,
    "mri": "8:gid:04d9d058-c8f3-45a6-b898-4686dbfe7163",
    "guid": "7533921A-154F-402D-AD51-AFE99F5D0CDC",
    "created_at": 1750202866,
    "created_at_iso8601": "2025-06-17T23:27:46.474950Z",
    "updated_at": 1750202866,
    "updated_at_iso8601": "2025-06-17T23:27:46.474950Z"
  },
  ...
]
```

***

## Delete Relationship

Delete a relationship from your contact book

!!! important

    This request is relative to `https://api.groupme.com/v4/`, not `https://api.groupme.com/v3/`.

```json linenums="1" title="HTTP Request"
DELETE https://api.groupme.com/v4/relationships/:user_id
```

```json linenums="1" title="HTTP Response"
Status: 202 Accepted
```
