---
"@buape/carbon": minor
---

feat: make some options/fields getters non-async
Any getters for users, roles, or mentionables are no longer async, since Discord provides all the needed data already and we don't need to fetch it.
Additionally, getChannelId/getChannelIds functions have been added to provide a synchronous option when you only need channel IDs, as Discord does not provide enough channel data to construct a full Channel in Carbon.

This applies to both the FieldsHandler in Modals, and the OptionsHandler for chat interactions