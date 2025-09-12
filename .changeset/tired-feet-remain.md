---
"@buape/carbon": minor
---

feat: make some options/fields getters not async
Any getters for users, roles, or mentionables is no longer async, since Discord provides all the needed data already so we don't need to fetch it.
Additionally, a getChannelId/getChannelIds function has been added for channels to have a sync option if you only need the IDs, as Discord does not provide enough channel data to construct a full Channel in Carbon.

This applies to both the FieldsHandler in Modals, and the OptionsHandler for chat interactions