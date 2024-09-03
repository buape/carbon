var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod2) => function __require() {
  return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
  mod2
));

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/gateway/common.js
var require_common = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/gateway/common.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/gateway/v10.js
var require_v10 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/gateway/v10.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o2, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o2, k2, desc);
    } : function(o2, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o2[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p2 in m)
        if (p2 !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p2))
          __createBinding(exports2, m, p2);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GatewayDispatchEvents = exports.GatewayIntentBits = exports.GatewayCloseCodes = exports.GatewayOpcodes = exports.GatewayVersion = void 0;
    __exportStar(require_common(), exports);
    exports.GatewayVersion = "10";
    var GatewayOpcodes2;
    (function(GatewayOpcodes3) {
      GatewayOpcodes3[GatewayOpcodes3["Dispatch"] = 0] = "Dispatch";
      GatewayOpcodes3[GatewayOpcodes3["Heartbeat"] = 1] = "Heartbeat";
      GatewayOpcodes3[GatewayOpcodes3["Identify"] = 2] = "Identify";
      GatewayOpcodes3[GatewayOpcodes3["PresenceUpdate"] = 3] = "PresenceUpdate";
      GatewayOpcodes3[GatewayOpcodes3["VoiceStateUpdate"] = 4] = "VoiceStateUpdate";
      GatewayOpcodes3[GatewayOpcodes3["Resume"] = 6] = "Resume";
      GatewayOpcodes3[GatewayOpcodes3["Reconnect"] = 7] = "Reconnect";
      GatewayOpcodes3[GatewayOpcodes3["RequestGuildMembers"] = 8] = "RequestGuildMembers";
      GatewayOpcodes3[GatewayOpcodes3["InvalidSession"] = 9] = "InvalidSession";
      GatewayOpcodes3[GatewayOpcodes3["Hello"] = 10] = "Hello";
      GatewayOpcodes3[GatewayOpcodes3["HeartbeatAck"] = 11] = "HeartbeatAck";
    })(GatewayOpcodes2 || (exports.GatewayOpcodes = GatewayOpcodes2 = {}));
    var GatewayCloseCodes2;
    (function(GatewayCloseCodes3) {
      GatewayCloseCodes3[GatewayCloseCodes3["UnknownError"] = 4e3] = "UnknownError";
      GatewayCloseCodes3[GatewayCloseCodes3["UnknownOpcode"] = 4001] = "UnknownOpcode";
      GatewayCloseCodes3[GatewayCloseCodes3["DecodeError"] = 4002] = "DecodeError";
      GatewayCloseCodes3[GatewayCloseCodes3["NotAuthenticated"] = 4003] = "NotAuthenticated";
      GatewayCloseCodes3[GatewayCloseCodes3["AuthenticationFailed"] = 4004] = "AuthenticationFailed";
      GatewayCloseCodes3[GatewayCloseCodes3["AlreadyAuthenticated"] = 4005] = "AlreadyAuthenticated";
      GatewayCloseCodes3[GatewayCloseCodes3["InvalidSeq"] = 4007] = "InvalidSeq";
      GatewayCloseCodes3[GatewayCloseCodes3["RateLimited"] = 4008] = "RateLimited";
      GatewayCloseCodes3[GatewayCloseCodes3["SessionTimedOut"] = 4009] = "SessionTimedOut";
      GatewayCloseCodes3[GatewayCloseCodes3["InvalidShard"] = 4010] = "InvalidShard";
      GatewayCloseCodes3[GatewayCloseCodes3["ShardingRequired"] = 4011] = "ShardingRequired";
      GatewayCloseCodes3[GatewayCloseCodes3["InvalidAPIVersion"] = 4012] = "InvalidAPIVersion";
      GatewayCloseCodes3[GatewayCloseCodes3["InvalidIntents"] = 4013] = "InvalidIntents";
      GatewayCloseCodes3[GatewayCloseCodes3["DisallowedIntents"] = 4014] = "DisallowedIntents";
    })(GatewayCloseCodes2 || (exports.GatewayCloseCodes = GatewayCloseCodes2 = {}));
    var GatewayIntentBits2;
    (function(GatewayIntentBits3) {
      GatewayIntentBits3[GatewayIntentBits3["Guilds"] = 1] = "Guilds";
      GatewayIntentBits3[GatewayIntentBits3["GuildMembers"] = 2] = "GuildMembers";
      GatewayIntentBits3[GatewayIntentBits3["GuildModeration"] = 4] = "GuildModeration";
      GatewayIntentBits3[GatewayIntentBits3["GuildBans"] = 4] = "GuildBans";
      GatewayIntentBits3[GatewayIntentBits3["GuildEmojisAndStickers"] = 8] = "GuildEmojisAndStickers";
      GatewayIntentBits3[GatewayIntentBits3["GuildIntegrations"] = 16] = "GuildIntegrations";
      GatewayIntentBits3[GatewayIntentBits3["GuildWebhooks"] = 32] = "GuildWebhooks";
      GatewayIntentBits3[GatewayIntentBits3["GuildInvites"] = 64] = "GuildInvites";
      GatewayIntentBits3[GatewayIntentBits3["GuildVoiceStates"] = 128] = "GuildVoiceStates";
      GatewayIntentBits3[GatewayIntentBits3["GuildPresences"] = 256] = "GuildPresences";
      GatewayIntentBits3[GatewayIntentBits3["GuildMessages"] = 512] = "GuildMessages";
      GatewayIntentBits3[GatewayIntentBits3["GuildMessageReactions"] = 1024] = "GuildMessageReactions";
      GatewayIntentBits3[GatewayIntentBits3["GuildMessageTyping"] = 2048] = "GuildMessageTyping";
      GatewayIntentBits3[GatewayIntentBits3["DirectMessages"] = 4096] = "DirectMessages";
      GatewayIntentBits3[GatewayIntentBits3["DirectMessageReactions"] = 8192] = "DirectMessageReactions";
      GatewayIntentBits3[GatewayIntentBits3["DirectMessageTyping"] = 16384] = "DirectMessageTyping";
      GatewayIntentBits3[GatewayIntentBits3["MessageContent"] = 32768] = "MessageContent";
      GatewayIntentBits3[GatewayIntentBits3["GuildScheduledEvents"] = 65536] = "GuildScheduledEvents";
      GatewayIntentBits3[GatewayIntentBits3["AutoModerationConfiguration"] = 1048576] = "AutoModerationConfiguration";
      GatewayIntentBits3[GatewayIntentBits3["AutoModerationExecution"] = 2097152] = "AutoModerationExecution";
      GatewayIntentBits3[GatewayIntentBits3["GuildMessagePolls"] = 16777216] = "GuildMessagePolls";
      GatewayIntentBits3[GatewayIntentBits3["DirectMessagePolls"] = 33554432] = "DirectMessagePolls";
    })(GatewayIntentBits2 || (exports.GatewayIntentBits = GatewayIntentBits2 = {}));
    var GatewayDispatchEvents2;
    (function(GatewayDispatchEvents3) {
      GatewayDispatchEvents3["ApplicationCommandPermissionsUpdate"] = "APPLICATION_COMMAND_PERMISSIONS_UPDATE";
      GatewayDispatchEvents3["ChannelCreate"] = "CHANNEL_CREATE";
      GatewayDispatchEvents3["ChannelDelete"] = "CHANNEL_DELETE";
      GatewayDispatchEvents3["ChannelPinsUpdate"] = "CHANNEL_PINS_UPDATE";
      GatewayDispatchEvents3["ChannelUpdate"] = "CHANNEL_UPDATE";
      GatewayDispatchEvents3["GuildBanAdd"] = "GUILD_BAN_ADD";
      GatewayDispatchEvents3["GuildBanRemove"] = "GUILD_BAN_REMOVE";
      GatewayDispatchEvents3["GuildCreate"] = "GUILD_CREATE";
      GatewayDispatchEvents3["GuildDelete"] = "GUILD_DELETE";
      GatewayDispatchEvents3["GuildEmojisUpdate"] = "GUILD_EMOJIS_UPDATE";
      GatewayDispatchEvents3["GuildIntegrationsUpdate"] = "GUILD_INTEGRATIONS_UPDATE";
      GatewayDispatchEvents3["GuildMemberAdd"] = "GUILD_MEMBER_ADD";
      GatewayDispatchEvents3["GuildMemberRemove"] = "GUILD_MEMBER_REMOVE";
      GatewayDispatchEvents3["GuildMembersChunk"] = "GUILD_MEMBERS_CHUNK";
      GatewayDispatchEvents3["GuildMemberUpdate"] = "GUILD_MEMBER_UPDATE";
      GatewayDispatchEvents3["GuildRoleCreate"] = "GUILD_ROLE_CREATE";
      GatewayDispatchEvents3["GuildRoleDelete"] = "GUILD_ROLE_DELETE";
      GatewayDispatchEvents3["GuildRoleUpdate"] = "GUILD_ROLE_UPDATE";
      GatewayDispatchEvents3["GuildStickersUpdate"] = "GUILD_STICKERS_UPDATE";
      GatewayDispatchEvents3["GuildUpdate"] = "GUILD_UPDATE";
      GatewayDispatchEvents3["IntegrationCreate"] = "INTEGRATION_CREATE";
      GatewayDispatchEvents3["IntegrationDelete"] = "INTEGRATION_DELETE";
      GatewayDispatchEvents3["IntegrationUpdate"] = "INTEGRATION_UPDATE";
      GatewayDispatchEvents3["InteractionCreate"] = "INTERACTION_CREATE";
      GatewayDispatchEvents3["InviteCreate"] = "INVITE_CREATE";
      GatewayDispatchEvents3["InviteDelete"] = "INVITE_DELETE";
      GatewayDispatchEvents3["MessageCreate"] = "MESSAGE_CREATE";
      GatewayDispatchEvents3["MessageDelete"] = "MESSAGE_DELETE";
      GatewayDispatchEvents3["MessageDeleteBulk"] = "MESSAGE_DELETE_BULK";
      GatewayDispatchEvents3["MessageReactionAdd"] = "MESSAGE_REACTION_ADD";
      GatewayDispatchEvents3["MessageReactionRemove"] = "MESSAGE_REACTION_REMOVE";
      GatewayDispatchEvents3["MessageReactionRemoveAll"] = "MESSAGE_REACTION_REMOVE_ALL";
      GatewayDispatchEvents3["MessageReactionRemoveEmoji"] = "MESSAGE_REACTION_REMOVE_EMOJI";
      GatewayDispatchEvents3["MessageUpdate"] = "MESSAGE_UPDATE";
      GatewayDispatchEvents3["PresenceUpdate"] = "PRESENCE_UPDATE";
      GatewayDispatchEvents3["StageInstanceCreate"] = "STAGE_INSTANCE_CREATE";
      GatewayDispatchEvents3["StageInstanceDelete"] = "STAGE_INSTANCE_DELETE";
      GatewayDispatchEvents3["StageInstanceUpdate"] = "STAGE_INSTANCE_UPDATE";
      GatewayDispatchEvents3["Ready"] = "READY";
      GatewayDispatchEvents3["Resumed"] = "RESUMED";
      GatewayDispatchEvents3["ThreadCreate"] = "THREAD_CREATE";
      GatewayDispatchEvents3["ThreadDelete"] = "THREAD_DELETE";
      GatewayDispatchEvents3["ThreadListSync"] = "THREAD_LIST_SYNC";
      GatewayDispatchEvents3["ThreadMembersUpdate"] = "THREAD_MEMBERS_UPDATE";
      GatewayDispatchEvents3["ThreadMemberUpdate"] = "THREAD_MEMBER_UPDATE";
      GatewayDispatchEvents3["ThreadUpdate"] = "THREAD_UPDATE";
      GatewayDispatchEvents3["TypingStart"] = "TYPING_START";
      GatewayDispatchEvents3["UserUpdate"] = "USER_UPDATE";
      GatewayDispatchEvents3["VoiceServerUpdate"] = "VOICE_SERVER_UPDATE";
      GatewayDispatchEvents3["VoiceStateUpdate"] = "VOICE_STATE_UPDATE";
      GatewayDispatchEvents3["WebhooksUpdate"] = "WEBHOOKS_UPDATE";
      GatewayDispatchEvents3["MessagePollVoteAdd"] = "MESSAGE_POLL_VOTE_ADD";
      GatewayDispatchEvents3["MessagePollVoteRemove"] = "MESSAGE_POLL_VOTE_REMOVE";
      GatewayDispatchEvents3["GuildScheduledEventCreate"] = "GUILD_SCHEDULED_EVENT_CREATE";
      GatewayDispatchEvents3["GuildScheduledEventUpdate"] = "GUILD_SCHEDULED_EVENT_UPDATE";
      GatewayDispatchEvents3["GuildScheduledEventDelete"] = "GUILD_SCHEDULED_EVENT_DELETE";
      GatewayDispatchEvents3["GuildScheduledEventUserAdd"] = "GUILD_SCHEDULED_EVENT_USER_ADD";
      GatewayDispatchEvents3["GuildScheduledEventUserRemove"] = "GUILD_SCHEDULED_EVENT_USER_REMOVE";
      GatewayDispatchEvents3["AutoModerationRuleCreate"] = "AUTO_MODERATION_RULE_CREATE";
      GatewayDispatchEvents3["AutoModerationRuleUpdate"] = "AUTO_MODERATION_RULE_UPDATE";
      GatewayDispatchEvents3["AutoModerationRuleDelete"] = "AUTO_MODERATION_RULE_DELETE";
      GatewayDispatchEvents3["AutoModerationActionExecution"] = "AUTO_MODERATION_ACTION_EXECUTION";
      GatewayDispatchEvents3["GuildAuditLogEntryCreate"] = "GUILD_AUDIT_LOG_ENTRY_CREATE";
      GatewayDispatchEvents3["EntitlementCreate"] = "ENTITLEMENT_CREATE";
      GatewayDispatchEvents3["EntitlementUpdate"] = "ENTITLEMENT_UPDATE";
      GatewayDispatchEvents3["EntitlementDelete"] = "ENTITLEMENT_DELETE";
    })(GatewayDispatchEvents2 || (exports.GatewayDispatchEvents = GatewayDispatchEvents2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/globals.js
var require_globals = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/globals.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormattingPatterns = void 0;
    exports.FormattingPatterns = {
      /**
       * Regular expression for matching a user mention, strictly without a nickname
       *
       * The `id` group property is present on the `exec` result of this expression
       */
      User: /<@(?<id>\d{17,20})>/,
      /**
       * Regular expression for matching a user mention, strictly with a nickname
       *
       * The `id` group property is present on the `exec` result of this expression
       *
       * @deprecated Passing `!` in user mentions is no longer necessary / supported, and future message contents won't have it
       */
      UserWithNickname: /<@!(?<id>\d{17,20})>/,
      /**
       * Regular expression for matching a user mention, with or without a nickname
       *
       * The `id` group property is present on the `exec` result of this expression
       *
       * @deprecated Passing `!` in user mentions is no longer necessary / supported, and future message contents won't have it
       */
      UserWithOptionalNickname: /<@!?(?<id>\d{17,20})>/,
      /**
       * Regular expression for matching a channel mention
       *
       * The `id` group property is present on the `exec` result of this expression
       */
      Channel: /<#(?<id>\d{17,20})>/,
      /**
       * Regular expression for matching a role mention
       *
       * The `id` group property is present on the `exec` result of this expression
       */
      Role: /<@&(?<id>\d{17,20})>/,
      /**
       * Regular expression for matching a application command mention
       *
       * The `fullName` (possibly including `name`, `subcommandOrGroup` and `subcommand`) and `id` group properties are present on the `exec` result of this expression
       */
      SlashCommand: (
        // eslint-disable-next-line unicorn/no-unsafe-regex
        /<\/(?<fullName>(?<name>[-_\p{Letter}\p{Number}\p{sc=Deva}\p{sc=Thai}]{1,32})(?: (?<subcommandOrGroup>[-_\p{Letter}\p{Number}\p{sc=Deva}\p{sc=Thai}]{1,32}))?(?: (?<subcommand>[-_\p{Letter}\p{Number}\p{sc=Deva}\p{sc=Thai}]{1,32}))?):(?<id>\d{17,20})>/u
      ),
      /**
       * Regular expression for matching a custom emoji, either static or animated
       *
       * The `animated`, `name` and `id` group properties are present on the `exec` result of this expression
       */
      Emoji: /<(?<animated>a)?:(?<name>\w{2,32}):(?<id>\d{17,20})>/,
      /**
       * Regular expression for matching strictly an animated custom emoji
       *
       * The `animated`, `name` and `id` group properties are present on the `exec` result of this expression
       */
      AnimatedEmoji: /<(?<animated>a):(?<name>\w{2,32}):(?<id>\d{17,20})>/,
      /**
       * Regular expression for matching strictly a static custom emoji
       *
       * The `name` and `id` group properties are present on the `exec` result of this expression
       */
      StaticEmoji: /<:(?<name>\w{2,32}):(?<id>\d{17,20})>/,
      /**
       * Regular expression for matching a timestamp, either default or custom styled
       *
       * The `timestamp` and `style` group properties are present on the `exec` result of this expression
       */
      // eslint-disable-next-line prefer-named-capture-group
      Timestamp: /<t:(?<timestamp>-?\d{1,13})(:(?<style>[DFRTdft]))?>/,
      /**
       * Regular expression for matching strictly default styled timestamps
       *
       * The `timestamp` group property is present on the `exec` result of this expression
       */
      DefaultStyledTimestamp: /<t:(?<timestamp>-?\d{1,13})>/,
      /**
       * Regular expression for matching strictly custom styled timestamps
       *
       * The `timestamp` and `style` group properties are present on the `exec` result of this expression
       */
      StyledTimestamp: /<t:(?<timestamp>-?\d{1,13}):(?<style>[DFRTdft])>/
    };
    Object.freeze(exports.FormattingPatterns);
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/common.js
var require_common2 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/common.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PermissionFlagsBits = void 0;
    exports.PermissionFlagsBits = {
      /**
       * Allows creation of instant invites
       *
       * Applies to channel types: Text, Voice, Stage
       */
      CreateInstantInvite: 1n << 0n,
      /**
       * Allows kicking members
       */
      // eslint-disable-next-line sonarjs/no-identical-expressions
      KickMembers: 1n << 1n,
      /**
       * Allows banning members
       */
      BanMembers: 1n << 2n,
      /**
       * Allows all permissions and bypasses channel permission overwrites
       */
      Administrator: 1n << 3n,
      /**
       * Allows management and editing of channels
       *
       * Applies to channel types: Text, Voice, Stage
       */
      ManageChannels: 1n << 4n,
      /**
       * Allows management and editing of the guild
       */
      ManageGuild: 1n << 5n,
      /**
       * Allows for the addition of reactions to messages
       *
       * Applies to channel types: Text, Voice, Stage
       */
      AddReactions: 1n << 6n,
      /**
       * Allows for viewing of audit logs
       */
      ViewAuditLog: 1n << 7n,
      /**
       * Allows for using priority speaker in a voice channel
       *
       * Applies to channel types: Voice
       */
      PrioritySpeaker: 1n << 8n,
      /**
       * Allows the user to go live
       *
       * Applies to channel types: Voice, Stage
       */
      Stream: 1n << 9n,
      /**
       * Allows guild members to view a channel, which includes reading messages in text channels and joining voice channels
       *
       * Applies to channel types: Text, Voice, Stage
       */
      ViewChannel: 1n << 10n,
      /**
       * Allows for sending messages in a channel and creating threads in a forum
       * (does not allow sending messages in threads)
       *
       * Applies to channel types: Text, Voice, Stage
       */
      SendMessages: 1n << 11n,
      /**
       * Allows for sending of `/tts` messages
       *
       * Applies to channel types: Text, Voice, Stage
       */
      SendTTSMessages: 1n << 12n,
      /**
       * Allows for deletion of other users messages
       *
       * Applies to channel types: Text, Voice, Stage
       */
      ManageMessages: 1n << 13n,
      /**
       * Links sent by users with this permission will be auto-embedded
       *
       * Applies to channel types: Text, Voice, Stage
       */
      EmbedLinks: 1n << 14n,
      /**
       * Allows for uploading images and files
       *
       * Applies to channel types: Text, Voice, Stage
       */
      AttachFiles: 1n << 15n,
      /**
       * Allows for reading of message history
       *
       * Applies to channel types: Text, Voice, Stage
       */
      ReadMessageHistory: 1n << 16n,
      /**
       * Allows for using the `@everyone` tag to notify all users in a channel,
       * and the `@here` tag to notify all online users in a channel
       *
       * Applies to channel types: Text, Voice, Stage
       */
      MentionEveryone: 1n << 17n,
      /**
       * Allows the usage of custom emojis from other servers
       *
       * Applies to channel types: Text, Voice, Stage
       */
      UseExternalEmojis: 1n << 18n,
      /**
       * Allows for viewing guild insights
       */
      ViewGuildInsights: 1n << 19n,
      /**
       * Allows for joining of a voice channel
       *
       * Applies to channel types: Voice, Stage
       */
      Connect: 1n << 20n,
      /**
       * Allows for speaking in a voice channel
       *
       * Applies to channel types: Voice
       */
      Speak: 1n << 21n,
      /**
       * Allows for muting members in a voice channel
       *
       * Applies to channel types: Voice, Stage
       */
      MuteMembers: 1n << 22n,
      /**
       * Allows for deafening of members in a voice channel
       *
       * Applies to channel types: Voice
       */
      DeafenMembers: 1n << 23n,
      /**
       * Allows for moving of members between voice channels
       *
       * Applies to channel types: Voice, Stage
       */
      MoveMembers: 1n << 24n,
      /**
       * Allows for using voice-activity-detection in a voice channel
       *
       * Applies to channel types: Voice
       */
      UseVAD: 1n << 25n,
      /**
       * Allows for modification of own nickname
       */
      ChangeNickname: 1n << 26n,
      /**
       * Allows for modification of other users nicknames
       */
      ManageNicknames: 1n << 27n,
      /**
       * Allows management and editing of roles
       *
       * Applies to channel types: Text, Voice, Stage
       */
      ManageRoles: 1n << 28n,
      /**
       * Allows management and editing of webhooks
       *
       * Applies to channel types: Text, Voice, Stage
       */
      ManageWebhooks: 1n << 29n,
      /**
       * Allows management and editing of emojis, stickers, and soundboard sounds
       *
       * @deprecated This is the old name for {@apilink PermissionFlagsBits#ManageGuildExpressions}
       */
      ManageEmojisAndStickers: 1n << 30n,
      /**
       * Allows for editing and deleting emojis, stickers, and soundboard sounds created by all users
       */
      ManageGuildExpressions: 1n << 30n,
      /**
       * Allows members to use application commands, including slash commands and context menu commands
       *
       * Applies to channel types: Text, Voice, Stage
       */
      UseApplicationCommands: 1n << 31n,
      /**
       * Allows for requesting to speak in stage channels
       *
       * Applies to channel types: Stage
       */
      RequestToSpeak: 1n << 32n,
      /**
       * Allows for editing and deleting scheduled events created by all users
       *
       * Applies to channel types: Voice, Stage
       */
      ManageEvents: 1n << 33n,
      /**
       * Allows for deleting and archiving threads, and viewing all private threads
       *
       * Applies to channel types: Text
       */
      ManageThreads: 1n << 34n,
      /**
       * Allows for creating public and announcement threads
       *
       * Applies to channel types: Text
       */
      CreatePublicThreads: 1n << 35n,
      /**
       * Allows for creating private threads
       *
       * Applies to channel types: Text
       */
      CreatePrivateThreads: 1n << 36n,
      /**
       * Allows the usage of custom stickers from other servers
       *
       * Applies to channel types: Text, Voice, Stage
       */
      UseExternalStickers: 1n << 37n,
      /**
       * Allows for sending messages in threads
       *
       * Applies to channel types: Text
       */
      SendMessagesInThreads: 1n << 38n,
      /**
       * Allows for using Activities (applications with the {@apilink ApplicationFlags.Embedded} flag) in a voice channel
       *
       * Applies to channel types: Voice
       */
      UseEmbeddedActivities: 1n << 39n,
      /**
       * Allows for timing out users to prevent them from sending or reacting to messages in chat and threads,
       * and from speaking in voice and stage channels
       */
      ModerateMembers: 1n << 40n,
      /**
       * Allows for viewing role subscription insights
       */
      ViewCreatorMonetizationAnalytics: 1n << 41n,
      /**
       * Allows for using soundboard in a voice channel
       *
       * Applies to channel types: Voice
       */
      UseSoundboard: 1n << 42n,
      /**
       * Allows for creating emojis, stickers, and soundboard sounds, and editing and deleting those created by the current user
       */
      CreateGuildExpressions: 1n << 43n,
      /**
       * Allows for creating scheduled events, and editing and deleting those created by the current user
       *
       * Applies to channel types: Voice, Stage
       */
      CreateEvents: 1n << 44n,
      /**
       * Allows the usage of custom soundboard sounds from other servers
       *
       * Applies to channel types: Voice
       */
      UseExternalSounds: 1n << 45n,
      /**
       * Allows sending voice messages
       *
       * Applies to channel types: Text, Voice, Stage
       */
      SendVoiceMessages: 1n << 46n,
      /**
       * Allows sending polls
       *
       * Applies to channel types: Text, Voice, Stage
       */
      SendPolls: 1n << 49n,
      /**
       * Allows user-installed apps to send public responses. When disabled, users will still be allowed to use their apps but the responses will be ephemeral. This only applies to apps not also installed to the server
       *
       * Applies to channel types: Text, Voice, Stage
       */
      UseExternalApps: 1n << 50n
    };
    Object.freeze(exports.PermissionFlagsBits);
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/application.js
var require_application = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/application.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ApplicationRoleConnectionMetadataType = exports.ApplicationFlags = void 0;
    var ApplicationFlags2;
    (function(ApplicationFlags3) {
      ApplicationFlags3[ApplicationFlags3["EmbeddedReleased"] = 2] = "EmbeddedReleased";
      ApplicationFlags3[ApplicationFlags3["ManagedEmoji"] = 4] = "ManagedEmoji";
      ApplicationFlags3[ApplicationFlags3["EmbeddedIAP"] = 8] = "EmbeddedIAP";
      ApplicationFlags3[ApplicationFlags3["GroupDMCreate"] = 16] = "GroupDMCreate";
      ApplicationFlags3[ApplicationFlags3["ApplicationAutoModerationRuleCreateBadge"] = 64] = "ApplicationAutoModerationRuleCreateBadge";
      ApplicationFlags3[ApplicationFlags3["RPCHasConnected"] = 2048] = "RPCHasConnected";
      ApplicationFlags3[ApplicationFlags3["GatewayPresence"] = 4096] = "GatewayPresence";
      ApplicationFlags3[ApplicationFlags3["GatewayPresenceLimited"] = 8192] = "GatewayPresenceLimited";
      ApplicationFlags3[ApplicationFlags3["GatewayGuildMembers"] = 16384] = "GatewayGuildMembers";
      ApplicationFlags3[ApplicationFlags3["GatewayGuildMembersLimited"] = 32768] = "GatewayGuildMembersLimited";
      ApplicationFlags3[ApplicationFlags3["VerificationPendingGuildLimit"] = 65536] = "VerificationPendingGuildLimit";
      ApplicationFlags3[ApplicationFlags3["Embedded"] = 131072] = "Embedded";
      ApplicationFlags3[ApplicationFlags3["GatewayMessageContent"] = 262144] = "GatewayMessageContent";
      ApplicationFlags3[ApplicationFlags3["GatewayMessageContentLimited"] = 524288] = "GatewayMessageContentLimited";
      ApplicationFlags3[ApplicationFlags3["EmbeddedFirstParty"] = 1048576] = "EmbeddedFirstParty";
      ApplicationFlags3[ApplicationFlags3["ApplicationCommandBadge"] = 8388608] = "ApplicationCommandBadge";
    })(ApplicationFlags2 || (exports.ApplicationFlags = ApplicationFlags2 = {}));
    var ApplicationRoleConnectionMetadataType2;
    (function(ApplicationRoleConnectionMetadataType3) {
      ApplicationRoleConnectionMetadataType3[ApplicationRoleConnectionMetadataType3["IntegerLessThanOrEqual"] = 1] = "IntegerLessThanOrEqual";
      ApplicationRoleConnectionMetadataType3[ApplicationRoleConnectionMetadataType3["IntegerGreaterThanOrEqual"] = 2] = "IntegerGreaterThanOrEqual";
      ApplicationRoleConnectionMetadataType3[ApplicationRoleConnectionMetadataType3["IntegerEqual"] = 3] = "IntegerEqual";
      ApplicationRoleConnectionMetadataType3[ApplicationRoleConnectionMetadataType3["IntegerNotEqual"] = 4] = "IntegerNotEqual";
      ApplicationRoleConnectionMetadataType3[ApplicationRoleConnectionMetadataType3["DatetimeLessThanOrEqual"] = 5] = "DatetimeLessThanOrEqual";
      ApplicationRoleConnectionMetadataType3[ApplicationRoleConnectionMetadataType3["DatetimeGreaterThanOrEqual"] = 6] = "DatetimeGreaterThanOrEqual";
      ApplicationRoleConnectionMetadataType3[ApplicationRoleConnectionMetadataType3["BooleanEqual"] = 7] = "BooleanEqual";
      ApplicationRoleConnectionMetadataType3[ApplicationRoleConnectionMetadataType3["BooleanNotEqual"] = 8] = "BooleanNotEqual";
    })(ApplicationRoleConnectionMetadataType2 || (exports.ApplicationRoleConnectionMetadataType = ApplicationRoleConnectionMetadataType2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/auditLog.js
var require_auditLog = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/auditLog.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AuditLogOptionsType = exports.AuditLogEvent = void 0;
    var AuditLogEvent2;
    (function(AuditLogEvent3) {
      AuditLogEvent3[AuditLogEvent3["GuildUpdate"] = 1] = "GuildUpdate";
      AuditLogEvent3[AuditLogEvent3["ChannelCreate"] = 10] = "ChannelCreate";
      AuditLogEvent3[AuditLogEvent3["ChannelUpdate"] = 11] = "ChannelUpdate";
      AuditLogEvent3[AuditLogEvent3["ChannelDelete"] = 12] = "ChannelDelete";
      AuditLogEvent3[AuditLogEvent3["ChannelOverwriteCreate"] = 13] = "ChannelOverwriteCreate";
      AuditLogEvent3[AuditLogEvent3["ChannelOverwriteUpdate"] = 14] = "ChannelOverwriteUpdate";
      AuditLogEvent3[AuditLogEvent3["ChannelOverwriteDelete"] = 15] = "ChannelOverwriteDelete";
      AuditLogEvent3[AuditLogEvent3["MemberKick"] = 20] = "MemberKick";
      AuditLogEvent3[AuditLogEvent3["MemberPrune"] = 21] = "MemberPrune";
      AuditLogEvent3[AuditLogEvent3["MemberBanAdd"] = 22] = "MemberBanAdd";
      AuditLogEvent3[AuditLogEvent3["MemberBanRemove"] = 23] = "MemberBanRemove";
      AuditLogEvent3[AuditLogEvent3["MemberUpdate"] = 24] = "MemberUpdate";
      AuditLogEvent3[AuditLogEvent3["MemberRoleUpdate"] = 25] = "MemberRoleUpdate";
      AuditLogEvent3[AuditLogEvent3["MemberMove"] = 26] = "MemberMove";
      AuditLogEvent3[AuditLogEvent3["MemberDisconnect"] = 27] = "MemberDisconnect";
      AuditLogEvent3[AuditLogEvent3["BotAdd"] = 28] = "BotAdd";
      AuditLogEvent3[AuditLogEvent3["RoleCreate"] = 30] = "RoleCreate";
      AuditLogEvent3[AuditLogEvent3["RoleUpdate"] = 31] = "RoleUpdate";
      AuditLogEvent3[AuditLogEvent3["RoleDelete"] = 32] = "RoleDelete";
      AuditLogEvent3[AuditLogEvent3["InviteCreate"] = 40] = "InviteCreate";
      AuditLogEvent3[AuditLogEvent3["InviteUpdate"] = 41] = "InviteUpdate";
      AuditLogEvent3[AuditLogEvent3["InviteDelete"] = 42] = "InviteDelete";
      AuditLogEvent3[AuditLogEvent3["WebhookCreate"] = 50] = "WebhookCreate";
      AuditLogEvent3[AuditLogEvent3["WebhookUpdate"] = 51] = "WebhookUpdate";
      AuditLogEvent3[AuditLogEvent3["WebhookDelete"] = 52] = "WebhookDelete";
      AuditLogEvent3[AuditLogEvent3["EmojiCreate"] = 60] = "EmojiCreate";
      AuditLogEvent3[AuditLogEvent3["EmojiUpdate"] = 61] = "EmojiUpdate";
      AuditLogEvent3[AuditLogEvent3["EmojiDelete"] = 62] = "EmojiDelete";
      AuditLogEvent3[AuditLogEvent3["MessageDelete"] = 72] = "MessageDelete";
      AuditLogEvent3[AuditLogEvent3["MessageBulkDelete"] = 73] = "MessageBulkDelete";
      AuditLogEvent3[AuditLogEvent3["MessagePin"] = 74] = "MessagePin";
      AuditLogEvent3[AuditLogEvent3["MessageUnpin"] = 75] = "MessageUnpin";
      AuditLogEvent3[AuditLogEvent3["IntegrationCreate"] = 80] = "IntegrationCreate";
      AuditLogEvent3[AuditLogEvent3["IntegrationUpdate"] = 81] = "IntegrationUpdate";
      AuditLogEvent3[AuditLogEvent3["IntegrationDelete"] = 82] = "IntegrationDelete";
      AuditLogEvent3[AuditLogEvent3["StageInstanceCreate"] = 83] = "StageInstanceCreate";
      AuditLogEvent3[AuditLogEvent3["StageInstanceUpdate"] = 84] = "StageInstanceUpdate";
      AuditLogEvent3[AuditLogEvent3["StageInstanceDelete"] = 85] = "StageInstanceDelete";
      AuditLogEvent3[AuditLogEvent3["StickerCreate"] = 90] = "StickerCreate";
      AuditLogEvent3[AuditLogEvent3["StickerUpdate"] = 91] = "StickerUpdate";
      AuditLogEvent3[AuditLogEvent3["StickerDelete"] = 92] = "StickerDelete";
      AuditLogEvent3[AuditLogEvent3["GuildScheduledEventCreate"] = 100] = "GuildScheduledEventCreate";
      AuditLogEvent3[AuditLogEvent3["GuildScheduledEventUpdate"] = 101] = "GuildScheduledEventUpdate";
      AuditLogEvent3[AuditLogEvent3["GuildScheduledEventDelete"] = 102] = "GuildScheduledEventDelete";
      AuditLogEvent3[AuditLogEvent3["ThreadCreate"] = 110] = "ThreadCreate";
      AuditLogEvent3[AuditLogEvent3["ThreadUpdate"] = 111] = "ThreadUpdate";
      AuditLogEvent3[AuditLogEvent3["ThreadDelete"] = 112] = "ThreadDelete";
      AuditLogEvent3[AuditLogEvent3["ApplicationCommandPermissionUpdate"] = 121] = "ApplicationCommandPermissionUpdate";
      AuditLogEvent3[AuditLogEvent3["AutoModerationRuleCreate"] = 140] = "AutoModerationRuleCreate";
      AuditLogEvent3[AuditLogEvent3["AutoModerationRuleUpdate"] = 141] = "AutoModerationRuleUpdate";
      AuditLogEvent3[AuditLogEvent3["AutoModerationRuleDelete"] = 142] = "AutoModerationRuleDelete";
      AuditLogEvent3[AuditLogEvent3["AutoModerationBlockMessage"] = 143] = "AutoModerationBlockMessage";
      AuditLogEvent3[AuditLogEvent3["AutoModerationFlagToChannel"] = 144] = "AutoModerationFlagToChannel";
      AuditLogEvent3[AuditLogEvent3["AutoModerationUserCommunicationDisabled"] = 145] = "AutoModerationUserCommunicationDisabled";
      AuditLogEvent3[AuditLogEvent3["CreatorMonetizationRequestCreated"] = 150] = "CreatorMonetizationRequestCreated";
      AuditLogEvent3[AuditLogEvent3["CreatorMonetizationTermsAccepted"] = 151] = "CreatorMonetizationTermsAccepted";
      AuditLogEvent3[AuditLogEvent3["OnboardingPromptCreate"] = 163] = "OnboardingPromptCreate";
      AuditLogEvent3[AuditLogEvent3["OnboardingPromptUpdate"] = 164] = "OnboardingPromptUpdate";
      AuditLogEvent3[AuditLogEvent3["OnboardingPromptDelete"] = 165] = "OnboardingPromptDelete";
      AuditLogEvent3[AuditLogEvent3["OnboardingCreate"] = 166] = "OnboardingCreate";
      AuditLogEvent3[AuditLogEvent3["OnboardingUpdate"] = 167] = "OnboardingUpdate";
      AuditLogEvent3[AuditLogEvent3["HomeSettingsCreate"] = 190] = "HomeSettingsCreate";
      AuditLogEvent3[AuditLogEvent3["HomeSettingsUpdate"] = 191] = "HomeSettingsUpdate";
    })(AuditLogEvent2 || (exports.AuditLogEvent = AuditLogEvent2 = {}));
    var AuditLogOptionsType2;
    (function(AuditLogOptionsType3) {
      AuditLogOptionsType3["Role"] = "0";
      AuditLogOptionsType3["Member"] = "1";
    })(AuditLogOptionsType2 || (exports.AuditLogOptionsType = AuditLogOptionsType2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/autoModeration.js
var require_autoModeration = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/autoModeration.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AutoModerationActionType = exports.AutoModerationRuleEventType = exports.AutoModerationRuleKeywordPresetType = exports.AutoModerationRuleTriggerType = void 0;
    var AutoModerationRuleTriggerType2;
    (function(AutoModerationRuleTriggerType3) {
      AutoModerationRuleTriggerType3[AutoModerationRuleTriggerType3["Keyword"] = 1] = "Keyword";
      AutoModerationRuleTriggerType3[AutoModerationRuleTriggerType3["Spam"] = 3] = "Spam";
      AutoModerationRuleTriggerType3[AutoModerationRuleTriggerType3["KeywordPreset"] = 4] = "KeywordPreset";
      AutoModerationRuleTriggerType3[AutoModerationRuleTriggerType3["MentionSpam"] = 5] = "MentionSpam";
      AutoModerationRuleTriggerType3[AutoModerationRuleTriggerType3["MemberProfile"] = 6] = "MemberProfile";
    })(AutoModerationRuleTriggerType2 || (exports.AutoModerationRuleTriggerType = AutoModerationRuleTriggerType2 = {}));
    var AutoModerationRuleKeywordPresetType2;
    (function(AutoModerationRuleKeywordPresetType3) {
      AutoModerationRuleKeywordPresetType3[AutoModerationRuleKeywordPresetType3["Profanity"] = 1] = "Profanity";
      AutoModerationRuleKeywordPresetType3[AutoModerationRuleKeywordPresetType3["SexualContent"] = 2] = "SexualContent";
      AutoModerationRuleKeywordPresetType3[AutoModerationRuleKeywordPresetType3["Slurs"] = 3] = "Slurs";
    })(AutoModerationRuleKeywordPresetType2 || (exports.AutoModerationRuleKeywordPresetType = AutoModerationRuleKeywordPresetType2 = {}));
    var AutoModerationRuleEventType2;
    (function(AutoModerationRuleEventType3) {
      AutoModerationRuleEventType3[AutoModerationRuleEventType3["MessageSend"] = 1] = "MessageSend";
      AutoModerationRuleEventType3[AutoModerationRuleEventType3["MemberUpdate"] = 2] = "MemberUpdate";
    })(AutoModerationRuleEventType2 || (exports.AutoModerationRuleEventType = AutoModerationRuleEventType2 = {}));
    var AutoModerationActionType2;
    (function(AutoModerationActionType3) {
      AutoModerationActionType3[AutoModerationActionType3["BlockMessage"] = 1] = "BlockMessage";
      AutoModerationActionType3[AutoModerationActionType3["SendAlertMessage"] = 2] = "SendAlertMessage";
      AutoModerationActionType3[AutoModerationActionType3["Timeout"] = 3] = "Timeout";
      AutoModerationActionType3[AutoModerationActionType3["BlockMemberInteraction"] = 4] = "BlockMemberInteraction";
    })(AutoModerationActionType2 || (exports.AutoModerationActionType = AutoModerationActionType2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/channel.js
var require_channel = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/channel.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChannelFlags = exports.SelectMenuDefaultValueType = exports.TextInputStyle = exports.ButtonStyle = exports.ComponentType = exports.AllowedMentionsTypes = exports.AttachmentFlags = exports.EmbedType = exports.ThreadMemberFlags = exports.ThreadAutoArchiveDuration = exports.OverwriteType = exports.MessageFlags = exports.MessageReferenceType = exports.MessageActivityType = exports.MessageType = exports.VideoQualityMode = exports.ChannelType = exports.ForumLayoutType = exports.SortOrderType = void 0;
    var SortOrderType2;
    (function(SortOrderType3) {
      SortOrderType3[SortOrderType3["LatestActivity"] = 0] = "LatestActivity";
      SortOrderType3[SortOrderType3["CreationDate"] = 1] = "CreationDate";
    })(SortOrderType2 || (exports.SortOrderType = SortOrderType2 = {}));
    var ForumLayoutType2;
    (function(ForumLayoutType3) {
      ForumLayoutType3[ForumLayoutType3["NotSet"] = 0] = "NotSet";
      ForumLayoutType3[ForumLayoutType3["ListView"] = 1] = "ListView";
      ForumLayoutType3[ForumLayoutType3["GalleryView"] = 2] = "GalleryView";
    })(ForumLayoutType2 || (exports.ForumLayoutType = ForumLayoutType2 = {}));
    var ChannelType2;
    (function(ChannelType3) {
      ChannelType3[ChannelType3["GuildText"] = 0] = "GuildText";
      ChannelType3[ChannelType3["DM"] = 1] = "DM";
      ChannelType3[ChannelType3["GuildVoice"] = 2] = "GuildVoice";
      ChannelType3[ChannelType3["GroupDM"] = 3] = "GroupDM";
      ChannelType3[ChannelType3["GuildCategory"] = 4] = "GuildCategory";
      ChannelType3[ChannelType3["GuildAnnouncement"] = 5] = "GuildAnnouncement";
      ChannelType3[ChannelType3["AnnouncementThread"] = 10] = "AnnouncementThread";
      ChannelType3[ChannelType3["PublicThread"] = 11] = "PublicThread";
      ChannelType3[ChannelType3["PrivateThread"] = 12] = "PrivateThread";
      ChannelType3[ChannelType3["GuildStageVoice"] = 13] = "GuildStageVoice";
      ChannelType3[ChannelType3["GuildDirectory"] = 14] = "GuildDirectory";
      ChannelType3[ChannelType3["GuildForum"] = 15] = "GuildForum";
      ChannelType3[ChannelType3["GuildMedia"] = 16] = "GuildMedia";
      ChannelType3[ChannelType3["GuildNews"] = 5] = "GuildNews";
      ChannelType3[ChannelType3["GuildNewsThread"] = 10] = "GuildNewsThread";
      ChannelType3[ChannelType3["GuildPublicThread"] = 11] = "GuildPublicThread";
      ChannelType3[ChannelType3["GuildPrivateThread"] = 12] = "GuildPrivateThread";
    })(ChannelType2 || (exports.ChannelType = ChannelType2 = {}));
    var VideoQualityMode2;
    (function(VideoQualityMode3) {
      VideoQualityMode3[VideoQualityMode3["Auto"] = 1] = "Auto";
      VideoQualityMode3[VideoQualityMode3["Full"] = 2] = "Full";
    })(VideoQualityMode2 || (exports.VideoQualityMode = VideoQualityMode2 = {}));
    var MessageType2;
    (function(MessageType3) {
      MessageType3[MessageType3["Default"] = 0] = "Default";
      MessageType3[MessageType3["RecipientAdd"] = 1] = "RecipientAdd";
      MessageType3[MessageType3["RecipientRemove"] = 2] = "RecipientRemove";
      MessageType3[MessageType3["Call"] = 3] = "Call";
      MessageType3[MessageType3["ChannelNameChange"] = 4] = "ChannelNameChange";
      MessageType3[MessageType3["ChannelIconChange"] = 5] = "ChannelIconChange";
      MessageType3[MessageType3["ChannelPinnedMessage"] = 6] = "ChannelPinnedMessage";
      MessageType3[MessageType3["UserJoin"] = 7] = "UserJoin";
      MessageType3[MessageType3["GuildBoost"] = 8] = "GuildBoost";
      MessageType3[MessageType3["GuildBoostTier1"] = 9] = "GuildBoostTier1";
      MessageType3[MessageType3["GuildBoostTier2"] = 10] = "GuildBoostTier2";
      MessageType3[MessageType3["GuildBoostTier3"] = 11] = "GuildBoostTier3";
      MessageType3[MessageType3["ChannelFollowAdd"] = 12] = "ChannelFollowAdd";
      MessageType3[MessageType3["GuildDiscoveryDisqualified"] = 14] = "GuildDiscoveryDisqualified";
      MessageType3[MessageType3["GuildDiscoveryRequalified"] = 15] = "GuildDiscoveryRequalified";
      MessageType3[MessageType3["GuildDiscoveryGracePeriodInitialWarning"] = 16] = "GuildDiscoveryGracePeriodInitialWarning";
      MessageType3[MessageType3["GuildDiscoveryGracePeriodFinalWarning"] = 17] = "GuildDiscoveryGracePeriodFinalWarning";
      MessageType3[MessageType3["ThreadCreated"] = 18] = "ThreadCreated";
      MessageType3[MessageType3["Reply"] = 19] = "Reply";
      MessageType3[MessageType3["ChatInputCommand"] = 20] = "ChatInputCommand";
      MessageType3[MessageType3["ThreadStarterMessage"] = 21] = "ThreadStarterMessage";
      MessageType3[MessageType3["GuildInviteReminder"] = 22] = "GuildInviteReminder";
      MessageType3[MessageType3["ContextMenuCommand"] = 23] = "ContextMenuCommand";
      MessageType3[MessageType3["AutoModerationAction"] = 24] = "AutoModerationAction";
      MessageType3[MessageType3["RoleSubscriptionPurchase"] = 25] = "RoleSubscriptionPurchase";
      MessageType3[MessageType3["InteractionPremiumUpsell"] = 26] = "InteractionPremiumUpsell";
      MessageType3[MessageType3["StageStart"] = 27] = "StageStart";
      MessageType3[MessageType3["StageEnd"] = 28] = "StageEnd";
      MessageType3[MessageType3["StageSpeaker"] = 29] = "StageSpeaker";
      MessageType3[MessageType3["StageRaiseHand"] = 30] = "StageRaiseHand";
      MessageType3[MessageType3["StageTopic"] = 31] = "StageTopic";
      MessageType3[MessageType3["GuildApplicationPremiumSubscription"] = 32] = "GuildApplicationPremiumSubscription";
      MessageType3[MessageType3["GuildIncidentAlertModeEnabled"] = 36] = "GuildIncidentAlertModeEnabled";
      MessageType3[MessageType3["GuildIncidentAlertModeDisabled"] = 37] = "GuildIncidentAlertModeDisabled";
      MessageType3[MessageType3["GuildIncidentReportRaid"] = 38] = "GuildIncidentReportRaid";
      MessageType3[MessageType3["GuildIncidentReportFalseAlarm"] = 39] = "GuildIncidentReportFalseAlarm";
    })(MessageType2 || (exports.MessageType = MessageType2 = {}));
    var MessageActivityType2;
    (function(MessageActivityType3) {
      MessageActivityType3[MessageActivityType3["Join"] = 1] = "Join";
      MessageActivityType3[MessageActivityType3["Spectate"] = 2] = "Spectate";
      MessageActivityType3[MessageActivityType3["Listen"] = 3] = "Listen";
      MessageActivityType3[MessageActivityType3["JoinRequest"] = 5] = "JoinRequest";
    })(MessageActivityType2 || (exports.MessageActivityType = MessageActivityType2 = {}));
    var MessageReferenceType2;
    (function(MessageReferenceType3) {
      MessageReferenceType3[MessageReferenceType3["Default"] = 0] = "Default";
      MessageReferenceType3[MessageReferenceType3["Forward"] = 1] = "Forward";
    })(MessageReferenceType2 || (exports.MessageReferenceType = MessageReferenceType2 = {}));
    var MessageFlags2;
    (function(MessageFlags3) {
      MessageFlags3[MessageFlags3["Crossposted"] = 1] = "Crossposted";
      MessageFlags3[MessageFlags3["IsCrosspost"] = 2] = "IsCrosspost";
      MessageFlags3[MessageFlags3["SuppressEmbeds"] = 4] = "SuppressEmbeds";
      MessageFlags3[MessageFlags3["SourceMessageDeleted"] = 8] = "SourceMessageDeleted";
      MessageFlags3[MessageFlags3["Urgent"] = 16] = "Urgent";
      MessageFlags3[MessageFlags3["HasThread"] = 32] = "HasThread";
      MessageFlags3[MessageFlags3["Ephemeral"] = 64] = "Ephemeral";
      MessageFlags3[MessageFlags3["Loading"] = 128] = "Loading";
      MessageFlags3[MessageFlags3["FailedToMentionSomeRolesInThread"] = 256] = "FailedToMentionSomeRolesInThread";
      MessageFlags3[MessageFlags3["ShouldShowLinkNotDiscordWarning"] = 1024] = "ShouldShowLinkNotDiscordWarning";
      MessageFlags3[MessageFlags3["SuppressNotifications"] = 4096] = "SuppressNotifications";
      MessageFlags3[MessageFlags3["IsVoiceMessage"] = 8192] = "IsVoiceMessage";
    })(MessageFlags2 || (exports.MessageFlags = MessageFlags2 = {}));
    var OverwriteType2;
    (function(OverwriteType3) {
      OverwriteType3[OverwriteType3["Role"] = 0] = "Role";
      OverwriteType3[OverwriteType3["Member"] = 1] = "Member";
    })(OverwriteType2 || (exports.OverwriteType = OverwriteType2 = {}));
    var ThreadAutoArchiveDuration2;
    (function(ThreadAutoArchiveDuration3) {
      ThreadAutoArchiveDuration3[ThreadAutoArchiveDuration3["OneHour"] = 60] = "OneHour";
      ThreadAutoArchiveDuration3[ThreadAutoArchiveDuration3["OneDay"] = 1440] = "OneDay";
      ThreadAutoArchiveDuration3[ThreadAutoArchiveDuration3["ThreeDays"] = 4320] = "ThreeDays";
      ThreadAutoArchiveDuration3[ThreadAutoArchiveDuration3["OneWeek"] = 10080] = "OneWeek";
    })(ThreadAutoArchiveDuration2 || (exports.ThreadAutoArchiveDuration = ThreadAutoArchiveDuration2 = {}));
    var ThreadMemberFlags2;
    (function(ThreadMemberFlags3) {
      ThreadMemberFlags3[ThreadMemberFlags3["HasInteracted"] = 1] = "HasInteracted";
      ThreadMemberFlags3[ThreadMemberFlags3["AllMessages"] = 2] = "AllMessages";
      ThreadMemberFlags3[ThreadMemberFlags3["OnlyMentions"] = 4] = "OnlyMentions";
      ThreadMemberFlags3[ThreadMemberFlags3["NoMessages"] = 8] = "NoMessages";
    })(ThreadMemberFlags2 || (exports.ThreadMemberFlags = ThreadMemberFlags2 = {}));
    var EmbedType2;
    (function(EmbedType3) {
      EmbedType3["Rich"] = "rich";
      EmbedType3["Image"] = "image";
      EmbedType3["Video"] = "video";
      EmbedType3["GIFV"] = "gifv";
      EmbedType3["Article"] = "article";
      EmbedType3["Link"] = "link";
      EmbedType3["AutoModerationMessage"] = "auto_moderation_message";
    })(EmbedType2 || (exports.EmbedType = EmbedType2 = {}));
    var AttachmentFlags2;
    (function(AttachmentFlags3) {
      AttachmentFlags3[AttachmentFlags3["IsRemix"] = 4] = "IsRemix";
    })(AttachmentFlags2 || (exports.AttachmentFlags = AttachmentFlags2 = {}));
    var AllowedMentionsTypes2;
    (function(AllowedMentionsTypes3) {
      AllowedMentionsTypes3["Everyone"] = "everyone";
      AllowedMentionsTypes3["Role"] = "roles";
      AllowedMentionsTypes3["User"] = "users";
    })(AllowedMentionsTypes2 || (exports.AllowedMentionsTypes = AllowedMentionsTypes2 = {}));
    var ComponentType2;
    (function(ComponentType3) {
      ComponentType3[ComponentType3["ActionRow"] = 1] = "ActionRow";
      ComponentType3[ComponentType3["Button"] = 2] = "Button";
      ComponentType3[ComponentType3["StringSelect"] = 3] = "StringSelect";
      ComponentType3[ComponentType3["TextInput"] = 4] = "TextInput";
      ComponentType3[ComponentType3["UserSelect"] = 5] = "UserSelect";
      ComponentType3[ComponentType3["RoleSelect"] = 6] = "RoleSelect";
      ComponentType3[ComponentType3["MentionableSelect"] = 7] = "MentionableSelect";
      ComponentType3[ComponentType3["ChannelSelect"] = 8] = "ChannelSelect";
      ComponentType3[ComponentType3["SelectMenu"] = 3] = "SelectMenu";
    })(ComponentType2 || (exports.ComponentType = ComponentType2 = {}));
    var ButtonStyle2;
    (function(ButtonStyle3) {
      ButtonStyle3[ButtonStyle3["Primary"] = 1] = "Primary";
      ButtonStyle3[ButtonStyle3["Secondary"] = 2] = "Secondary";
      ButtonStyle3[ButtonStyle3["Success"] = 3] = "Success";
      ButtonStyle3[ButtonStyle3["Danger"] = 4] = "Danger";
      ButtonStyle3[ButtonStyle3["Link"] = 5] = "Link";
      ButtonStyle3[ButtonStyle3["Premium"] = 6] = "Premium";
    })(ButtonStyle2 || (exports.ButtonStyle = ButtonStyle2 = {}));
    var TextInputStyle2;
    (function(TextInputStyle3) {
      TextInputStyle3[TextInputStyle3["Short"] = 1] = "Short";
      TextInputStyle3[TextInputStyle3["Paragraph"] = 2] = "Paragraph";
    })(TextInputStyle2 || (exports.TextInputStyle = TextInputStyle2 = {}));
    var SelectMenuDefaultValueType2;
    (function(SelectMenuDefaultValueType3) {
      SelectMenuDefaultValueType3["Channel"] = "channel";
      SelectMenuDefaultValueType3["Role"] = "role";
      SelectMenuDefaultValueType3["User"] = "user";
    })(SelectMenuDefaultValueType2 || (exports.SelectMenuDefaultValueType = SelectMenuDefaultValueType2 = {}));
    var ChannelFlags2;
    (function(ChannelFlags3) {
      ChannelFlags3[ChannelFlags3["GuildFeedRemoved"] = 1] = "GuildFeedRemoved";
      ChannelFlags3[ChannelFlags3["Pinned"] = 2] = "Pinned";
      ChannelFlags3[ChannelFlags3["ActiveChannelsRemoved"] = 4] = "ActiveChannelsRemoved";
      ChannelFlags3[ChannelFlags3["RequireTag"] = 16] = "RequireTag";
      ChannelFlags3[ChannelFlags3["IsSpam"] = 32] = "IsSpam";
      ChannelFlags3[ChannelFlags3["IsGuildResourceChannel"] = 128] = "IsGuildResourceChannel";
      ChannelFlags3[ChannelFlags3["ClydeAI"] = 256] = "ClydeAI";
      ChannelFlags3[ChannelFlags3["IsScheduledForDeletion"] = 512] = "IsScheduledForDeletion";
      ChannelFlags3[ChannelFlags3["HideMediaDownloadOptions"] = 32768] = "HideMediaDownloadOptions";
    })(ChannelFlags2 || (exports.ChannelFlags = ChannelFlags2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/emoji.js
var require_emoji = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/emoji.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/gateway.js
var require_gateway = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/gateway.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ActivityFlags = exports.ActivityType = exports.ActivityPlatform = exports.PresenceUpdateStatus = void 0;
    var PresenceUpdateStatus2;
    (function(PresenceUpdateStatus3) {
      PresenceUpdateStatus3["Online"] = "online";
      PresenceUpdateStatus3["DoNotDisturb"] = "dnd";
      PresenceUpdateStatus3["Idle"] = "idle";
      PresenceUpdateStatus3["Invisible"] = "invisible";
      PresenceUpdateStatus3["Offline"] = "offline";
    })(PresenceUpdateStatus2 || (exports.PresenceUpdateStatus = PresenceUpdateStatus2 = {}));
    var ActivityPlatform2;
    (function(ActivityPlatform3) {
      ActivityPlatform3["Desktop"] = "desktop";
      ActivityPlatform3["Xbox"] = "xbox";
      ActivityPlatform3["Samsung"] = "samsung";
      ActivityPlatform3["IOS"] = "ios";
      ActivityPlatform3["Android"] = "android";
      ActivityPlatform3["Embedded"] = "embedded";
      ActivityPlatform3["PS4"] = "ps4";
      ActivityPlatform3["PS5"] = "ps5";
    })(ActivityPlatform2 || (exports.ActivityPlatform = ActivityPlatform2 = {}));
    var ActivityType2;
    (function(ActivityType3) {
      ActivityType3[ActivityType3["Playing"] = 0] = "Playing";
      ActivityType3[ActivityType3["Streaming"] = 1] = "Streaming";
      ActivityType3[ActivityType3["Listening"] = 2] = "Listening";
      ActivityType3[ActivityType3["Watching"] = 3] = "Watching";
      ActivityType3[ActivityType3["Custom"] = 4] = "Custom";
      ActivityType3[ActivityType3["Competing"] = 5] = "Competing";
    })(ActivityType2 || (exports.ActivityType = ActivityType2 = {}));
    var ActivityFlags2;
    (function(ActivityFlags3) {
      ActivityFlags3[ActivityFlags3["Instance"] = 1] = "Instance";
      ActivityFlags3[ActivityFlags3["Join"] = 2] = "Join";
      ActivityFlags3[ActivityFlags3["Spectate"] = 4] = "Spectate";
      ActivityFlags3[ActivityFlags3["JoinRequest"] = 8] = "JoinRequest";
      ActivityFlags3[ActivityFlags3["Sync"] = 16] = "Sync";
      ActivityFlags3[ActivityFlags3["Play"] = 32] = "Play";
      ActivityFlags3[ActivityFlags3["PartyPrivacyFriends"] = 64] = "PartyPrivacyFriends";
      ActivityFlags3[ActivityFlags3["PartyPrivacyVoiceChannel"] = 128] = "PartyPrivacyVoiceChannel";
      ActivityFlags3[ActivityFlags3["Embedded"] = 256] = "Embedded";
    })(ActivityFlags2 || (exports.ActivityFlags = ActivityFlags2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/guild.js
var require_guild = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/guild.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GuildOnboardingPromptType = exports.GuildOnboardingMode = exports.MembershipScreeningFieldType = exports.GuildWidgetStyle = exports.IntegrationExpireBehavior = exports.GuildMemberFlags = exports.GuildFeature = exports.GuildSystemChannelFlags = exports.GuildHubType = exports.GuildPremiumTier = exports.GuildVerificationLevel = exports.GuildNSFWLevel = exports.GuildMFALevel = exports.GuildExplicitContentFilter = exports.GuildDefaultMessageNotifications = void 0;
    var GuildDefaultMessageNotifications2;
    (function(GuildDefaultMessageNotifications3) {
      GuildDefaultMessageNotifications3[GuildDefaultMessageNotifications3["AllMessages"] = 0] = "AllMessages";
      GuildDefaultMessageNotifications3[GuildDefaultMessageNotifications3["OnlyMentions"] = 1] = "OnlyMentions";
    })(GuildDefaultMessageNotifications2 || (exports.GuildDefaultMessageNotifications = GuildDefaultMessageNotifications2 = {}));
    var GuildExplicitContentFilter2;
    (function(GuildExplicitContentFilter3) {
      GuildExplicitContentFilter3[GuildExplicitContentFilter3["Disabled"] = 0] = "Disabled";
      GuildExplicitContentFilter3[GuildExplicitContentFilter3["MembersWithoutRoles"] = 1] = "MembersWithoutRoles";
      GuildExplicitContentFilter3[GuildExplicitContentFilter3["AllMembers"] = 2] = "AllMembers";
    })(GuildExplicitContentFilter2 || (exports.GuildExplicitContentFilter = GuildExplicitContentFilter2 = {}));
    var GuildMFALevel2;
    (function(GuildMFALevel3) {
      GuildMFALevel3[GuildMFALevel3["None"] = 0] = "None";
      GuildMFALevel3[GuildMFALevel3["Elevated"] = 1] = "Elevated";
    })(GuildMFALevel2 || (exports.GuildMFALevel = GuildMFALevel2 = {}));
    var GuildNSFWLevel2;
    (function(GuildNSFWLevel3) {
      GuildNSFWLevel3[GuildNSFWLevel3["Default"] = 0] = "Default";
      GuildNSFWLevel3[GuildNSFWLevel3["Explicit"] = 1] = "Explicit";
      GuildNSFWLevel3[GuildNSFWLevel3["Safe"] = 2] = "Safe";
      GuildNSFWLevel3[GuildNSFWLevel3["AgeRestricted"] = 3] = "AgeRestricted";
    })(GuildNSFWLevel2 || (exports.GuildNSFWLevel = GuildNSFWLevel2 = {}));
    var GuildVerificationLevel2;
    (function(GuildVerificationLevel3) {
      GuildVerificationLevel3[GuildVerificationLevel3["None"] = 0] = "None";
      GuildVerificationLevel3[GuildVerificationLevel3["Low"] = 1] = "Low";
      GuildVerificationLevel3[GuildVerificationLevel3["Medium"] = 2] = "Medium";
      GuildVerificationLevel3[GuildVerificationLevel3["High"] = 3] = "High";
      GuildVerificationLevel3[GuildVerificationLevel3["VeryHigh"] = 4] = "VeryHigh";
    })(GuildVerificationLevel2 || (exports.GuildVerificationLevel = GuildVerificationLevel2 = {}));
    var GuildPremiumTier2;
    (function(GuildPremiumTier3) {
      GuildPremiumTier3[GuildPremiumTier3["None"] = 0] = "None";
      GuildPremiumTier3[GuildPremiumTier3["Tier1"] = 1] = "Tier1";
      GuildPremiumTier3[GuildPremiumTier3["Tier2"] = 2] = "Tier2";
      GuildPremiumTier3[GuildPremiumTier3["Tier3"] = 3] = "Tier3";
    })(GuildPremiumTier2 || (exports.GuildPremiumTier = GuildPremiumTier2 = {}));
    var GuildHubType2;
    (function(GuildHubType3) {
      GuildHubType3[GuildHubType3["Default"] = 0] = "Default";
      GuildHubType3[GuildHubType3["HighSchool"] = 1] = "HighSchool";
      GuildHubType3[GuildHubType3["College"] = 2] = "College";
    })(GuildHubType2 || (exports.GuildHubType = GuildHubType2 = {}));
    var GuildSystemChannelFlags2;
    (function(GuildSystemChannelFlags3) {
      GuildSystemChannelFlags3[GuildSystemChannelFlags3["SuppressJoinNotifications"] = 1] = "SuppressJoinNotifications";
      GuildSystemChannelFlags3[GuildSystemChannelFlags3["SuppressPremiumSubscriptions"] = 2] = "SuppressPremiumSubscriptions";
      GuildSystemChannelFlags3[GuildSystemChannelFlags3["SuppressGuildReminderNotifications"] = 4] = "SuppressGuildReminderNotifications";
      GuildSystemChannelFlags3[GuildSystemChannelFlags3["SuppressJoinNotificationReplies"] = 8] = "SuppressJoinNotificationReplies";
      GuildSystemChannelFlags3[GuildSystemChannelFlags3["SuppressRoleSubscriptionPurchaseNotifications"] = 16] = "SuppressRoleSubscriptionPurchaseNotifications";
      GuildSystemChannelFlags3[GuildSystemChannelFlags3["SuppressRoleSubscriptionPurchaseNotificationReplies"] = 32] = "SuppressRoleSubscriptionPurchaseNotificationReplies";
    })(GuildSystemChannelFlags2 || (exports.GuildSystemChannelFlags = GuildSystemChannelFlags2 = {}));
    var GuildFeature2;
    (function(GuildFeature3) {
      GuildFeature3["AnimatedBanner"] = "ANIMATED_BANNER";
      GuildFeature3["AnimatedIcon"] = "ANIMATED_ICON";
      GuildFeature3["ApplicationCommandPermissionsV2"] = "APPLICATION_COMMAND_PERMISSIONS_V2";
      GuildFeature3["AutoModeration"] = "AUTO_MODERATION";
      GuildFeature3["Banner"] = "BANNER";
      GuildFeature3["Community"] = "COMMUNITY";
      GuildFeature3["CreatorMonetizableProvisional"] = "CREATOR_MONETIZABLE_PROVISIONAL";
      GuildFeature3["CreatorStorePage"] = "CREATOR_STORE_PAGE";
      GuildFeature3["DeveloperSupportServer"] = "DEVELOPER_SUPPORT_SERVER";
      GuildFeature3["Discoverable"] = "DISCOVERABLE";
      GuildFeature3["Featurable"] = "FEATURABLE";
      GuildFeature3["HasDirectoryEntry"] = "HAS_DIRECTORY_ENTRY";
      GuildFeature3["Hub"] = "HUB";
      GuildFeature3["InvitesDisabled"] = "INVITES_DISABLED";
      GuildFeature3["InviteSplash"] = "INVITE_SPLASH";
      GuildFeature3["LinkedToHub"] = "LINKED_TO_HUB";
      GuildFeature3["MemberVerificationGateEnabled"] = "MEMBER_VERIFICATION_GATE_ENABLED";
      GuildFeature3["MonetizationEnabled"] = "MONETIZATION_ENABLED";
      GuildFeature3["MoreStickers"] = "MORE_STICKERS";
      GuildFeature3["News"] = "NEWS";
      GuildFeature3["Partnered"] = "PARTNERED";
      GuildFeature3["PreviewEnabled"] = "PREVIEW_ENABLED";
      GuildFeature3["PrivateThreads"] = "PRIVATE_THREADS";
      GuildFeature3["RaidAlertsDisabled"] = "RAID_ALERTS_DISABLED";
      GuildFeature3["RelayEnabled"] = "RELAY_ENABLED";
      GuildFeature3["RoleIcons"] = "ROLE_ICONS";
      GuildFeature3["RoleSubscriptionsAvailableForPurchase"] = "ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE";
      GuildFeature3["RoleSubscriptionsEnabled"] = "ROLE_SUBSCRIPTIONS_ENABLED";
      GuildFeature3["TicketedEventsEnabled"] = "TICKETED_EVENTS_ENABLED";
      GuildFeature3["VanityURL"] = "VANITY_URL";
      GuildFeature3["Verified"] = "VERIFIED";
      GuildFeature3["VIPRegions"] = "VIP_REGIONS";
      GuildFeature3["WelcomeScreenEnabled"] = "WELCOME_SCREEN_ENABLED";
    })(GuildFeature2 || (exports.GuildFeature = GuildFeature2 = {}));
    var GuildMemberFlags2;
    (function(GuildMemberFlags3) {
      GuildMemberFlags3[GuildMemberFlags3["DidRejoin"] = 1] = "DidRejoin";
      GuildMemberFlags3[GuildMemberFlags3["CompletedOnboarding"] = 2] = "CompletedOnboarding";
      GuildMemberFlags3[GuildMemberFlags3["BypassesVerification"] = 4] = "BypassesVerification";
      GuildMemberFlags3[GuildMemberFlags3["StartedOnboarding"] = 8] = "StartedOnboarding";
      GuildMemberFlags3[GuildMemberFlags3["StartedHomeActions"] = 32] = "StartedHomeActions";
      GuildMemberFlags3[GuildMemberFlags3["CompletedHomeActions"] = 64] = "CompletedHomeActions";
      GuildMemberFlags3[GuildMemberFlags3["AutomodQuarantinedUsernameOrGuildNickname"] = 128] = "AutomodQuarantinedUsernameOrGuildNickname";
      GuildMemberFlags3[GuildMemberFlags3["AutomodQuarantinedBio"] = 256] = "AutomodQuarantinedBio";
    })(GuildMemberFlags2 || (exports.GuildMemberFlags = GuildMemberFlags2 = {}));
    var IntegrationExpireBehavior2;
    (function(IntegrationExpireBehavior3) {
      IntegrationExpireBehavior3[IntegrationExpireBehavior3["RemoveRole"] = 0] = "RemoveRole";
      IntegrationExpireBehavior3[IntegrationExpireBehavior3["Kick"] = 1] = "Kick";
    })(IntegrationExpireBehavior2 || (exports.IntegrationExpireBehavior = IntegrationExpireBehavior2 = {}));
    var GuildWidgetStyle2;
    (function(GuildWidgetStyle3) {
      GuildWidgetStyle3["Shield"] = "shield";
      GuildWidgetStyle3["Banner1"] = "banner1";
      GuildWidgetStyle3["Banner2"] = "banner2";
      GuildWidgetStyle3["Banner3"] = "banner3";
      GuildWidgetStyle3["Banner4"] = "banner4";
    })(GuildWidgetStyle2 || (exports.GuildWidgetStyle = GuildWidgetStyle2 = {}));
    var MembershipScreeningFieldType2;
    (function(MembershipScreeningFieldType3) {
      MembershipScreeningFieldType3["Terms"] = "TERMS";
    })(MembershipScreeningFieldType2 || (exports.MembershipScreeningFieldType = MembershipScreeningFieldType2 = {}));
    var GuildOnboardingMode2;
    (function(GuildOnboardingMode3) {
      GuildOnboardingMode3[GuildOnboardingMode3["OnboardingDefault"] = 0] = "OnboardingDefault";
      GuildOnboardingMode3[GuildOnboardingMode3["OnboardingAdvanced"] = 1] = "OnboardingAdvanced";
    })(GuildOnboardingMode2 || (exports.GuildOnboardingMode = GuildOnboardingMode2 = {}));
    var GuildOnboardingPromptType2;
    (function(GuildOnboardingPromptType3) {
      GuildOnboardingPromptType3[GuildOnboardingPromptType3["MultipleChoice"] = 0] = "MultipleChoice";
      GuildOnboardingPromptType3[GuildOnboardingPromptType3["Dropdown"] = 1] = "Dropdown";
    })(GuildOnboardingPromptType2 || (exports.GuildOnboardingPromptType = GuildOnboardingPromptType2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/guildScheduledEvent.js
var require_guildScheduledEvent = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/guildScheduledEvent.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GuildScheduledEventPrivacyLevel = exports.GuildScheduledEventStatus = exports.GuildScheduledEventEntityType = exports.GuildScheduledEventRecurrenceRuleMonth = exports.GuildScheduledEventRecurrenceRuleWeekday = exports.GuildScheduledEventRecurrenceRuleFrequency = void 0;
    var GuildScheduledEventRecurrenceRuleFrequency2;
    (function(GuildScheduledEventRecurrenceRuleFrequency3) {
      GuildScheduledEventRecurrenceRuleFrequency3[GuildScheduledEventRecurrenceRuleFrequency3["Yearly"] = 0] = "Yearly";
      GuildScheduledEventRecurrenceRuleFrequency3[GuildScheduledEventRecurrenceRuleFrequency3["Monthly"] = 1] = "Monthly";
      GuildScheduledEventRecurrenceRuleFrequency3[GuildScheduledEventRecurrenceRuleFrequency3["Weekly"] = 2] = "Weekly";
      GuildScheduledEventRecurrenceRuleFrequency3[GuildScheduledEventRecurrenceRuleFrequency3["Daily"] = 3] = "Daily";
    })(GuildScheduledEventRecurrenceRuleFrequency2 || (exports.GuildScheduledEventRecurrenceRuleFrequency = GuildScheduledEventRecurrenceRuleFrequency2 = {}));
    var GuildScheduledEventRecurrenceRuleWeekday2;
    (function(GuildScheduledEventRecurrenceRuleWeekday3) {
      GuildScheduledEventRecurrenceRuleWeekday3[GuildScheduledEventRecurrenceRuleWeekday3["Monday"] = 0] = "Monday";
      GuildScheduledEventRecurrenceRuleWeekday3[GuildScheduledEventRecurrenceRuleWeekday3["Tuesday"] = 1] = "Tuesday";
      GuildScheduledEventRecurrenceRuleWeekday3[GuildScheduledEventRecurrenceRuleWeekday3["Wednesday"] = 2] = "Wednesday";
      GuildScheduledEventRecurrenceRuleWeekday3[GuildScheduledEventRecurrenceRuleWeekday3["Thursday"] = 3] = "Thursday";
      GuildScheduledEventRecurrenceRuleWeekday3[GuildScheduledEventRecurrenceRuleWeekday3["Friday"] = 4] = "Friday";
      GuildScheduledEventRecurrenceRuleWeekday3[GuildScheduledEventRecurrenceRuleWeekday3["Saturday"] = 5] = "Saturday";
      GuildScheduledEventRecurrenceRuleWeekday3[GuildScheduledEventRecurrenceRuleWeekday3["Sunday"] = 6] = "Sunday";
    })(GuildScheduledEventRecurrenceRuleWeekday2 || (exports.GuildScheduledEventRecurrenceRuleWeekday = GuildScheduledEventRecurrenceRuleWeekday2 = {}));
    var GuildScheduledEventRecurrenceRuleMonth2;
    (function(GuildScheduledEventRecurrenceRuleMonth3) {
      GuildScheduledEventRecurrenceRuleMonth3[GuildScheduledEventRecurrenceRuleMonth3["January"] = 1] = "January";
      GuildScheduledEventRecurrenceRuleMonth3[GuildScheduledEventRecurrenceRuleMonth3["February"] = 2] = "February";
      GuildScheduledEventRecurrenceRuleMonth3[GuildScheduledEventRecurrenceRuleMonth3["March"] = 3] = "March";
      GuildScheduledEventRecurrenceRuleMonth3[GuildScheduledEventRecurrenceRuleMonth3["April"] = 4] = "April";
      GuildScheduledEventRecurrenceRuleMonth3[GuildScheduledEventRecurrenceRuleMonth3["May"] = 5] = "May";
      GuildScheduledEventRecurrenceRuleMonth3[GuildScheduledEventRecurrenceRuleMonth3["June"] = 6] = "June";
      GuildScheduledEventRecurrenceRuleMonth3[GuildScheduledEventRecurrenceRuleMonth3["July"] = 7] = "July";
      GuildScheduledEventRecurrenceRuleMonth3[GuildScheduledEventRecurrenceRuleMonth3["August"] = 8] = "August";
      GuildScheduledEventRecurrenceRuleMonth3[GuildScheduledEventRecurrenceRuleMonth3["September"] = 9] = "September";
      GuildScheduledEventRecurrenceRuleMonth3[GuildScheduledEventRecurrenceRuleMonth3["October"] = 10] = "October";
      GuildScheduledEventRecurrenceRuleMonth3[GuildScheduledEventRecurrenceRuleMonth3["November"] = 11] = "November";
      GuildScheduledEventRecurrenceRuleMonth3[GuildScheduledEventRecurrenceRuleMonth3["December"] = 12] = "December";
    })(GuildScheduledEventRecurrenceRuleMonth2 || (exports.GuildScheduledEventRecurrenceRuleMonth = GuildScheduledEventRecurrenceRuleMonth2 = {}));
    var GuildScheduledEventEntityType2;
    (function(GuildScheduledEventEntityType3) {
      GuildScheduledEventEntityType3[GuildScheduledEventEntityType3["StageInstance"] = 1] = "StageInstance";
      GuildScheduledEventEntityType3[GuildScheduledEventEntityType3["Voice"] = 2] = "Voice";
      GuildScheduledEventEntityType3[GuildScheduledEventEntityType3["External"] = 3] = "External";
    })(GuildScheduledEventEntityType2 || (exports.GuildScheduledEventEntityType = GuildScheduledEventEntityType2 = {}));
    var GuildScheduledEventStatus2;
    (function(GuildScheduledEventStatus3) {
      GuildScheduledEventStatus3[GuildScheduledEventStatus3["Scheduled"] = 1] = "Scheduled";
      GuildScheduledEventStatus3[GuildScheduledEventStatus3["Active"] = 2] = "Active";
      GuildScheduledEventStatus3[GuildScheduledEventStatus3["Completed"] = 3] = "Completed";
      GuildScheduledEventStatus3[GuildScheduledEventStatus3["Canceled"] = 4] = "Canceled";
    })(GuildScheduledEventStatus2 || (exports.GuildScheduledEventStatus = GuildScheduledEventStatus2 = {}));
    var GuildScheduledEventPrivacyLevel2;
    (function(GuildScheduledEventPrivacyLevel3) {
      GuildScheduledEventPrivacyLevel3[GuildScheduledEventPrivacyLevel3["GuildOnly"] = 2] = "GuildOnly";
    })(GuildScheduledEventPrivacyLevel2 || (exports.GuildScheduledEventPrivacyLevel = GuildScheduledEventPrivacyLevel2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/attachment.js
var require_attachment = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/attachment.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/base.js
var require_base = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/base.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/boolean.js
var require_boolean = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/boolean.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/channel.js
var require_channel2 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/channel.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/integer.js
var require_integer = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/integer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/mentionable.js
var require_mentionable = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/mentionable.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/number.js
var require_number = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/number.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/role.js
var require_role = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/role.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/shared.js
var require_shared = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/shared.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ApplicationCommandOptionType = void 0;
    var ApplicationCommandOptionType2;
    (function(ApplicationCommandOptionType3) {
      ApplicationCommandOptionType3[ApplicationCommandOptionType3["Subcommand"] = 1] = "Subcommand";
      ApplicationCommandOptionType3[ApplicationCommandOptionType3["SubcommandGroup"] = 2] = "SubcommandGroup";
      ApplicationCommandOptionType3[ApplicationCommandOptionType3["String"] = 3] = "String";
      ApplicationCommandOptionType3[ApplicationCommandOptionType3["Integer"] = 4] = "Integer";
      ApplicationCommandOptionType3[ApplicationCommandOptionType3["Boolean"] = 5] = "Boolean";
      ApplicationCommandOptionType3[ApplicationCommandOptionType3["User"] = 6] = "User";
      ApplicationCommandOptionType3[ApplicationCommandOptionType3["Channel"] = 7] = "Channel";
      ApplicationCommandOptionType3[ApplicationCommandOptionType3["Role"] = 8] = "Role";
      ApplicationCommandOptionType3[ApplicationCommandOptionType3["Mentionable"] = 9] = "Mentionable";
      ApplicationCommandOptionType3[ApplicationCommandOptionType3["Number"] = 10] = "Number";
      ApplicationCommandOptionType3[ApplicationCommandOptionType3["Attachment"] = 11] = "Attachment";
    })(ApplicationCommandOptionType2 || (exports.ApplicationCommandOptionType = ApplicationCommandOptionType2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/string.js
var require_string = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/string.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/subcommand.js
var require_subcommand = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/subcommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/subcommandGroup.js
var require_subcommandGroup = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/subcommandGroup.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/user.js
var require_user = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/user.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/chatInput.js
var require_chatInput = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/chatInput.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o2, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o2, k2, desc);
    } : function(o2, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o2[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p2 in m)
        if (p2 !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p2))
          __createBinding(exports2, m, p2);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_attachment(), exports);
    __exportStar(require_base(), exports);
    __exportStar(require_boolean(), exports);
    __exportStar(require_channel2(), exports);
    __exportStar(require_integer(), exports);
    __exportStar(require_mentionable(), exports);
    __exportStar(require_number(), exports);
    __exportStar(require_role(), exports);
    __exportStar(require_shared(), exports);
    __exportStar(require_string(), exports);
    __exportStar(require_subcommand(), exports);
    __exportStar(require_subcommandGroup(), exports);
    __exportStar(require_user(), exports);
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/contextMenu.js
var require_contextMenu = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/contextMenu.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/permissions.js
var require_permissions = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/permissions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.APIApplicationCommandPermissionsConstant = exports.ApplicationCommandPermissionType = void 0;
    var ApplicationCommandPermissionType2;
    (function(ApplicationCommandPermissionType3) {
      ApplicationCommandPermissionType3[ApplicationCommandPermissionType3["Role"] = 1] = "Role";
      ApplicationCommandPermissionType3[ApplicationCommandPermissionType3["User"] = 2] = "User";
      ApplicationCommandPermissionType3[ApplicationCommandPermissionType3["Channel"] = 3] = "Channel";
    })(ApplicationCommandPermissionType2 || (exports.ApplicationCommandPermissionType = ApplicationCommandPermissionType2 = {}));
    exports.APIApplicationCommandPermissionsConstant = {
      // eslint-disable-next-line unicorn/prefer-native-coercion-functions
      Everyone: (guildId) => String(guildId),
      AllChannels: (guildId) => String(BigInt(guildId) - 1n)
    };
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/applicationCommands.js
var require_applicationCommands = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/applicationCommands.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o2, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o2, k2, desc);
    } : function(o2, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o2[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p2 in m)
        if (p2 !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p2))
          __createBinding(exports2, m, p2);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InteractionContextType = exports.ApplicationIntegrationType = exports.ApplicationCommandType = void 0;
    __exportStar(require_chatInput(), exports);
    __exportStar(require_contextMenu(), exports);
    __exportStar(require_permissions(), exports);
    var ApplicationCommandType2;
    (function(ApplicationCommandType3) {
      ApplicationCommandType3[ApplicationCommandType3["ChatInput"] = 1] = "ChatInput";
      ApplicationCommandType3[ApplicationCommandType3["User"] = 2] = "User";
      ApplicationCommandType3[ApplicationCommandType3["Message"] = 3] = "Message";
    })(ApplicationCommandType2 || (exports.ApplicationCommandType = ApplicationCommandType2 = {}));
    var ApplicationIntegrationType2;
    (function(ApplicationIntegrationType3) {
      ApplicationIntegrationType3[ApplicationIntegrationType3["GuildInstall"] = 0] = "GuildInstall";
      ApplicationIntegrationType3[ApplicationIntegrationType3["UserInstall"] = 1] = "UserInstall";
    })(ApplicationIntegrationType2 || (exports.ApplicationIntegrationType = ApplicationIntegrationType2 = {}));
    var InteractionContextType2;
    (function(InteractionContextType3) {
      InteractionContextType3[InteractionContextType3["Guild"] = 0] = "Guild";
      InteractionContextType3[InteractionContextType3["BotDM"] = 1] = "BotDM";
      InteractionContextType3[InteractionContextType3["PrivateChannel"] = 2] = "PrivateChannel";
    })(InteractionContextType2 || (exports.InteractionContextType = InteractionContextType2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/autocomplete.js
var require_autocomplete = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/autocomplete.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/base.js
var require_base2 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/base.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/messageComponents.js
var require_messageComponents = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/messageComponents.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/modalSubmit.js
var require_modalSubmit = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/modalSubmit.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/ping.js
var require_ping = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/ping.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/responses.js
var require_responses = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/_interactions/responses.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InteractionResponseType = exports.InteractionType = void 0;
    var InteractionType2;
    (function(InteractionType3) {
      InteractionType3[InteractionType3["Ping"] = 1] = "Ping";
      InteractionType3[InteractionType3["ApplicationCommand"] = 2] = "ApplicationCommand";
      InteractionType3[InteractionType3["MessageComponent"] = 3] = "MessageComponent";
      InteractionType3[InteractionType3["ApplicationCommandAutocomplete"] = 4] = "ApplicationCommandAutocomplete";
      InteractionType3[InteractionType3["ModalSubmit"] = 5] = "ModalSubmit";
    })(InteractionType2 || (exports.InteractionType = InteractionType2 = {}));
    var InteractionResponseType2;
    (function(InteractionResponseType3) {
      InteractionResponseType3[InteractionResponseType3["Pong"] = 1] = "Pong";
      InteractionResponseType3[InteractionResponseType3["ChannelMessageWithSource"] = 4] = "ChannelMessageWithSource";
      InteractionResponseType3[InteractionResponseType3["DeferredChannelMessageWithSource"] = 5] = "DeferredChannelMessageWithSource";
      InteractionResponseType3[InteractionResponseType3["DeferredMessageUpdate"] = 6] = "DeferredMessageUpdate";
      InteractionResponseType3[InteractionResponseType3["UpdateMessage"] = 7] = "UpdateMessage";
      InteractionResponseType3[InteractionResponseType3["ApplicationCommandAutocompleteResult"] = 8] = "ApplicationCommandAutocompleteResult";
      InteractionResponseType3[InteractionResponseType3["Modal"] = 9] = "Modal";
      InteractionResponseType3[InteractionResponseType3["PremiumRequired"] = 10] = "PremiumRequired";
    })(InteractionResponseType2 || (exports.InteractionResponseType = InteractionResponseType2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/interactions.js
var require_interactions = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/interactions.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o2, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o2, k2, desc);
    } : function(o2, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o2[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p2 in m)
        if (p2 !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p2))
          __createBinding(exports2, m, p2);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_applicationCommands(), exports);
    __exportStar(require_autocomplete(), exports);
    __exportStar(require_base2(), exports);
    __exportStar(require_messageComponents(), exports);
    __exportStar(require_modalSubmit(), exports);
    __exportStar(require_ping(), exports);
    __exportStar(require_responses(), exports);
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/invite.js
var require_invite = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/invite.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InviteTargetType = exports.InviteType = void 0;
    var InviteType2;
    (function(InviteType3) {
      InviteType3[InviteType3["Guild"] = 0] = "Guild";
      InviteType3[InviteType3["GroupDM"] = 1] = "GroupDM";
      InviteType3[InviteType3["Friend"] = 2] = "Friend";
    })(InviteType2 || (exports.InviteType = InviteType2 = {}));
    var InviteTargetType2;
    (function(InviteTargetType3) {
      InviteTargetType3[InviteTargetType3["Stream"] = 1] = "Stream";
      InviteTargetType3[InviteTargetType3["EmbeddedApplication"] = 2] = "EmbeddedApplication";
    })(InviteTargetType2 || (exports.InviteTargetType = InviteTargetType2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/oauth2.js
var require_oauth2 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/oauth2.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OAuth2Scopes = void 0;
    var OAuth2Scopes2;
    (function(OAuth2Scopes3) {
      OAuth2Scopes3["Bot"] = "bot";
      OAuth2Scopes3["Connections"] = "connections";
      OAuth2Scopes3["DMChannelsRead"] = "dm_channels.read";
      OAuth2Scopes3["Email"] = "email";
      OAuth2Scopes3["Identify"] = "identify";
      OAuth2Scopes3["Guilds"] = "guilds";
      OAuth2Scopes3["GuildsJoin"] = "guilds.join";
      OAuth2Scopes3["GuildsMembersRead"] = "guilds.members.read";
      OAuth2Scopes3["GroupDMJoins"] = "gdm.join";
      OAuth2Scopes3["MessagesRead"] = "messages.read";
      OAuth2Scopes3["RoleConnectionsWrite"] = "role_connections.write";
      OAuth2Scopes3["RPC"] = "rpc";
      OAuth2Scopes3["RPCNotificationsRead"] = "rpc.notifications.read";
      OAuth2Scopes3["WebhookIncoming"] = "webhook.incoming";
      OAuth2Scopes3["Voice"] = "voice";
      OAuth2Scopes3["ApplicationsBuildsUpload"] = "applications.builds.upload";
      OAuth2Scopes3["ApplicationsBuildsRead"] = "applications.builds.read";
      OAuth2Scopes3["ApplicationsStoreUpdate"] = "applications.store.update";
      OAuth2Scopes3["ApplicationsEntitlements"] = "applications.entitlements";
      OAuth2Scopes3["RelationshipsRead"] = "relationships.read";
      OAuth2Scopes3["ActivitiesRead"] = "activities.read";
      OAuth2Scopes3["ActivitiesWrite"] = "activities.write";
      OAuth2Scopes3["ApplicationsCommands"] = "applications.commands";
      OAuth2Scopes3["ApplicationsCommandsUpdate"] = "applications.commands.update";
      OAuth2Scopes3["ApplicationCommandsPermissionsUpdate"] = "applications.commands.permissions.update";
    })(OAuth2Scopes2 || (exports.OAuth2Scopes = OAuth2Scopes2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/poll.js
var require_poll = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/poll.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PollLayoutType = void 0;
    var PollLayoutType2;
    (function(PollLayoutType3) {
      PollLayoutType3[PollLayoutType3["Default"] = 1] = "Default";
    })(PollLayoutType2 || (exports.PollLayoutType = PollLayoutType2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/permissions.js
var require_permissions2 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/permissions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RoleFlags = void 0;
    var RoleFlags2;
    (function(RoleFlags3) {
      RoleFlags3[RoleFlags3["InPrompt"] = 1] = "InPrompt";
    })(RoleFlags2 || (exports.RoleFlags = RoleFlags2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/stageInstance.js
var require_stageInstance = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/stageInstance.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StageInstancePrivacyLevel = void 0;
    var StageInstancePrivacyLevel2;
    (function(StageInstancePrivacyLevel3) {
      StageInstancePrivacyLevel3[StageInstancePrivacyLevel3["Public"] = 1] = "Public";
      StageInstancePrivacyLevel3[StageInstancePrivacyLevel3["GuildOnly"] = 2] = "GuildOnly";
    })(StageInstancePrivacyLevel2 || (exports.StageInstancePrivacyLevel = StageInstancePrivacyLevel2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/sticker.js
var require_sticker = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/sticker.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StickerFormatType = exports.StickerType = void 0;
    var StickerType2;
    (function(StickerType3) {
      StickerType3[StickerType3["Standard"] = 1] = "Standard";
      StickerType3[StickerType3["Guild"] = 2] = "Guild";
    })(StickerType2 || (exports.StickerType = StickerType2 = {}));
    var StickerFormatType2;
    (function(StickerFormatType3) {
      StickerFormatType3[StickerFormatType3["PNG"] = 1] = "PNG";
      StickerFormatType3[StickerFormatType3["APNG"] = 2] = "APNG";
      StickerFormatType3[StickerFormatType3["Lottie"] = 3] = "Lottie";
      StickerFormatType3[StickerFormatType3["GIF"] = 4] = "GIF";
    })(StickerFormatType2 || (exports.StickerFormatType = StickerFormatType2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/teams.js
var require_teams = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/teams.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TeamMemberRole = exports.TeamMemberMembershipState = void 0;
    var TeamMemberMembershipState2;
    (function(TeamMemberMembershipState3) {
      TeamMemberMembershipState3[TeamMemberMembershipState3["Invited"] = 1] = "Invited";
      TeamMemberMembershipState3[TeamMemberMembershipState3["Accepted"] = 2] = "Accepted";
    })(TeamMemberMembershipState2 || (exports.TeamMemberMembershipState = TeamMemberMembershipState2 = {}));
    var TeamMemberRole2;
    (function(TeamMemberRole3) {
      TeamMemberRole3["Admin"] = "admin";
      TeamMemberRole3["Developer"] = "developer";
      TeamMemberRole3["ReadOnly"] = "read_only";
    })(TeamMemberRole2 || (exports.TeamMemberRole = TeamMemberRole2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/template.js
var require_template = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/template.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/user.js
var require_user2 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/user.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ConnectionVisibility = exports.ConnectionService = exports.UserPremiumType = exports.UserFlags = void 0;
    var UserFlags2;
    (function(UserFlags3) {
      UserFlags3[UserFlags3["Staff"] = 1] = "Staff";
      UserFlags3[UserFlags3["Partner"] = 2] = "Partner";
      UserFlags3[UserFlags3["Hypesquad"] = 4] = "Hypesquad";
      UserFlags3[UserFlags3["BugHunterLevel1"] = 8] = "BugHunterLevel1";
      UserFlags3[UserFlags3["MFASMS"] = 16] = "MFASMS";
      UserFlags3[UserFlags3["PremiumPromoDismissed"] = 32] = "PremiumPromoDismissed";
      UserFlags3[UserFlags3["HypeSquadOnlineHouse1"] = 64] = "HypeSquadOnlineHouse1";
      UserFlags3[UserFlags3["HypeSquadOnlineHouse2"] = 128] = "HypeSquadOnlineHouse2";
      UserFlags3[UserFlags3["HypeSquadOnlineHouse3"] = 256] = "HypeSquadOnlineHouse3";
      UserFlags3[UserFlags3["PremiumEarlySupporter"] = 512] = "PremiumEarlySupporter";
      UserFlags3[UserFlags3["TeamPseudoUser"] = 1024] = "TeamPseudoUser";
      UserFlags3[UserFlags3["HasUnreadUrgentMessages"] = 8192] = "HasUnreadUrgentMessages";
      UserFlags3[UserFlags3["BugHunterLevel2"] = 16384] = "BugHunterLevel2";
      UserFlags3[UserFlags3["VerifiedBot"] = 65536] = "VerifiedBot";
      UserFlags3[UserFlags3["VerifiedDeveloper"] = 131072] = "VerifiedDeveloper";
      UserFlags3[UserFlags3["CertifiedModerator"] = 262144] = "CertifiedModerator";
      UserFlags3[UserFlags3["BotHTTPInteractions"] = 524288] = "BotHTTPInteractions";
      UserFlags3[UserFlags3["Spammer"] = 1048576] = "Spammer";
      UserFlags3[UserFlags3["DisablePremium"] = 2097152] = "DisablePremium";
      UserFlags3[UserFlags3["ActiveDeveloper"] = 4194304] = "ActiveDeveloper";
      UserFlags3[UserFlags3["Quarantined"] = 17592186044416] = "Quarantined";
      UserFlags3[UserFlags3["Collaborator"] = 1125899906842624] = "Collaborator";
      UserFlags3[UserFlags3["RestrictedCollaborator"] = 2251799813685248] = "RestrictedCollaborator";
    })(UserFlags2 || (exports.UserFlags = UserFlags2 = {}));
    var UserPremiumType2;
    (function(UserPremiumType3) {
      UserPremiumType3[UserPremiumType3["None"] = 0] = "None";
      UserPremiumType3[UserPremiumType3["NitroClassic"] = 1] = "NitroClassic";
      UserPremiumType3[UserPremiumType3["Nitro"] = 2] = "Nitro";
      UserPremiumType3[UserPremiumType3["NitroBasic"] = 3] = "NitroBasic";
    })(UserPremiumType2 || (exports.UserPremiumType = UserPremiumType2 = {}));
    var ConnectionService2;
    (function(ConnectionService3) {
      ConnectionService3["BattleNet"] = "battlenet";
      ConnectionService3["BungieNet"] = "bungie";
      ConnectionService3["Domain"] = "domain";
      ConnectionService3["eBay"] = "ebay";
      ConnectionService3["EpicGames"] = "epicgames";
      ConnectionService3["Facebook"] = "facebook";
      ConnectionService3["GitHub"] = "github";
      ConnectionService3["Instagram"] = "instagram";
      ConnectionService3["LeagueOfLegends"] = "leagueoflegends";
      ConnectionService3["PayPal"] = "paypal";
      ConnectionService3["PlayStationNetwork"] = "playstation";
      ConnectionService3["Reddit"] = "reddit";
      ConnectionService3["RiotGames"] = "riotgames";
      ConnectionService3["Roblox"] = "roblox";
      ConnectionService3["Spotify"] = "spotify";
      ConnectionService3["Skype"] = "skype";
      ConnectionService3["Steam"] = "steam";
      ConnectionService3["TikTok"] = "tiktok";
      ConnectionService3["Twitch"] = "twitch";
      ConnectionService3["X"] = "twitter";
      ConnectionService3["Twitter"] = "twitter";
      ConnectionService3["Xbox"] = "xbox";
      ConnectionService3["YouTube"] = "youtube";
    })(ConnectionService2 || (exports.ConnectionService = ConnectionService2 = {}));
    var ConnectionVisibility2;
    (function(ConnectionVisibility3) {
      ConnectionVisibility3[ConnectionVisibility3["None"] = 0] = "None";
      ConnectionVisibility3[ConnectionVisibility3["Everyone"] = 1] = "Everyone";
    })(ConnectionVisibility2 || (exports.ConnectionVisibility = ConnectionVisibility2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/voice.js
var require_voice = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/voice.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/webhook.js
var require_webhook = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/webhook.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebhookType = void 0;
    var WebhookType2;
    (function(WebhookType3) {
      WebhookType3[WebhookType3["Incoming"] = 1] = "Incoming";
      WebhookType3[WebhookType3["ChannelFollower"] = 2] = "ChannelFollower";
      WebhookType3[WebhookType3["Application"] = 3] = "Application";
    })(WebhookType2 || (exports.WebhookType = WebhookType2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/monetization.js
var require_monetization = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/monetization.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SKUType = exports.SKUFlags = exports.EntitlementType = void 0;
    var EntitlementType2;
    (function(EntitlementType3) {
      EntitlementType3[EntitlementType3["Purchase"] = 1] = "Purchase";
      EntitlementType3[EntitlementType3["PremiumSubscription"] = 2] = "PremiumSubscription";
      EntitlementType3[EntitlementType3["DeveloperGift"] = 3] = "DeveloperGift";
      EntitlementType3[EntitlementType3["TestModePurchase"] = 4] = "TestModePurchase";
      EntitlementType3[EntitlementType3["FreePurchase"] = 5] = "FreePurchase";
      EntitlementType3[EntitlementType3["UserGift"] = 6] = "UserGift";
      EntitlementType3[EntitlementType3["PremiumPurchase"] = 7] = "PremiumPurchase";
      EntitlementType3[EntitlementType3["ApplicationSubscription"] = 8] = "ApplicationSubscription";
    })(EntitlementType2 || (exports.EntitlementType = EntitlementType2 = {}));
    var SKUFlags2;
    (function(SKUFlags3) {
      SKUFlags3[SKUFlags3["Available"] = 4] = "Available";
      SKUFlags3[SKUFlags3["GuildSubscription"] = 128] = "GuildSubscription";
      SKUFlags3[SKUFlags3["UserSubscription"] = 256] = "UserSubscription";
    })(SKUFlags2 || (exports.SKUFlags = SKUFlags2 = {}));
    var SKUType2;
    (function(SKUType3) {
      SKUType3[SKUType3["Durable"] = 2] = "Durable";
      SKUType3[SKUType3["Consumable"] = 3] = "Consumable";
      SKUType3[SKUType3["Subscription"] = 5] = "Subscription";
      SKUType3[SKUType3["SubscriptionGroup"] = 6] = "SubscriptionGroup";
    })(SKUType2 || (exports.SKUType = SKUType2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/index.js
var require_v102 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/payloads/v10/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o2, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o2, k2, desc);
    } : function(o2, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o2[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p2 in m)
        if (p2 !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p2))
          __createBinding(exports2, m, p2);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_common2(), exports);
    __exportStar(require_application(), exports);
    __exportStar(require_auditLog(), exports);
    __exportStar(require_autoModeration(), exports);
    __exportStar(require_channel(), exports);
    __exportStar(require_emoji(), exports);
    __exportStar(require_gateway(), exports);
    __exportStar(require_guild(), exports);
    __exportStar(require_guildScheduledEvent(), exports);
    __exportStar(require_interactions(), exports);
    __exportStar(require_invite(), exports);
    __exportStar(require_oauth2(), exports);
    __exportStar(require_poll(), exports);
    __exportStar(require_permissions2(), exports);
    __exportStar(require_stageInstance(), exports);
    __exportStar(require_sticker(), exports);
    __exportStar(require_teams(), exports);
    __exportStar(require_template(), exports);
    __exportStar(require_user2(), exports);
    __exportStar(require_voice(), exports);
    __exportStar(require_webhook(), exports);
    __exportStar(require_monetization(), exports);
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/common.js
var require_common3 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/common.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Locale = exports.RESTJSONErrorCodes = void 0;
    var RESTJSONErrorCodes2;
    (function(RESTJSONErrorCodes3) {
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["GeneralError"] = 0] = "GeneralError";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownAccount"] = 10001] = "UnknownAccount";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownApplication"] = 10002] = "UnknownApplication";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownChannel"] = 10003] = "UnknownChannel";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownGuild"] = 10004] = "UnknownGuild";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownIntegration"] = 10005] = "UnknownIntegration";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownInvite"] = 10006] = "UnknownInvite";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownMember"] = 10007] = "UnknownMember";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownMessage"] = 10008] = "UnknownMessage";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownPermissionOverwrite"] = 10009] = "UnknownPermissionOverwrite";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownProvider"] = 10010] = "UnknownProvider";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownRole"] = 10011] = "UnknownRole";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownToken"] = 10012] = "UnknownToken";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownUser"] = 10013] = "UnknownUser";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownEmoji"] = 10014] = "UnknownEmoji";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownWebhook"] = 10015] = "UnknownWebhook";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownWebhookService"] = 10016] = "UnknownWebhookService";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownSession"] = 10020] = "UnknownSession";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownBan"] = 10026] = "UnknownBan";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownSKU"] = 10027] = "UnknownSKU";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownStoreListing"] = 10028] = "UnknownStoreListing";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownEntitlement"] = 10029] = "UnknownEntitlement";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownBuild"] = 10030] = "UnknownBuild";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownLobby"] = 10031] = "UnknownLobby";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownBranch"] = 10032] = "UnknownBranch";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownStoreDirectoryLayout"] = 10033] = "UnknownStoreDirectoryLayout";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownRedistributable"] = 10036] = "UnknownRedistributable";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownGiftCode"] = 10038] = "UnknownGiftCode";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownStream"] = 10049] = "UnknownStream";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownPremiumServerSubscribeCooldown"] = 10050] = "UnknownPremiumServerSubscribeCooldown";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownGuildTemplate"] = 10057] = "UnknownGuildTemplate";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownDiscoverableServerCategory"] = 10059] = "UnknownDiscoverableServerCategory";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownSticker"] = 10060] = "UnknownSticker";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownStickerPack"] = 10061] = "UnknownStickerPack";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownInteraction"] = 10062] = "UnknownInteraction";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownApplicationCommand"] = 10063] = "UnknownApplicationCommand";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownVoiceState"] = 10065] = "UnknownVoiceState";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownApplicationCommandPermissions"] = 10066] = "UnknownApplicationCommandPermissions";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownStageInstance"] = 10067] = "UnknownStageInstance";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownGuildMemberVerificationForm"] = 10068] = "UnknownGuildMemberVerificationForm";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownGuildWelcomeScreen"] = 10069] = "UnknownGuildWelcomeScreen";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownGuildScheduledEvent"] = 10070] = "UnknownGuildScheduledEvent";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownGuildScheduledEventUser"] = 10071] = "UnknownGuildScheduledEventUser";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnknownTag"] = 10087] = "UnknownTag";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["BotsCannotUseThisEndpoint"] = 20001] = "BotsCannotUseThisEndpoint";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["OnlyBotsCanUseThisEndpoint"] = 20002] = "OnlyBotsCanUseThisEndpoint";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["ExplicitContentCannotBeSentToTheDesiredRecipient"] = 20009] = "ExplicitContentCannotBeSentToTheDesiredRecipient";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["NotAuthorizedToPerformThisActionOnThisApplication"] = 20012] = "NotAuthorizedToPerformThisActionOnThisApplication";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["ActionCannotBePerformedDueToSlowmodeRateLimit"] = 20016] = "ActionCannotBePerformedDueToSlowmodeRateLimit";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["TheMazeIsntMeantForYou"] = 20017] = "TheMazeIsntMeantForYou";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["OnlyTheOwnerOfThisAccountCanPerformThisAction"] = 20018] = "OnlyTheOwnerOfThisAccountCanPerformThisAction";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["AnnouncementEditLimitExceeded"] = 20022] = "AnnouncementEditLimitExceeded";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UnderMinimumAge"] = 20024] = "UnderMinimumAge";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["ChannelSendRateLimit"] = 20028] = "ChannelSendRateLimit";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["ServerSendRateLimit"] = 20029] = "ServerSendRateLimit";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["StageTopicServerNameServerDescriptionOrChannelNamesContainDisallowedWords"] = 20031] = "StageTopicServerNameServerDescriptionOrChannelNamesContainDisallowedWords";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["GuildPremiumSubscriptionLevelTooLow"] = 20035] = "GuildPremiumSubscriptionLevelTooLow";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfGuildsReached"] = 30001] = "MaximumNumberOfGuildsReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfFriendsReached"] = 30002] = "MaximumNumberOfFriendsReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfPinsReachedForTheChannel"] = 30003] = "MaximumNumberOfPinsReachedForTheChannel";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfRecipientsReached"] = 30004] = "MaximumNumberOfRecipientsReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfGuildRolesReached"] = 30005] = "MaximumNumberOfGuildRolesReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfWebhooksReached"] = 30007] = "MaximumNumberOfWebhooksReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfEmojisReached"] = 30008] = "MaximumNumberOfEmojisReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfReactionsReached"] = 30010] = "MaximumNumberOfReactionsReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfGroupDMsReached"] = 30011] = "MaximumNumberOfGroupDMsReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfGuildChannelsReached"] = 30013] = "MaximumNumberOfGuildChannelsReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfAttachmentsInAMessageReached"] = 30015] = "MaximumNumberOfAttachmentsInAMessageReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfInvitesReached"] = 30016] = "MaximumNumberOfInvitesReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfAnimatedEmojisReached"] = 30018] = "MaximumNumberOfAnimatedEmojisReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfServerMembersReached"] = 30019] = "MaximumNumberOfServerMembersReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfServerCategoriesReached"] = 30030] = "MaximumNumberOfServerCategoriesReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["GuildAlreadyHasTemplate"] = 30031] = "GuildAlreadyHasTemplate";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfApplicationCommandsReached"] = 30032] = "MaximumNumberOfApplicationCommandsReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumThreadParticipantsReached"] = 30033] = "MaximumThreadParticipantsReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumDailyApplicationCommandCreatesReached"] = 30034] = "MaximumDailyApplicationCommandCreatesReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfNonGuildMemberBansHasBeenExceeded"] = 30035] = "MaximumNumberOfNonGuildMemberBansHasBeenExceeded";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfBanFetchesHasBeenReached"] = 30037] = "MaximumNumberOfBanFetchesHasBeenReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfUncompletedGuildScheduledEventsReached"] = 30038] = "MaximumNumberOfUncompletedGuildScheduledEventsReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfStickersReached"] = 30039] = "MaximumNumberOfStickersReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfPruneRequestsHasBeenReached"] = 30040] = "MaximumNumberOfPruneRequestsHasBeenReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfGuildWidgetSettingsUpdatesHasBeenReached"] = 30042] = "MaximumNumberOfGuildWidgetSettingsUpdatesHasBeenReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfEditsToMessagesOlderThanOneHourReached"] = 30046] = "MaximumNumberOfEditsToMessagesOlderThanOneHourReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfPinnedThreadsInForumHasBeenReached"] = 30047] = "MaximumNumberOfPinnedThreadsInForumHasBeenReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfTagsInForumHasBeenReached"] = 30048] = "MaximumNumberOfTagsInForumHasBeenReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["BitrateIsTooHighForChannelOfThisType"] = 30052] = "BitrateIsTooHighForChannelOfThisType";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfPremiumEmojisReached"] = 30056] = "MaximumNumberOfPremiumEmojisReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfWebhooksPerGuildReached"] = 30058] = "MaximumNumberOfWebhooksPerGuildReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumNumberOfChannelPermissionOverwritesReached"] = 30060] = "MaximumNumberOfChannelPermissionOverwritesReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["TheChannelsForThisGuildAreTooLarge"] = 30061] = "TheChannelsForThisGuildAreTooLarge";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["Unauthorized"] = 40001] = "Unauthorized";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["VerifyYourAccount"] = 40002] = "VerifyYourAccount";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["OpeningDirectMessagesTooFast"] = 40003] = "OpeningDirectMessagesTooFast";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["SendMessagesHasBeenTemporarilyDisabled"] = 40004] = "SendMessagesHasBeenTemporarilyDisabled";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["RequestEntityTooLarge"] = 40005] = "RequestEntityTooLarge";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["FeatureTemporarilyDisabledServerSide"] = 40006] = "FeatureTemporarilyDisabledServerSide";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UserBannedFromThisGuild"] = 40007] = "UserBannedFromThisGuild";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["ConnectionHasBeenRevoked"] = 40012] = "ConnectionHasBeenRevoked";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["TargetUserIsNotConnectedToVoice"] = 40032] = "TargetUserIsNotConnectedToVoice";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["ThisMessageWasAlreadyCrossposted"] = 40033] = "ThisMessageWasAlreadyCrossposted";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["ApplicationCommandWithThatNameAlreadyExists"] = 40041] = "ApplicationCommandWithThatNameAlreadyExists";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["ApplicationInteractionFailedToSend"] = 40043] = "ApplicationInteractionFailedToSend";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["CannotSendAMessageInAForumChannel"] = 40058] = "CannotSendAMessageInAForumChannel";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["InteractionHasAlreadyBeenAcknowledged"] = 40060] = "InteractionHasAlreadyBeenAcknowledged";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["TagNamesMustBeUnique"] = 40061] = "TagNamesMustBeUnique";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["ServiceResourceIsBeingRateLimited"] = 40062] = "ServiceResourceIsBeingRateLimited";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["ThereAreNoTagsAvailableThatCanBeSetByNonModerators"] = 40066] = "ThereAreNoTagsAvailableThatCanBeSetByNonModerators";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["TagRequiredToCreateAForumPostInThisChannel"] = 40067] = "TagRequiredToCreateAForumPostInThisChannel";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["AnEntitlementHasAlreadyBeenGrantedForThisResource"] = 40074] = "AnEntitlementHasAlreadyBeenGrantedForThisResource";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["CloudflareIsBlockingYourRequest"] = 40333] = "CloudflareIsBlockingYourRequest";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MissingAccess"] = 50001] = "MissingAccess";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["InvalidAccountType"] = 50002] = "InvalidAccountType";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["CannotExecuteActionOnDMChannel"] = 50003] = "CannotExecuteActionOnDMChannel";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["GuildWidgetDisabled"] = 50004] = "GuildWidgetDisabled";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["CannotEditMessageAuthoredByAnotherUser"] = 50005] = "CannotEditMessageAuthoredByAnotherUser";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["CannotSendAnEmptyMessage"] = 50006] = "CannotSendAnEmptyMessage";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["CannotSendMessagesToThisUser"] = 50007] = "CannotSendMessagesToThisUser";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["CannotSendMessagesInNonTextChannel"] = 50008] = "CannotSendMessagesInNonTextChannel";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["ChannelVerificationLevelTooHighForYouToGainAccess"] = 50009] = "ChannelVerificationLevelTooHighForYouToGainAccess";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["OAuth2ApplicationDoesNotHaveBot"] = 50010] = "OAuth2ApplicationDoesNotHaveBot";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["OAuth2ApplicationLimitReached"] = 50011] = "OAuth2ApplicationLimitReached";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["InvalidOAuth2State"] = 50012] = "InvalidOAuth2State";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MissingPermissions"] = 50013] = "MissingPermissions";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["InvalidToken"] = 50014] = "InvalidToken";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["NoteWasTooLong"] = 50015] = "NoteWasTooLong";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["ProvidedTooFewOrTooManyMessagesToDelete"] = 50016] = "ProvidedTooFewOrTooManyMessagesToDelete";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["InvalidMFALevel"] = 50017] = "InvalidMFALevel";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MessageCanOnlyBePinnedInTheChannelItWasSentIn"] = 50019] = "MessageCanOnlyBePinnedInTheChannelItWasSentIn";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["InviteCodeInvalidOrTaken"] = 50020] = "InviteCodeInvalidOrTaken";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["CannotExecuteActionOnSystemMessage"] = 50021] = "CannotExecuteActionOnSystemMessage";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["CannotExecuteActionOnThisChannelType"] = 50024] = "CannotExecuteActionOnThisChannelType";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["InvalidOAuth2AccessToken"] = 50025] = "InvalidOAuth2AccessToken";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MissingRequiredOAuth2Scope"] = 50026] = "MissingRequiredOAuth2Scope";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["InvalidWebhookToken"] = 50027] = "InvalidWebhookToken";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["InvalidRole"] = 50028] = "InvalidRole";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["InvalidRecipients"] = 50033] = "InvalidRecipients";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["OneOfTheMessagesProvidedWasTooOldForBulkDelete"] = 50034] = "OneOfTheMessagesProvidedWasTooOldForBulkDelete";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["InvalidFormBodyOrContentType"] = 50035] = "InvalidFormBodyOrContentType";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["InviteAcceptedToGuildWithoutTheBotBeingIn"] = 50036] = "InviteAcceptedToGuildWithoutTheBotBeingIn";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["InvalidActivityAction"] = 50039] = "InvalidActivityAction";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["InvalidAPIVersion"] = 50041] = "InvalidAPIVersion";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["FileUploadedExceedsMaximumSize"] = 50045] = "FileUploadedExceedsMaximumSize";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["InvalidFileUploaded"] = 50046] = "InvalidFileUploaded";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["CannotSelfRedeemThisGift"] = 50054] = "CannotSelfRedeemThisGift";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["InvalidGuild"] = 50055] = "InvalidGuild";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["InvalidSKU"] = 50057] = "InvalidSKU";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["InvalidRequestOrigin"] = 50067] = "InvalidRequestOrigin";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["InvalidMessageType"] = 50068] = "InvalidMessageType";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["PaymentSourceRequiredToRedeemGift"] = 50070] = "PaymentSourceRequiredToRedeemGift";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["CannotModifyASystemWebhook"] = 50073] = "CannotModifyASystemWebhook";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["CannotDeleteChannelRequiredForCommunityGuilds"] = 50074] = "CannotDeleteChannelRequiredForCommunityGuilds";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["CannotEditStickersWithinMessage"] = 50080] = "CannotEditStickersWithinMessage";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["InvalidStickerSent"] = 50081] = "InvalidStickerSent";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["InvalidActionOnArchivedThread"] = 50083] = "InvalidActionOnArchivedThread";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["InvalidThreadNotificationSettings"] = 50084] = "InvalidThreadNotificationSettings";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["ParameterEarlierThanCreation"] = 50085] = "ParameterEarlierThanCreation";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["CommunityServerChannelsMustBeTextChannels"] = 50086] = "CommunityServerChannelsMustBeTextChannels";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["TheEntityTypeOfTheEventIsDifferentFromTheEntityYouAreTryingToStartTheEventFor"] = 50091] = "TheEntityTypeOfTheEventIsDifferentFromTheEntityYouAreTryingToStartTheEventFor";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["ServerNotAvailableInYourLocation"] = 50095] = "ServerNotAvailableInYourLocation";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["ServerNeedsMonetizationEnabledToPerformThisAction"] = 50097] = "ServerNeedsMonetizationEnabledToPerformThisAction";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["ServerNeedsMoreBoostsToPerformThisAction"] = 50101] = "ServerNeedsMoreBoostsToPerformThisAction";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["RequestBodyContainsInvalidJSON"] = 50109] = "RequestBodyContainsInvalidJSON";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["OwnerCannotBePendingMember"] = 50131] = "OwnerCannotBePendingMember";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["OwnershipCannotBeMovedToABotUser"] = 50132] = "OwnershipCannotBeMovedToABotUser";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["FailedToResizeAssetBelowTheMinimumSize"] = 50138] = "FailedToResizeAssetBelowTheMinimumSize";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["CannotMixSubscriptionAndNonSubscriptionRolesForAnEmoji"] = 50144] = "CannotMixSubscriptionAndNonSubscriptionRolesForAnEmoji";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["CannotConvertBetweenPremiumEmojiAndNormalEmoji"] = 50145] = "CannotConvertBetweenPremiumEmojiAndNormalEmoji";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UploadedFileNotFound"] = 50146] = "UploadedFileNotFound";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["VoiceMessagesDoNotSupportAdditionalContent"] = 50159] = "VoiceMessagesDoNotSupportAdditionalContent";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["VoiceMessagesMustHaveASingleAudioAttachment"] = 50160] = "VoiceMessagesMustHaveASingleAudioAttachment";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["VoiceMessagesMustHaveSupportingMetadata"] = 50161] = "VoiceMessagesMustHaveSupportingMetadata";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["VoiceMessagesCannotBeEdited"] = 50162] = "VoiceMessagesCannotBeEdited";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["CannotDeleteGuildSubscriptionIntegration"] = 50163] = "CannotDeleteGuildSubscriptionIntegration";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["YouCannotSendVoiceMessagesInThisChannel"] = 50173] = "YouCannotSendVoiceMessagesInThisChannel";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["TheUserAccountMustFirstBeVerified"] = 50178] = "TheUserAccountMustFirstBeVerified";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["YouDoNotHavePermissionToSendThisSticker"] = 50600] = "YouDoNotHavePermissionToSendThisSticker";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["TwoFactorAuthenticationIsRequired"] = 60003] = "TwoFactorAuthenticationIsRequired";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["NoUsersWithDiscordTagExist"] = 80004] = "NoUsersWithDiscordTagExist";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["ReactionWasBlocked"] = 90001] = "ReactionWasBlocked";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UserCannotUseBurstReactions"] = 90002] = "UserCannotUseBurstReactions";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["ApplicationNotYetAvailable"] = 110001] = "ApplicationNotYetAvailable";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["APIResourceOverloaded"] = 13e4] = "APIResourceOverloaded";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["TheStageIsAlreadyOpen"] = 150006] = "TheStageIsAlreadyOpen";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["CannotReplyWithoutPermissionToReadMessageHistory"] = 160002] = "CannotReplyWithoutPermissionToReadMessageHistory";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["ThreadAlreadyCreatedForMessage"] = 160004] = "ThreadAlreadyCreatedForMessage";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["ThreadLocked"] = 160005] = "ThreadLocked";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumActiveThreads"] = 160006] = "MaximumActiveThreads";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MaximumActiveAnnouncementThreads"] = 160007] = "MaximumActiveAnnouncementThreads";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["InvalidJSONForUploadedLottieFile"] = 170001] = "InvalidJSONForUploadedLottieFile";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["UploadedLottiesCannotContainRasterizedImages"] = 170002] = "UploadedLottiesCannotContainRasterizedImages";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["StickerMaximumFramerateExceeded"] = 170003] = "StickerMaximumFramerateExceeded";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["StickerFrameCountExceedsMaximumOf1000Frames"] = 170004] = "StickerFrameCountExceedsMaximumOf1000Frames";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["LottieAnimationMaximumDimensionsExceeded"] = 170005] = "LottieAnimationMaximumDimensionsExceeded";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["StickerFramerateIsTooSmallOrTooLarge"] = 170006] = "StickerFramerateIsTooSmallOrTooLarge";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["StickerAnimationDurationExceedsMaximumOf5Seconds"] = 170007] = "StickerAnimationDurationExceedsMaximumOf5Seconds";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["CannotUpdateAFinishedEvent"] = 18e4] = "CannotUpdateAFinishedEvent";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["FailedToCreateStageNeededForStageEvent"] = 180002] = "FailedToCreateStageNeededForStageEvent";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MessageWasBlockedByAutomaticModeration"] = 2e5] = "MessageWasBlockedByAutomaticModeration";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["TitleWasBlockedByAutomaticModeration"] = 200001] = "TitleWasBlockedByAutomaticModeration";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["WebhooksPostedToForumChannelsMustHaveAThreadNameOrThreadId"] = 220001] = "WebhooksPostedToForumChannelsMustHaveAThreadNameOrThreadId";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["WebhooksPostedToForumChannelsCannotHaveBothAThreadNameAndThreadId"] = 220002] = "WebhooksPostedToForumChannelsCannotHaveBothAThreadNameAndThreadId";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["WebhooksCanOnlyCreateThreadsInForumChannels"] = 220003] = "WebhooksCanOnlyCreateThreadsInForumChannels";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["WebhookServicesCannotBeUsedInForumChannels"] = 220004] = "WebhookServicesCannotBeUsedInForumChannels";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["MessageBlockedByHarmfulLinksFilter"] = 24e4] = "MessageBlockedByHarmfulLinksFilter";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["CannotEnableOnboardingRequirementsAreNotMet"] = 35e4] = "CannotEnableOnboardingRequirementsAreNotMet";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["CannotUpdateOnboardingWhileBelowRequirements"] = 350001] = "CannotUpdateOnboardingWhileBelowRequirements";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["FailedToBanUsers"] = 5e5] = "FailedToBanUsers";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["PollVotingBlocked"] = 52e4] = "PollVotingBlocked";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["PollExpired"] = 520001] = "PollExpired";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["InvalidChannelTypeForPollCreation"] = 520002] = "InvalidChannelTypeForPollCreation";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["CannotEditAPollMessage"] = 520003] = "CannotEditAPollMessage";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["CannotUseAnEmojiIncludedWithThePoll"] = 520004] = "CannotUseAnEmojiIncludedWithThePoll";
      RESTJSONErrorCodes3[RESTJSONErrorCodes3["CannotExpireANonPollMessage"] = 520006] = "CannotExpireANonPollMessage";
    })(RESTJSONErrorCodes2 || (exports.RESTJSONErrorCodes = RESTJSONErrorCodes2 = {}));
    var Locale2;
    (function(Locale3) {
      Locale3["Indonesian"] = "id";
      Locale3["EnglishUS"] = "en-US";
      Locale3["EnglishGB"] = "en-GB";
      Locale3["Bulgarian"] = "bg";
      Locale3["ChineseCN"] = "zh-CN";
      Locale3["ChineseTW"] = "zh-TW";
      Locale3["Croatian"] = "hr";
      Locale3["Czech"] = "cs";
      Locale3["Danish"] = "da";
      Locale3["Dutch"] = "nl";
      Locale3["Finnish"] = "fi";
      Locale3["French"] = "fr";
      Locale3["German"] = "de";
      Locale3["Greek"] = "el";
      Locale3["Hindi"] = "hi";
      Locale3["Hungarian"] = "hu";
      Locale3["Italian"] = "it";
      Locale3["Japanese"] = "ja";
      Locale3["Korean"] = "ko";
      Locale3["Lithuanian"] = "lt";
      Locale3["Norwegian"] = "no";
      Locale3["Polish"] = "pl";
      Locale3["PortugueseBR"] = "pt-BR";
      Locale3["Romanian"] = "ro";
      Locale3["Russian"] = "ru";
      Locale3["SpanishES"] = "es-ES";
      Locale3["SpanishLATAM"] = "es-419";
      Locale3["Swedish"] = "sv-SE";
      Locale3["Thai"] = "th";
      Locale3["Turkish"] = "tr";
      Locale3["Ukrainian"] = "uk";
      Locale3["Vietnamese"] = "vi";
    })(Locale2 || (exports.Locale = Locale2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/application.js
var require_application2 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/application.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/auditLog.js
var require_auditLog2 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/auditLog.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/autoModeration.js
var require_autoModeration2 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/autoModeration.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/channel.js
var require_channel3 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/channel.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReactionType = void 0;
    var ReactionType2;
    (function(ReactionType3) {
      ReactionType3[ReactionType3["Normal"] = 0] = "Normal";
      ReactionType3[ReactionType3["Super"] = 1] = "Super";
    })(ReactionType2 || (exports.ReactionType = ReactionType2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/emoji.js
var require_emoji2 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/emoji.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/gateway.js
var require_gateway2 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/gateway.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/guild.js
var require_guild2 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/guild.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/guildScheduledEvent.js
var require_guildScheduledEvent2 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/guildScheduledEvent.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/interactions.js
var require_interactions2 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/interactions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/invite.js
var require_invite2 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/invite.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/oauth2.js
var require_oauth22 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/oauth2.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/poll.js
var require_poll2 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/poll.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/stageInstance.js
var require_stageInstance2 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/stageInstance.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/sticker.js
var require_sticker2 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/sticker.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/template.js
var require_template2 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/template.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/user.js
var require_user3 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/user.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/voice.js
var require_voice2 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/voice.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/webhook.js
var require_webhook2 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/webhook.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/monetization.js
var require_monetization2 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/monetization.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EntitlementOwnerType = void 0;
    var EntitlementOwnerType2;
    (function(EntitlementOwnerType3) {
      EntitlementOwnerType3[EntitlementOwnerType3["Guild"] = 1] = "Guild";
      EntitlementOwnerType3[EntitlementOwnerType3["User"] = 2] = "User";
    })(EntitlementOwnerType2 || (exports.EntitlementOwnerType = EntitlementOwnerType2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/index.js
var require_v103 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rest/v10/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o2, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o2, k2, desc);
    } : function(o2, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o2[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p2 in m)
        if (p2 !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p2))
          __createBinding(exports2, m, p2);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OAuth2Routes = exports.RouteBases = exports.CDNRoutes = exports.ImageFormat = exports.StickerPackApplicationId = exports.Routes = exports.APIVersion = void 0;
    __exportStar(require_common3(), exports);
    __exportStar(require_application2(), exports);
    __exportStar(require_auditLog2(), exports);
    __exportStar(require_autoModeration2(), exports);
    __exportStar(require_channel3(), exports);
    __exportStar(require_emoji2(), exports);
    __exportStar(require_gateway2(), exports);
    __exportStar(require_guild2(), exports);
    __exportStar(require_guildScheduledEvent2(), exports);
    __exportStar(require_interactions2(), exports);
    __exportStar(require_invite2(), exports);
    __exportStar(require_oauth22(), exports);
    __exportStar(require_poll2(), exports);
    __exportStar(require_stageInstance2(), exports);
    __exportStar(require_sticker2(), exports);
    __exportStar(require_template2(), exports);
    __exportStar(require_user3(), exports);
    __exportStar(require_voice2(), exports);
    __exportStar(require_webhook2(), exports);
    __exportStar(require_monetization2(), exports);
    exports.APIVersion = "10";
    exports.Routes = {
      /**
       * Route for:
       * - GET `/applications/{application.id}/role-connections/metadata`
       * - PUT `/applications/{application.id}/role-connections/metadata`
       */
      applicationRoleConnectionMetadata(applicationId) {
        return `/applications/${applicationId}/role-connections/metadata`;
      },
      /**
       * Route for:
       * - GET  `/guilds/{guild.id}/auto-moderation/rules`
       * - POST `/guilds/{guild.id}/auto-moderation/rules`
       */
      guildAutoModerationRules(guildId) {
        return `/guilds/${guildId}/auto-moderation/rules`;
      },
      /**
       * Routes for:
       * - GET    `/guilds/{guild.id}/auto-moderation/rules/{rule.id}`
       * - PATCH  `/guilds/{guild.id}/auto-moderation/rules/{rule.id}`
       * - DELETE `/guilds/{guild.id}/auto-moderation/rules/{rule.id}`
       */
      guildAutoModerationRule(guildId, ruleId) {
        return `/guilds/${guildId}/auto-moderation/rules/${ruleId}`;
      },
      /**
       * Route for:
       * - GET `/guilds/{guild.id}/audit-logs`
       */
      guildAuditLog(guildId) {
        return `/guilds/${guildId}/audit-logs`;
      },
      /**
       * Route for:
       * - GET    `/channels/{channel.id}`
       * - PATCH  `/channels/{channel.id}`
       * - DELETE `/channels/{channel.id}`
       */
      channel(channelId) {
        return `/channels/${channelId}`;
      },
      /**
       * Route for:
       * - GET  `/channels/{channel.id}/messages`
       * - POST `/channels/{channel.id}/messages`
       */
      channelMessages(channelId) {
        return `/channels/${channelId}/messages`;
      },
      /**
       * Route for:
       * - GET    `/channels/{channel.id}/messages/{message.id}`
       * - PATCH  `/channels/{channel.id}/messages/{message.id}`
       * - DELETE `/channels/{channel.id}/messages/{message.id}`
       */
      channelMessage(channelId, messageId) {
        return `/channels/${channelId}/messages/${messageId}`;
      },
      /**
       * Route for:
       * - POST `/channels/{channel.id}/messages/{message.id}/crosspost`
       */
      channelMessageCrosspost(channelId, messageId) {
        return `/channels/${channelId}/messages/${messageId}/crosspost`;
      },
      /**
       * Route for:
       * - PUT    `/channels/{channel.id}/messages/{message.id}/reactions/{emoji}/@me`
       * - DELETE `/channels/{channel.id}/messages/{message.id}/reactions/{emoji}/@me`
       *
       * **Note**: You need to URL encode the emoji yourself
       */
      channelMessageOwnReaction(channelId, messageId, emoji) {
        return `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`;
      },
      /**
       * Route for:
       * - DELETE `/channels/{channel.id}/messages/{message.id}/reactions/{emoji}/{user.id}`
       *
       * **Note**: You need to URL encode the emoji yourself
       */
      channelMessageUserReaction(channelId, messageId, emoji, userId) {
        return `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/${userId}`;
      },
      /**
       * Route for:
       * - GET    `/channels/{channel.id}/messages/{message.id}/reactions/{emoji}`
       * - DELETE `/channels/{channel.id}/messages/{message.id}/reactions/{emoji}`
       *
       * **Note**: You need to URL encode the emoji yourself
       */
      channelMessageReaction(channelId, messageId, emoji) {
        return `/channels/${channelId}/messages/${messageId}/reactions/${emoji}`;
      },
      /**
       * Route for:
       * - DELETE `/channels/{channel.id}/messages/{message.id}/reactions`
       */
      channelMessageAllReactions(channelId, messageId) {
        return `/channels/${channelId}/messages/${messageId}/reactions`;
      },
      /**
       * Route for:
       * - POST `/channels/{channel.id}/messages/bulk-delete`
       */
      channelBulkDelete(channelId) {
        return `/channels/${channelId}/messages/bulk-delete`;
      },
      /**
       * Route for:
       * - PUT    `/channels/{channel.id}/permissions/{overwrite.id}`
       * - DELETE `/channels/{channel.id}/permissions/{overwrite.id}`
       */
      channelPermission(channelId, overwriteId) {
        return `/channels/${channelId}/permissions/${overwriteId}`;
      },
      /**
       * Route for:
       * - GET  `/channels/{channel.id}/invites`
       * - POST `/channels/{channel.id}/invites`
       */
      channelInvites(channelId) {
        return `/channels/${channelId}/invites`;
      },
      /**
       * Route for:
       * - POST `/channels/{channel.id}/followers`
       */
      channelFollowers(channelId) {
        return `/channels/${channelId}/followers`;
      },
      /**
       * Route for:
       * - POST `/channels/{channel.id}/typing`
       */
      channelTyping(channelId) {
        return `/channels/${channelId}/typing`;
      },
      /**
       * Route for:
       * - GET `/channels/{channel.id}/pins`
       */
      channelPins(channelId) {
        return `/channels/${channelId}/pins`;
      },
      /**
       * Route for:
       * - PUT    `/channels/{channel.id}/pins/{message.id}`
       * - DELETE `/channels/{channel.id}/pins/{message.id}`
       */
      channelPin(channelId, messageId) {
        return `/channels/${channelId}/pins/${messageId}`;
      },
      /**
       * Route for:
       * - PUT    `/channels/{channel.id}/recipients/{user.id}`
       * - DELETE `/channels/{channel.id}/recipients/{user.id}`
       */
      channelRecipient(channelId, userId) {
        return `/channels/${channelId}/recipients/${userId}`;
      },
      /**
       * Route for:
       * - GET  `/guilds/{guild.id}/emojis`
       * - POST `/guilds/{guild.id}/emojis`
       */
      guildEmojis(guildId) {
        return `/guilds/${guildId}/emojis`;
      },
      /**
       * Route for:
       * - GET    `/guilds/{guild.id}/emojis/{emoji.id}`
       * - PATCH  `/guilds/{guild.id}/emojis/{emoji.id}`
       * - DELETE `/guilds/{guild.id}/emojis/{emoji.id}`
       */
      guildEmoji(guildId, emojiId) {
        return `/guilds/${guildId}/emojis/${emojiId}`;
      },
      /**
       * Route for:
       * - POST `/guilds`
       */
      guilds() {
        return "/guilds";
      },
      /**
       * Route for:
       * - GET    `/guilds/{guild.id}`
       * - PATCH  `/guilds/{guild.id}`
       * - DELETE `/guilds/{guild.id}`
       */
      guild(guildId) {
        return `/guilds/${guildId}`;
      },
      /**
       * Route for:
       * - GET `/guilds/{guild.id}/preview`
       */
      guildPreview(guildId) {
        return `/guilds/${guildId}/preview`;
      },
      /**
       * Route for:
       * - GET   `/guilds/{guild.id}/channels`
       * - POST  `/guilds/{guild.id}/channels`
       * - PATCH `/guilds/{guild.id}/channels`
       */
      guildChannels(guildId) {
        return `/guilds/${guildId}/channels`;
      },
      /**
       * Route for:
       * - GET    `/guilds/{guild.id}/members/{user.id}`
       * - PUT    `/guilds/{guild.id}/members/{user.id}`
       * - PATCH  `/guilds/{guild.id}/members/@me`
       * - PATCH  `/guilds/{guild.id}/members/{user.id}`
       * - DELETE `/guilds/{guild.id}/members/{user.id}`
       */
      guildMember(guildId, userId = "@me") {
        return `/guilds/${guildId}/members/${userId}`;
      },
      /**
       * Route for:
       * - GET `/guilds/{guild.id}/members`
       */
      guildMembers(guildId) {
        return `/guilds/${guildId}/members`;
      },
      /**
       * Route for:
       * - GET `/guilds/{guild.id}/members/search`
       */
      guildMembersSearch(guildId) {
        return `/guilds/${guildId}/members/search`;
      },
      /**
       * Route for:
       * - PATCH `/guilds/{guild.id}/members/@me/nick`
       *
       * @deprecated Use {@link Routes.guildMember} instead.
       */
      guildCurrentMemberNickname(guildId) {
        return `/guilds/${guildId}/members/@me/nick`;
      },
      /**
       * Route for:
       * - PUT    `/guilds/{guild.id}/members/{user.id}/roles/{role.id}`
       * - DELETE `/guilds/{guild.id}/members/{user.id}/roles/{role.id}`
       */
      guildMemberRole(guildId, memberId, roleId) {
        return `/guilds/${guildId}/members/${memberId}/roles/${roleId}`;
      },
      /**
       * Route for:
       * - POST `/guilds/{guild.id}/mfa`
       */
      guildMFA(guildId) {
        return `/guilds/${guildId}/mfa`;
      },
      /**
       * Route for:
       * - GET `/guilds/{guild.id}/bans`
       */
      guildBans(guildId) {
        return `/guilds/${guildId}/bans`;
      },
      /**
       * Route for:
       * - GET    `/guilds/{guild.id}/bans/{user.id}`
       * - PUT    `/guilds/{guild.id}/bans/{user.id}`
       * - DELETE `/guilds/{guild.id}/bans/{user.id}`
       */
      guildBan(guildId, userId) {
        return `/guilds/${guildId}/bans/${userId}`;
      },
      /**
       * Route for:
       * - GET   `/guilds/{guild.id}/roles`
       * - POST  `/guilds/{guild.id}/roles`
       * - PATCH `/guilds/{guild.id}/roles`
       */
      guildRoles(guildId) {
        return `/guilds/${guildId}/roles`;
      },
      /**
       * Route for:
       * - GET    `/guilds/{guild.id}/roles/{role.id}`
       * - PATCH  `/guilds/{guild.id}/roles/{role.id}`
       * - DELETE `/guilds/{guild.id}/roles/{role.id}`
       */
      guildRole(guildId, roleId) {
        return `/guilds/${guildId}/roles/${roleId}`;
      },
      /**
       * Route for:
       * - GET  `/guilds/{guild.id}/prune`
       * - POST `/guilds/{guild.id}/prune`
       */
      guildPrune(guildId) {
        return `/guilds/${guildId}/prune`;
      },
      /**
       * Route for:
       * - GET `/guilds/{guild.id}/regions`
       */
      guildVoiceRegions(guildId) {
        return `/guilds/${guildId}/regions`;
      },
      /**
       * Route for:
       * - GET `/guilds/{guild.id}/invites`
       */
      guildInvites(guildId) {
        return `/guilds/${guildId}/invites`;
      },
      /**
       * Route for:
       * - GET  `/guilds/{guild.id}/integrations`
       */
      guildIntegrations(guildId) {
        return `/guilds/${guildId}/integrations`;
      },
      /**
       * Route for:
       * - DELETE `/guilds/{guild.id}/integrations/{integration.id}`
       */
      guildIntegration(guildId, integrationId) {
        return `/guilds/${guildId}/integrations/${integrationId}`;
      },
      /**
       * Route for:
       * - GET   `/guilds/{guild.id}/widget`
       * - PATCH `/guilds/{guild.id}/widget`
       */
      guildWidgetSettings(guildId) {
        return `/guilds/${guildId}/widget`;
      },
      /**
       * Route for:
       * - GET `/guilds/{guild.id}/widget.json`
       */
      guildWidgetJSON(guildId) {
        return `/guilds/${guildId}/widget.json`;
      },
      /**
       * Route for:
       * - GET `/guilds/{guild.id}/vanity-url`
       */
      guildVanityUrl(guildId) {
        return `/guilds/${guildId}/vanity-url`;
      },
      /**
       * Route for:
       * - GET `/guilds/{guild.id}/widget.png`
       */
      guildWidgetImage(guildId) {
        return `/guilds/${guildId}/widget.png`;
      },
      /**
       * Route for:
       * - GET    `/invites/{invite.code}`
       * - DELETE `/invites/{invite.code}`
       */
      invite(code) {
        return `/invites/${code}`;
      },
      /**
       * Route for:
       * - GET  `/guilds/templates/{template.code}`
       * - POST `/guilds/templates/{template.code}`
       */
      template(code) {
        return `/guilds/templates/${code}`;
      },
      /**
       * Route for:
       * - GET  `/guilds/{guild.id}/templates`
       * - POST `/guilds/{guild.id}/templates`
       */
      guildTemplates(guildId) {
        return `/guilds/${guildId}/templates`;
      },
      /**
       * Route for:
       * - PUT    `/guilds/{guild.id}/templates/{template.code}`
       * - PATCH  `/guilds/{guild.id}/templates/{template.code}`
       * - DELETE `/guilds/{guild.id}/templates/{template.code}`
       */
      guildTemplate(guildId, code) {
        return `/guilds/${guildId}/templates/${code}`;
      },
      /**
       * Route for:
       * - GET `/channels/{channel.id}/polls/{message.id}/answers/{answer_id}`
       */
      pollAnswerVoters(channelId, messageId, answerId) {
        return `/channels/${channelId}/polls/${messageId}/answers/${answerId}`;
      },
      /**
       * Route for:
       * - POST `/channels/{channel.id}/polls/{message.id}/expire`
       */
      expirePoll(channelId, messageId) {
        return `/channels/${channelId}/polls/${messageId}/expire`;
      },
      /**
       * Route for:
       * - POST `/channels/{channel.id}/threads`
       * - POST `/channels/{channel.id}/messages/{message.id}/threads`
       */
      threads(parentId, messageId) {
        const parts = ["", "channels", parentId];
        if (messageId)
          parts.push("messages", messageId);
        parts.push("threads");
        return parts.join("/");
      },
      /**
       * Route for:
       * - GET `/guilds/{guild.id}/threads/active`
       */
      guildActiveThreads(guildId) {
        return `/guilds/${guildId}/threads/active`;
      },
      /**
       * Route for:
       * - GET `/channels/{channel.id}/threads/archived/public`
       * - GET `/channels/{channel.id}/threads/archived/private`
       */
      channelThreads(channelId, archivedStatus) {
        return `/channels/${channelId}/threads/archived/${archivedStatus}`;
      },
      /**
       * Route for:
       * - GET `/channels/{channel.id}/users/@me/threads/archived/private`
       */
      channelJoinedArchivedThreads(channelId) {
        return `/channels/${channelId}/users/@me/threads/archived/private`;
      },
      /**
       * Route for:
       * - GET    `/channels/{thread.id}/thread-members`
       * - GET    `/channels/{thread.id}/thread-members/{user.id}`
       * - PUT    `/channels/{thread.id}/thread-members/@me`
       * - PUT    `/channels/{thread.id}/thread-members/{user.id}`
       * - DELETE `/channels/{thread.id}/thread-members/@me`
       * - DELETE `/channels/{thread.id}/thread-members/{user.id}`
       */
      threadMembers(threadId, userId) {
        const parts = ["", "channels", threadId, "thread-members"];
        if (userId)
          parts.push(userId);
        return parts.join("/");
      },
      /**
       * Route for:
       * - GET   `/users/@me`
       * - GET   `/users/{user.id}`
       * - PATCH `/users/@me`
       *
       * @param [userId] The user ID, defaulted to `@me`
       */
      user(userId = "@me") {
        return `/users/${userId}`;
      },
      /**
       * Route for:
       * - GET `/users/@me/applications/{application.id}/role-connection`
       * - PUT `/users/@me/applications/{application.id}/role-connection`
       */
      userApplicationRoleConnection(applicationId) {
        return `/users/@me/applications/${applicationId}/role-connection`;
      },
      /**
       * Route for:
       * - GET `/users/@me/guilds`
       */
      userGuilds() {
        return `/users/@me/guilds`;
      },
      /**
       * Route for:
       * - GET `/users/@me/guilds/{guild.id}/member`
       */
      userGuildMember(guildId) {
        return `/users/@me/guilds/${guildId}/member`;
      },
      /**
       * Route for:
       * - DELETE `/users/@me/guilds/{guild.id}`
       */
      userGuild(guildId) {
        return `/users/@me/guilds/${guildId}`;
      },
      /**
       * Route for:
       * - POST `/users/@me/channels`
       */
      userChannels() {
        return `/users/@me/channels`;
      },
      /**
       * Route for:
       * - GET `/users/@me/connections`
       */
      userConnections() {
        return `/users/@me/connections`;
      },
      /**
       * Route for:
       * - GET `/voice/regions`
       */
      voiceRegions() {
        return `/voice/regions`;
      },
      /**
       * Route for:
       * - GET  `/channels/{channel.id}/webhooks`
       * - POST `/channels/{channel.id}/webhooks`
       */
      channelWebhooks(channelId) {
        return `/channels/${channelId}/webhooks`;
      },
      /**
       * Route for:
       * - GET `/guilds/{guild.id}/webhooks`
       */
      guildWebhooks(guildId) {
        return `/guilds/${guildId}/webhooks`;
      },
      /**
       * Route for:
       * - GET    `/webhooks/{webhook.id}`
       * - GET    `/webhooks/{webhook.id}/{webhook.token}`
       * - PATCH  `/webhooks/{webhook.id}`
       * - PATCH  `/webhooks/{webhook.id}/{webhook.token}`
       * - DELETE `/webhooks/{webhook.id}`
       * - DELETE `/webhooks/{webhook.id}/{webhook.token}`
       * - POST   `/webhooks/{webhook.id}/{webhook.token}`
       *
       * - POST   `/webhooks/{application.id}/{interaction.token}`
       */
      webhook(webhookId, webhookToken) {
        const parts = ["", "webhooks", webhookId];
        if (webhookToken)
          parts.push(webhookToken);
        return parts.join("/");
      },
      /**
       * Route for:
       * - GET    `/webhooks/{webhook.id}/{webhook.token}/messages/@original`
       * - GET    `/webhooks/{webhook.id}/{webhook.token}/messages/{message.id}`
       * - PATCH  `/webhooks/{webhook.id}/{webhook.token}/messages/@original`
       * - PATCH  `/webhooks/{webhook.id}/{webhook.token}/messages/{message.id}`
       * - DELETE `/webhooks/{webhook.id}/{webhook.token}/messages/@original`
       * - DELETE `/webhooks/{webhook.id}/{webhook.token}/messages/{message.id}`
       *
       * - PATCH  `/webhooks/{application.id}/{interaction.token}/messages/@original`
       * - PATCH  `/webhooks/{application.id}/{interaction.token}/messages/{message.id}`
       * - DELETE `/webhooks/{application.id}/{interaction.token}/messages/{message.id}`
       */
      webhookMessage(webhookId, webhookToken, messageId = "@original") {
        return `/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`;
      },
      /**
       * Route for:
       * - POST `/webhooks/{webhook.id}/{webhook.token}/github`
       * - POST `/webhooks/{webhook.id}/{webhook.token}/slack`
       */
      webhookPlatform(webhookId, webhookToken, platform) {
        return `/webhooks/${webhookId}/${webhookToken}/${platform}`;
      },
      /**
       * Route for:
       * - GET `/gateway`
       */
      gateway() {
        return `/gateway`;
      },
      /**
       * Route for:
       * - GET `/gateway/bot`
       */
      gatewayBot() {
        return `/gateway/bot`;
      },
      /**
       * Route for:
       * - GET `/oauth2/applications/@me`
       */
      oauth2CurrentApplication() {
        return `/oauth2/applications/@me`;
      },
      /**
       * Route for:
       * - GET `/oauth2/@me`
       */
      oauth2CurrentAuthorization() {
        return `/oauth2/@me`;
      },
      /**
       * Route for:
       * - GET `/oauth2/authorize`
       */
      oauth2Authorization() {
        return `/oauth2/authorize`;
      },
      /**
       * Route for:
       * - POST `/oauth2/token`
       */
      oauth2TokenExchange() {
        return `/oauth2/token`;
      },
      /**
       * Route for:
       * - POST `/oauth2/token/revoke`
       */
      oauth2TokenRevocation() {
        return `/oauth2/token/revoke`;
      },
      /**
       * Route for:
       * - GET  `/applications/{application.id}/commands`
       * - PUT  `/applications/{application.id}/commands`
       * - POST `/applications/{application.id}/commands`
       */
      applicationCommands(applicationId) {
        return `/applications/${applicationId}/commands`;
      },
      /**
       * Route for:
       * - GET    `/applications/{application.id}/commands/{command.id}`
       * - PATCH  `/applications/{application.id}/commands/{command.id}`
       * - DELETE `/applications/{application.id}/commands/{command.id}`
       */
      applicationCommand(applicationId, commandId) {
        return `/applications/${applicationId}/commands/${commandId}`;
      },
      /**
       * Route for:
       * - GET  `/applications/{application.id}/guilds/{guild.id}/commands`
       * - PUT  `/applications/{application.id}/guilds/{guild.id}/commands`
       * - POST `/applications/{application.id}/guilds/{guild.id}/commands`
       */
      applicationGuildCommands(applicationId, guildId) {
        return `/applications/${applicationId}/guilds/${guildId}/commands`;
      },
      /**
       * Route for:
       * - GET    `/applications/{application.id}/guilds/{guild.id}/commands/{command.id}`
       * - PATCH  `/applications/{application.id}/guilds/{guild.id}/commands/{command.id}`
       * - DELETE `/applications/{application.id}/guilds/{guild.id}/commands/{command.id}`
       */
      applicationGuildCommand(applicationId, guildId, commandId) {
        return `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`;
      },
      /**
       * Route for:
       * - POST `/interactions/{interaction.id}/{interaction.token}/callback`
       */
      interactionCallback(interactionId, interactionToken) {
        return `/interactions/${interactionId}/${interactionToken}/callback`;
      },
      /**
       * Route for:
       * - GET   `/guilds/{guild.id}/member-verification`
       * - PATCH `/guilds/{guild.id}/member-verification`
       */
      guildMemberVerification(guildId) {
        return `/guilds/${guildId}/member-verification`;
      },
      /**
       * Route for:
       * - GET `/guilds/{guild.id}/voice-states/@me`
       * - GET `/guilds/{guild.id}/voice-states/{user.id}`
       * - PATCH `/guilds/{guild.id}/voice-states/@me`
       * - PATCH `/guilds/{guild.id}/voice-states/{user.id}`
       */
      guildVoiceState(guildId, userId = "@me") {
        return `/guilds/${guildId}/voice-states/${userId}`;
      },
      /**
       * Route for:
       * - GET `/applications/{application.id}/guilds/{guild.id}/commands/permissions`
       * - PUT `/applications/{application.id}/guilds/{guild.id}/commands/permissions`
       */
      guildApplicationCommandsPermissions(applicationId, guildId) {
        return `/applications/${applicationId}/guilds/${guildId}/commands/permissions`;
      },
      /**
       * Route for:
       * - GET `/applications/{application.id}/guilds/{guild.id}/commands/{command.id}/permissions`
       * - PUT `/applications/{application.id}/guilds/{guild.id}/commands/{command.id}/permissions`
       */
      applicationCommandPermissions(applicationId, guildId, commandId) {
        return `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}/permissions`;
      },
      /**
       * Route for:
       * - GET   `/guilds/{guild.id}/welcome-screen`
       * - PATCH `/guilds/{guild.id}/welcome-screen`
       */
      guildWelcomeScreen(guildId) {
        return `/guilds/${guildId}/welcome-screen`;
      },
      /**
       * Route for:
       * - POST `/stage-instances`
       */
      stageInstances() {
        return `/stage-instances`;
      },
      /**
       * Route for:
       * - GET `/stage-instances/{channel.id}`
       * - PATCH `/stage-instances/{channel.id}`
       * - DELETE `/stage-instances/{channel.id}`
       */
      stageInstance(channelId) {
        return `/stage-instances/${channelId}`;
      },
      /**
       * Route for:
       * - GET `/stickers/{sticker.id}`
       */
      sticker(stickerId) {
        return `/stickers/${stickerId}`;
      },
      /**
       * Route for:
       * - GET `/sticker-packs`
       */
      stickerPacks() {
        return "/sticker-packs";
      },
      /**
       * Route for:
       * - GET `/sticker-packs/{pack.id}`
       */
      stickerPack(packId) {
        return `/sticker-packs/${packId}`;
      },
      /**
       * Route for:
       * - GET `/sticker-packs`
       *
       * @deprecated Use {@link Routes.stickerPacks} instead.
       */
      nitroStickerPacks() {
        return "/sticker-packs";
      },
      /**
       * Route for:
       * - GET  `/guilds/{guild.id}/stickers`
       * - POST `/guilds/{guild.id}/stickers`
       */
      guildStickers(guildId) {
        return `/guilds/${guildId}/stickers`;
      },
      /**
       * Route for:
       * - GET    `/guilds/{guild.id}/stickers/{sticker.id}`
       * - PATCH  `/guilds/{guild.id}/stickers/{sticker.id}`
       * - DELETE `/guilds/{guild.id}/stickers/{sticker.id}`
       */
      guildSticker(guildId, stickerId) {
        return `/guilds/${guildId}/stickers/${stickerId}`;
      },
      /**
       * Route for:
       * - GET  `/guilds/{guild.id}/scheduled-events`
       * - POST `/guilds/{guild.id}/scheduled-events`
       */
      guildScheduledEvents(guildId) {
        return `/guilds/${guildId}/scheduled-events`;
      },
      /**
       * Route for:
       * - GET  `/guilds/{guild.id}/scheduled-events/{guildScheduledEvent.id}`
       * - PATCH `/guilds/{guild.id}/scheduled-events/{guildScheduledEvent.id}`
       * - DELETE `/guilds/{guild.id}/scheduled-events/{guildScheduledEvent.id}`
       */
      guildScheduledEvent(guildId, guildScheduledEventId) {
        return `/guilds/${guildId}/scheduled-events/${guildScheduledEventId}`;
      },
      /**
       * Route for:
       * - GET `/guilds/{guild.id}/scheduled-events/{guildScheduledEvent.id}/users`
       */
      guildScheduledEventUsers(guildId, guildScheduledEventId) {
        return `/guilds/${guildId}/scheduled-events/${guildScheduledEventId}/users`;
      },
      /**
       * Route for:
       * - GET `/guilds/{guild.id}/onboarding`
       * - PUT `/guilds/{guild.id}/onboarding`
       */
      guildOnboarding(guildId) {
        return `/guilds/${guildId}/onboarding`;
      },
      /**
       * Route for:
       * - GET `/applications/@me`
       * - PATCH `/applications/@me`
       */
      currentApplication() {
        return "/applications/@me";
      },
      /**
       * Route for:
       * - GET `/applications/{application.id}/entitlements`
       * - POST `/applications/{application.id}/entitlements`
       */
      entitlements(applicationId) {
        return `/applications/${applicationId}/entitlements`;
      },
      /**
       * Route for:
       * - DELETE `/applications/{application.id}/entitlements/{entitlement.id}`
       */
      entitlement(applicationId, entitlementId) {
        return `/applications/${applicationId}/entitlements/${entitlementId}`;
      },
      /**
       * Route for:
       * - GET `/applications/{application.id}/skus`
       */
      skus(applicationId) {
        return `/applications/${applicationId}/skus`;
      },
      /**
       * Route for:
       * - POST `/guilds/{guild.id}/bulk-ban`
       */
      guildBulkBan(guildId) {
        return `/guilds/${guildId}/bulk-ban`;
      },
      /**
       * Route for:
       * - POST `/applications/{application.id}/entitlements/{entitlement.id}/consume`
       */
      consumeEntitlement(applicationId, entitlementId) {
        return `/applications/${applicationId}/entitlements/${entitlementId}/consume`;
      },
      /**
       * Route for:
       * - GET `/applications/{application.id}/emojis`
       * - POST `/applications/{application.id}/emojis`
       */
      applicationEmojis(applicationId) {
        return `/applications/${applicationId}/emojis`;
      },
      /**
       * Route for:
       * - GET `/applications/{application.id}/emojis/{emoji.id}`
       * - PATCH `/applications/{application.id}/emojis/{emoji.id}`
       * - DELETE `/applications/{application.id}/emojis/{emoji.id}`
       */
      applicationEmoji(applicationId, emojiId) {
        return `/applications/${applicationId}/emojis/${emojiId}`;
      }
    };
    exports.StickerPackApplicationId = "710982414301790216";
    var ImageFormat2;
    (function(ImageFormat3) {
      ImageFormat3["JPEG"] = "jpeg";
      ImageFormat3["PNG"] = "png";
      ImageFormat3["WebP"] = "webp";
      ImageFormat3["GIF"] = "gif";
      ImageFormat3["Lottie"] = "json";
    })(ImageFormat2 || (exports.ImageFormat = ImageFormat2 = {}));
    exports.CDNRoutes = {
      /**
       * Route for:
       * - GET `/emojis/{emoji.id}.{png|jpeg|webp|gif}`
       *
       * As this route supports GIFs, the hash will begin with `a_` if it is available in GIF format
       *
       * This route supports the extensions: PNG, JPEG, WebP, GIF
       */
      emoji(emojiId, format) {
        return `/emojis/${emojiId}.${format}`;
      },
      /**
       * Route for:
       * - GET `/icons/{guild.id}/{guild.icon}.{png|jpeg|webp|gif}`
       *
       * As this route supports GIFs, the hash will begin with `a_` if it is available in GIF format
       *
       * This route supports the extensions: PNG, JPEG, WebP, GIF
       */
      guildIcon(guildId, guildIcon, format) {
        return `/icons/${guildId}/${guildIcon}.${format}`;
      },
      /**
       * Route for:
       * - GET `/splashes/{guild.id}/{guild.splash}.{png|jpeg|webp}`
       *
       * This route supports the extensions: PNG, JPEG, WebP
       */
      guildSplash(guildId, guildSplash, format) {
        return `/splashes/${guildId}/${guildSplash}.${format}`;
      },
      /**
       * Route for:
       * - GET `/discovery-splashes/{guild.id}/{guild.discovery_splash}.{png|jpeg|webp}`
       *
       * This route supports the extensions: PNG, JPEG, WebP
       */
      guildDiscoverySplash(guildId, guildDiscoverySplash, format) {
        return `/discovery-splashes/${guildId}/${guildDiscoverySplash}.${format}`;
      },
      /**
       * Route for:
       * - GET `/banners/{guild.id}/{guild.banner}.{png|jpeg|webp|gif}`
       *
       * As this route supports GIFs, the hash will begin with `a_` if it is available in GIF format
       *
       * This route supports the extensions: PNG, JPEG, WebP, GIF
       */
      guildBanner(guildId, guildBanner, format) {
        return `/banners/${guildId}/${guildBanner}.${format}`;
      },
      /**
       * Route for:
       * - GET `/banners/{user.id}/{user.banner}.{png|jpeg|webp|gif}`
       *
       * As this route supports GIFs, the hash will begin with `a_` if it is available in GIF format
       *
       * This route supports the extensions: PNG, JPEG, WebP, GIF
       */
      userBanner(userId, userBanner, format) {
        return `/banners/${userId}/${userBanner}.${format}`;
      },
      /**
       * Route for:
       * - GET `/embed/avatars/{index}.png`
       *
       * The value for `index` parameter depends on whether the user is [migrated to the new username system](https://discord.com/developers/docs/change-log#unique-usernames-on-discord).
       * For users on the new username system, `index` will be `(user.id >> 22) % 6`.
       * For users on the legacy username system, `index` will be `user.discriminator % 5`.
       *
       * This route supports the extension: PNG
       */
      defaultUserAvatar(index) {
        return `/embed/avatars/${index}.png`;
      },
      /**
       * Route for:
       * - GET `/avatars/{user.id}/{user.avatar}.{png|jpeg|webp|gif}`
       *
       * As this route supports GIFs, the hash will begin with `a_` if it is available in GIF format
       *
       * This route supports the extensions: PNG, JPEG, WebP, GIF
       */
      userAvatar(userId, userAvatar, format) {
        return `/avatars/${userId}/${userAvatar}.${format}`;
      },
      /**
       * Route for:
       * - GET `/guilds/{guild.id}/users/{user.id}/avatars/{guild_member.avatar}.{png|jpeg|webp|gif}`
       *
       * As this route supports GIFs, the hash will begin with `a_` if it is available in GIF format
       *
       * This route supports the extensions: PNG, JPEG, WebP, GIF
       */
      guildMemberAvatar(guildId, userId, memberAvatar, format) {
        return `/guilds/${guildId}/users/${userId}/avatars/${memberAvatar}.${format}`;
      },
      /**
       * Route for:
       * - GET `/avatar-decorations/{user.id}/{user.avatar_decoration}.png`
       *
       * This route supports the extension: PNG
       *
       * @deprecated Use {@link CDNRoutes.avatarDecoration} instead.
       */
      userAvatarDecoration(userId, userAvatarDecoration) {
        return `/avatar-decorations/${userId}/${userAvatarDecoration}.png`;
      },
      /**
       * Route for:
       * - GET `/avatar-decoration-presets/{avatar_decoration_data_asset}.png`
       *
       * This route supports the extension: PNG
       */
      avatarDecoration(avatarDecorationDataAsset) {
        return `/avatar-decoration-presets/${avatarDecorationDataAsset}.png`;
      },
      /**
       * Route for:
       * - GET `/app-icons/{application.id}/{application.icon}.{png|jpeg|webp}`
       *
       * This route supports the extensions: PNG, JPEG, WebP
       */
      applicationIcon(applicationId, applicationIcon, format) {
        return `/app-icons/${applicationId}/${applicationIcon}.${format}`;
      },
      /**
       * Route for:
       * - GET `/app-icons/{application.id}/{application.cover_image}.{png|jpeg|webp}`
       *
       * This route supports the extensions: PNG, JPEG, WebP
       */
      applicationCover(applicationId, applicationCoverImage, format) {
        return `/app-icons/${applicationId}/${applicationCoverImage}.${format}`;
      },
      /**
       * Route for:
       * - GET `/app-assets/{application.id}/{application.asset_id}.{png|jpeg|webp}`
       *
       * This route supports the extensions: PNG, JPEG, WebP
       */
      applicationAsset(applicationId, applicationAssetId, format) {
        return `/app-assets/${applicationId}/${applicationAssetId}.${format}`;
      },
      /**
       * Route for:
       * - GET `/app-assets/{application.id}/achievements/{achievement.id}/icons/{achievement.icon}.{png|jpeg|webp}`
       *
       * This route supports the extensions: PNG, JPEG, WebP
       */
      achievementIcon(applicationId, achievementId, achievementIconHash, format) {
        return `/app-assets/${applicationId}/achievements/${achievementId}/icons/${achievementIconHash}.${format}`;
      },
      /**
       * Route for:
       * - GET `/app-assets/710982414301790216/store/{sticker_pack.banner.asset_id}.{png|jpeg|webp}`
       *
       * This route supports the extensions: PNG, JPEG, WebP
       */
      stickerPackBanner(stickerPackBannerAssetId, format) {
        return `/app-assets/${exports.StickerPackApplicationId}/store/${stickerPackBannerAssetId}.${format}`;
      },
      /**
       * Route for:
       * - GET `/app-assets/${application.id}/store/${asset.id}.{png|jpeg|webp}}`
       *
       * This route supports the extensions: PNG, JPEG, WebP
       */
      storePageAsset(applicationId, assetId, format = ImageFormat2.PNG) {
        return `/app-assets/${applicationId}/store/${assetId}.${format}`;
      },
      /**
       * Route for:
       * - GET `/team-icons/{team.id}/{team.icon}.{png|jpeg|webp}`
       *
       * This route supports the extensions: PNG, JPEG, WebP
       */
      teamIcon(teamId, teamIcon, format) {
        return `/team-icons/${teamId}/${teamIcon}.${format}`;
      },
      /**
       * Route for:
       * - GET `/stickers/{sticker.id}.{png|json}`
       *
       * This route supports the extensions: PNG, Lottie, GIF
       */
      sticker(stickerId, format) {
        return `/stickers/${stickerId}.${format}`;
      },
      /**
       * Route for:
       * - GET `/role-icons/{role.id}/{role.icon}.{png|jpeg|webp}`
       *
       * This route supports the extensions: PNG, JPEG, WebP
       */
      roleIcon(roleId, roleIcon, format) {
        return `/role-icons/${roleId}/${roleIcon}.${format}`;
      },
      /**
       * Route for:
       * - GET `/guild-events/{guild_scheduled_event.id}/{guild_scheduled_event.image}.{png|jpeg|webp}`
       *
       * This route supports the extensions: PNG, JPEG, WebP
       */
      guildScheduledEventCover(guildScheduledEventId, guildScheduledEventCoverImage, format) {
        return `/guild-events/${guildScheduledEventId}/${guildScheduledEventCoverImage}.${format}`;
      },
      /**
       * Route for:
       * - GET `/guilds/${guild.id}/users/${user.id}/banners/${guild_member.banner}.{png|jpeg|webp|gif}`
       *
       * This route supports the extensions: PNG, JPEG, WebP, GIF
       */
      guildMemberBanner(guildId, userId, guildMemberBanner, format) {
        return `/guilds/${guildId}/users/${userId}/banners/${guildMemberBanner}.${format}`;
      }
    };
    exports.RouteBases = {
      api: `https://discord.com/api/v${exports.APIVersion}`,
      cdn: "https://cdn.discordapp.com",
      media: "https://media.discordapp.net",
      invite: "https://discord.gg",
      template: "https://discord.new",
      gift: "https://discord.gift",
      scheduledEvent: "https://discord.com/events"
    };
    Object.freeze(exports.RouteBases);
    exports.OAuth2Routes = {
      authorizationURL: `${exports.RouteBases.api}${exports.Routes.oauth2Authorization()}`,
      tokenURL: `${exports.RouteBases.api}${exports.Routes.oauth2TokenExchange()}`,
      /**
       * See https://tools.ietf.org/html/rfc7009
       */
      tokenRevocationURL: `${exports.RouteBases.api}${exports.Routes.oauth2TokenRevocation()}`
    };
    Object.freeze(exports.OAuth2Routes);
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rpc/common.js
var require_common4 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rpc/common.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RPCCloseEventCodes = exports.RPCErrorCodes = void 0;
    var RPCErrorCodes2;
    (function(RPCErrorCodes3) {
      RPCErrorCodes3[RPCErrorCodes3["UnknownError"] = 1e3] = "UnknownError";
      RPCErrorCodes3[RPCErrorCodes3["InvalidPayload"] = 4e3] = "InvalidPayload";
      RPCErrorCodes3[RPCErrorCodes3["InvalidCommand"] = 4002] = "InvalidCommand";
      RPCErrorCodes3[RPCErrorCodes3["InvalidGuild"] = 4003] = "InvalidGuild";
      RPCErrorCodes3[RPCErrorCodes3["InvalidEvent"] = 4004] = "InvalidEvent";
      RPCErrorCodes3[RPCErrorCodes3["InvalidChannel"] = 4005] = "InvalidChannel";
      RPCErrorCodes3[RPCErrorCodes3["InvalidPermissions"] = 4006] = "InvalidPermissions";
      RPCErrorCodes3[RPCErrorCodes3["InvalidClientId"] = 4007] = "InvalidClientId";
      RPCErrorCodes3[RPCErrorCodes3["InvalidOrigin"] = 4008] = "InvalidOrigin";
      RPCErrorCodes3[RPCErrorCodes3["InvalidToken"] = 4009] = "InvalidToken";
      RPCErrorCodes3[RPCErrorCodes3["InvalidUser"] = 4010] = "InvalidUser";
      RPCErrorCodes3[RPCErrorCodes3["OAuth2Error"] = 5e3] = "OAuth2Error";
      RPCErrorCodes3[RPCErrorCodes3["SelectChannelTimedOut"] = 5001] = "SelectChannelTimedOut";
      RPCErrorCodes3[RPCErrorCodes3["GetGuildTimedOut"] = 5002] = "GetGuildTimedOut";
      RPCErrorCodes3[RPCErrorCodes3["SelectVoiceForceRequired"] = 5003] = "SelectVoiceForceRequired";
      RPCErrorCodes3[RPCErrorCodes3["CaptureShortcutAlreadyListening"] = 5004] = "CaptureShortcutAlreadyListening";
    })(RPCErrorCodes2 || (exports.RPCErrorCodes = RPCErrorCodes2 = {}));
    var RPCCloseEventCodes2;
    (function(RPCCloseEventCodes3) {
      RPCCloseEventCodes3[RPCCloseEventCodes3["InvalidClientId"] = 4e3] = "InvalidClientId";
      RPCCloseEventCodes3[RPCCloseEventCodes3["InvalidOrigin"] = 4001] = "InvalidOrigin";
      RPCCloseEventCodes3[RPCCloseEventCodes3["RateLimited"] = 4002] = "RateLimited";
      RPCCloseEventCodes3[RPCCloseEventCodes3["TokenRevoked"] = 4003] = "TokenRevoked";
      RPCCloseEventCodes3[RPCCloseEventCodes3["InvalidVersion"] = 4004] = "InvalidVersion";
      RPCCloseEventCodes3[RPCCloseEventCodes3["InvalidEncoding"] = 4005] = "InvalidEncoding";
    })(RPCCloseEventCodes2 || (exports.RPCCloseEventCodes = RPCCloseEventCodes2 = {}));
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rpc/v10.js
var require_v104 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/rpc/v10.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o2, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o2, k2, desc);
    } : function(o2, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o2[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p2 in m)
        if (p2 !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p2))
          __createBinding(exports2, m, p2);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_common4(), exports);
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/utils/v10.js
var require_v105 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/utils/v10.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isDMInteraction = isDMInteraction;
    exports.isGuildInteraction = isGuildInteraction;
    exports.isApplicationCommandDMInteraction = isApplicationCommandDMInteraction;
    exports.isApplicationCommandGuildInteraction = isApplicationCommandGuildInteraction;
    exports.isMessageComponentDMInteraction = isMessageComponentDMInteraction;
    exports.isMessageComponentGuildInteraction = isMessageComponentGuildInteraction;
    exports.isLinkButton = isLinkButton;
    exports.isInteractionButton = isInteractionButton;
    exports.isMessageComponentInteraction = isMessageComponentInteraction;
    exports.isMessageComponentButtonInteraction = isMessageComponentButtonInteraction;
    exports.isMessageComponentSelectMenuInteraction = isMessageComponentSelectMenuInteraction;
    exports.isChatInputApplicationCommandInteraction = isChatInputApplicationCommandInteraction;
    exports.isContextMenuApplicationCommandInteraction = isContextMenuApplicationCommandInteraction;
    var index_1 = require_v102();
    function isDMInteraction(interaction) {
      return Reflect.has(interaction, "user");
    }
    function isGuildInteraction(interaction) {
      return Reflect.has(interaction, "guild_id");
    }
    function isApplicationCommandDMInteraction(interaction) {
      return isDMInteraction(interaction);
    }
    function isApplicationCommandGuildInteraction(interaction) {
      return isGuildInteraction(interaction);
    }
    function isMessageComponentDMInteraction(interaction) {
      return isDMInteraction(interaction);
    }
    function isMessageComponentGuildInteraction(interaction) {
      return isGuildInteraction(interaction);
    }
    function isLinkButton(component) {
      return component.style === index_1.ButtonStyle.Link;
    }
    function isInteractionButton(component) {
      return component.style !== index_1.ButtonStyle.Link;
    }
    function isMessageComponentInteraction(interaction) {
      return interaction.type === index_1.InteractionType.MessageComponent;
    }
    function isMessageComponentButtonInteraction(interaction) {
      return interaction.data.component_type === index_1.ComponentType.Button;
    }
    function isMessageComponentSelectMenuInteraction(interaction) {
      return [
        index_1.ComponentType.StringSelect,
        index_1.ComponentType.UserSelect,
        index_1.ComponentType.RoleSelect,
        index_1.ComponentType.MentionableSelect,
        index_1.ComponentType.ChannelSelect
      ].includes(interaction.data.component_type);
    }
    function isChatInputApplicationCommandInteraction(interaction) {
      return interaction.data.type === index_1.ApplicationCommandType.ChatInput;
    }
    function isContextMenuApplicationCommandInteraction(interaction) {
      return interaction.data.type === index_1.ApplicationCommandType.Message || interaction.data.type === index_1.ApplicationCommandType.User;
    }
  }
});

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/v10.js
var require_v106 = __commonJS({
  "../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/v10.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o2, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o2, k2, desc);
    } : function(o2, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o2[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p2 in m)
        if (p2 !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p2))
          __createBinding(exports2, m, p2);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Utils = void 0;
    __exportStar(require_v10(), exports);
    __exportStar(require_globals(), exports);
    __exportStar(require_v102(), exports);
    __exportStar(require_v103(), exports);
    __exportStar(require_v104(), exports);
    exports.Utils = require_v105();
  }
});

// ../../packages/carbon/dist/src/abstracts/BaseComponent.js
var BaseComponent = class {
  constructor(data) {
    if (data?.additionalData)
      this.additionalData = data.additionalData;
  }
  /**
   * Whether the component response should be automatically deferred
   */
  defer = false;
  /**
   * Whether the component response should be ephemeral
   */
  ephemeral = false;
  additionalData = null;
  /**
   * Create a custom ID to use for this component that embeds additional data that you want to be handed
   * @param additionalData The additional data that you want to be passed in this component's custom ID
   * @returns The custom ID to use
   */
  createId = (additionalData) => {
    if (!additionalData)
      return this.customId;
    const id = `${this.customId}:${Object.entries(additionalData).map(([key, value]) => `${key}=${value}`).join(";")}`;
    return id;
  };
};

// ../../packages/carbon/dist/src/abstracts/AnySelectMenu.js
var AnySelectMenu = class extends BaseComponent {
  minValues;
  maxValues;
  disabled;
  placeholder;
  serialize = () => {
    const options = this.serializeOptions();
    return {
      ...options,
      custom_id: this.customId,
      disabled: this.disabled,
      placeholder: this.placeholder,
      min_values: this.minValues,
      max_values: this.maxValues
    };
  };
};

// ../../node_modules/.pnpm/discord-api-types@0.37.98/node_modules/discord-api-types/v10.mjs
var import_v10 = __toESM(require_v106(), 1);
var APIApplicationCommandPermissionsConstant = import_v10.default.APIApplicationCommandPermissionsConstant;
var APIVersion = import_v10.default.APIVersion;
var ActivityFlags = import_v10.default.ActivityFlags;
var ActivityPlatform = import_v10.default.ActivityPlatform;
var ActivityType = import_v10.default.ActivityType;
var AllowedMentionsTypes = import_v10.default.AllowedMentionsTypes;
var ApplicationCommandOptionType = import_v10.default.ApplicationCommandOptionType;
var ApplicationCommandPermissionType = import_v10.default.ApplicationCommandPermissionType;
var ApplicationCommandType = import_v10.default.ApplicationCommandType;
var ApplicationFlags = import_v10.default.ApplicationFlags;
var ApplicationIntegrationType = import_v10.default.ApplicationIntegrationType;
var ApplicationRoleConnectionMetadataType = import_v10.default.ApplicationRoleConnectionMetadataType;
var AttachmentFlags = import_v10.default.AttachmentFlags;
var AuditLogEvent = import_v10.default.AuditLogEvent;
var AuditLogOptionsType = import_v10.default.AuditLogOptionsType;
var AutoModerationActionType = import_v10.default.AutoModerationActionType;
var AutoModerationRuleEventType = import_v10.default.AutoModerationRuleEventType;
var AutoModerationRuleKeywordPresetType = import_v10.default.AutoModerationRuleKeywordPresetType;
var AutoModerationRuleTriggerType = import_v10.default.AutoModerationRuleTriggerType;
var ButtonStyle = import_v10.default.ButtonStyle;
var CDNRoutes = import_v10.default.CDNRoutes;
var ChannelFlags = import_v10.default.ChannelFlags;
var ChannelType = import_v10.default.ChannelType;
var ComponentType = import_v10.default.ComponentType;
var ConnectionService = import_v10.default.ConnectionService;
var ConnectionVisibility = import_v10.default.ConnectionVisibility;
var EmbedType = import_v10.default.EmbedType;
var EntitlementOwnerType = import_v10.default.EntitlementOwnerType;
var EntitlementType = import_v10.default.EntitlementType;
var FormattingPatterns = import_v10.default.FormattingPatterns;
var ForumLayoutType = import_v10.default.ForumLayoutType;
var GatewayCloseCodes = import_v10.default.GatewayCloseCodes;
var GatewayDispatchEvents = import_v10.default.GatewayDispatchEvents;
var GatewayIntentBits = import_v10.default.GatewayIntentBits;
var GatewayOpcodes = import_v10.default.GatewayOpcodes;
var GatewayVersion = import_v10.default.GatewayVersion;
var GuildDefaultMessageNotifications = import_v10.default.GuildDefaultMessageNotifications;
var GuildExplicitContentFilter = import_v10.default.GuildExplicitContentFilter;
var GuildFeature = import_v10.default.GuildFeature;
var GuildHubType = import_v10.default.GuildHubType;
var GuildMFALevel = import_v10.default.GuildMFALevel;
var GuildMemberFlags = import_v10.default.GuildMemberFlags;
var GuildNSFWLevel = import_v10.default.GuildNSFWLevel;
var GuildOnboardingMode = import_v10.default.GuildOnboardingMode;
var GuildOnboardingPromptType = import_v10.default.GuildOnboardingPromptType;
var GuildPremiumTier = import_v10.default.GuildPremiumTier;
var GuildScheduledEventEntityType = import_v10.default.GuildScheduledEventEntityType;
var GuildScheduledEventPrivacyLevel = import_v10.default.GuildScheduledEventPrivacyLevel;
var GuildScheduledEventRecurrenceRuleFrequency = import_v10.default.GuildScheduledEventRecurrenceRuleFrequency;
var GuildScheduledEventRecurrenceRuleMonth = import_v10.default.GuildScheduledEventRecurrenceRuleMonth;
var GuildScheduledEventRecurrenceRuleWeekday = import_v10.default.GuildScheduledEventRecurrenceRuleWeekday;
var GuildScheduledEventStatus = import_v10.default.GuildScheduledEventStatus;
var GuildSystemChannelFlags = import_v10.default.GuildSystemChannelFlags;
var GuildVerificationLevel = import_v10.default.GuildVerificationLevel;
var GuildWidgetStyle = import_v10.default.GuildWidgetStyle;
var ImageFormat = import_v10.default.ImageFormat;
var IntegrationExpireBehavior = import_v10.default.IntegrationExpireBehavior;
var InteractionContextType = import_v10.default.InteractionContextType;
var InteractionResponseType = import_v10.default.InteractionResponseType;
var InteractionType = import_v10.default.InteractionType;
var InviteTargetType = import_v10.default.InviteTargetType;
var InviteType = import_v10.default.InviteType;
var Locale = import_v10.default.Locale;
var MembershipScreeningFieldType = import_v10.default.MembershipScreeningFieldType;
var MessageActivityType = import_v10.default.MessageActivityType;
var MessageFlags = import_v10.default.MessageFlags;
var MessageReferenceType = import_v10.default.MessageReferenceType;
var MessageType = import_v10.default.MessageType;
var OAuth2Routes = import_v10.default.OAuth2Routes;
var OAuth2Scopes = import_v10.default.OAuth2Scopes;
var OverwriteType = import_v10.default.OverwriteType;
var PermissionFlagsBits = import_v10.default.PermissionFlagsBits;
var PollLayoutType = import_v10.default.PollLayoutType;
var PresenceUpdateStatus = import_v10.default.PresenceUpdateStatus;
var RESTJSONErrorCodes = import_v10.default.RESTJSONErrorCodes;
var RPCCloseEventCodes = import_v10.default.RPCCloseEventCodes;
var RPCErrorCodes = import_v10.default.RPCErrorCodes;
var ReactionType = import_v10.default.ReactionType;
var RoleFlags = import_v10.default.RoleFlags;
var RouteBases = import_v10.default.RouteBases;
var Routes = import_v10.default.Routes;
var SKUFlags = import_v10.default.SKUFlags;
var SKUType = import_v10.default.SKUType;
var SelectMenuDefaultValueType = import_v10.default.SelectMenuDefaultValueType;
var SortOrderType = import_v10.default.SortOrderType;
var StageInstancePrivacyLevel = import_v10.default.StageInstancePrivacyLevel;
var StickerFormatType = import_v10.default.StickerFormatType;
var StickerPackApplicationId = import_v10.default.StickerPackApplicationId;
var StickerType = import_v10.default.StickerType;
var TeamMemberMembershipState = import_v10.default.TeamMemberMembershipState;
var TeamMemberRole = import_v10.default.TeamMemberRole;
var TextInputStyle = import_v10.default.TextInputStyle;
var ThreadAutoArchiveDuration = import_v10.default.ThreadAutoArchiveDuration;
var ThreadMemberFlags = import_v10.default.ThreadMemberFlags;
var UserFlags = import_v10.default.UserFlags;
var UserPremiumType = import_v10.default.UserPremiumType;
var Utils = import_v10.default.Utils;
var VideoQualityMode = import_v10.default.VideoQualityMode;
var WebhookType = import_v10.default.WebhookType;

// ../../packages/carbon/dist/src/utils.js
var splitCustomId = (customId) => {
  const [id, ...args] = customId.split(":");
  if (!id)
    throw new Error("Invalid custom ID was provided");
  const data = Object.fromEntries(args.map((arg) => {
    const [key, value] = arg.split("=");
    return [key, value];
  }));
  return [id, data];
};

// ../../packages/carbon/dist/src/abstracts/Base.js
var Base = class {
  client;
  constructor(client) {
    this.client = client;
  }
};

// ../../packages/carbon/dist/src/abstracts/BaseChannel.js
var BaseChannel = class extends Base {
  /**
   * The id of the channel.
   */
  id;
  /**
   * Whether the channel is a partial channel (meaning it does not have all the data).
   * If this is true, you should use {@link BaseChannel.fetch} to get the full data of the channel.
   */
  partial;
  /**
   * The type of the channel.
   */
  type;
  /**
   * The flags of the channel in a bitfield.
   * @see https://discord.com/developers/docs/resources/channel#channel-object-channel-flags
   */
  flags;
  /**
   * The raw data of the channel.
   */
  rawData = null;
  constructor(client, rawDataOrId) {
    super(client);
    if (typeof rawDataOrId === "string") {
      this.id = rawDataOrId;
      this.partial = true;
    } else {
      this.rawData = rawDataOrId;
      this.id = rawDataOrId.id;
      this.partial = false;
      this.setData(rawDataOrId);
    }
  }
  setData(data) {
    if (!data)
      throw new Error("Cannot set data without having data... smh");
    this.rawData = data;
    this.type = data.type;
    this.partial = false;
    this.setSpecificData(data);
  }
  /**
   * Fetches the channel from the API.
   * @returns The channel data.
   */
  async fetch() {
    const newData = await this.client.rest.get(Routes.channel(this.id));
    if (!newData)
      throw new Error(`Channel ${this.id} not found`);
    this.setData(newData);
  }
};

// ../../packages/carbon/dist/src/structures/DmChannel.js
var DmChannel = class extends BaseChannel {
  /**
   * The name of the channel. This is always null for DM channels.
   */
  name = null;
  type = ChannelType.DM;
  setSpecificData(data) {
    this.name = data.name;
  }
  /**
   * Send a message to the channel
   */
  async send(message) {
    this.client.rest.post(Routes.channelMessages(this.id), {
      body: { ...message }
    });
  }
};

// ../../packages/carbon/dist/src/structures/Role.js
var Role = class extends Base {
  /**
   * The ID of the role.
   */
  id;
  /**
   * The name of the role.
   */
  name;
  /**
   * The color of the role.
   */
  color;
  /**
   * The icon hash of the role.
   * You can use {@link Role.iconUrl} to get the URL of the icon.
   */
  icon;
  /**
   * If this role is mentionable.
   */
  mentionable;
  /**
   * If this role is hoisted.
   */
  hoisted;
  /**
   * The position of the role.
   */
  position;
  /**
   * The permissions of the role.
   */
  permissions;
  /**
   * If this role is managed by an integration.
   */
  managed;
  /**
   * The unicode emoji for the role.
   */
  unicodeEmoji;
  /**
   * The flags of this role.
   * @see https://discord.com/developers/docs/topics/permissions#role-object-role-flags
   */
  flags;
  /**
   * The tags of this role.
   * @see https://discord.com/developers/docs/topics/permissions#role-object-role-tags-structure
   */
  tags;
  /**
   * Whether the role is a partial role (meaning it does not have all the data).
   * If this is true, you should use {@link Role.fetch} to get the full data of the role.
   */
  partial;
  rawData = null;
  constructor(client, rawDataOrId) {
    super(client);
    if (typeof rawDataOrId === "string") {
      this.id = rawDataOrId;
      this.partial = true;
    } else {
      this.rawData = rawDataOrId;
      this.id = rawDataOrId.id;
      this.partial = false;
      this.setData(rawDataOrId);
    }
  }
  setData(data) {
    if (!data)
      throw new Error("Cannot set data without having data... smh");
    this.rawData = data;
    this.name = data.name;
    this.color = data.color;
    this.icon = data.icon;
    this.mentionable = data.mentionable;
    this.hoisted = data.hoist;
    this.position = data.position;
    this.permissions = data.permissions;
    this.managed = data.managed;
    this.unicodeEmoji = data.unicode_emoji;
    this.flags = data.flags;
    this.tags = data.tags;
    this.partial = false;
  }
  /**
   * Fetch updated data for this role.
   * If the role is partial, this will fetch all the data for the role and populate the fields.
   * If the role is not partial, all fields will be updated with new values from Discord.
   */
  async fetch(guildId) {
    const newData = await this.client.rest.get(Routes.guildRole(guildId, this.id));
    if (!newData)
      throw new Error(`Role ${this.id} not found`);
    this.setData(newData);
  }
  /**
   * Set the name of the role
   */
  async setName(guildId, name) {
    await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
      body: {
        name
      }
    });
    this.name = name;
  }
  /**
   * Set the color of the role
   */
  async setColor(guildId, color) {
    await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
      body: { color }
    });
    this.color = color;
  }
  /**
   * Set the icon of the role
   * @param icon The unicode emoji or icon URL to set
   */
  async setIcon(guildId, icon) {
    await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
      body: { icon }
    });
    this.icon = icon;
  }
  /**
   * Set the mentionable status of the role
   */
  async setMentionable(guildId, mentionable) {
    await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
      body: { mentionable }
    });
    this.mentionable = mentionable;
  }
  /**
   * Set the hoisted status of the role
   */
  async setHoisted(guildId, hoisted) {
    await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
      body: { hoist: hoisted }
    });
    this.hoisted = hoisted;
  }
  /**
   * Set the position of the role
   */
  async setPosition(guildId, position) {
    await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
      body: { position }
    });
    this.position = position;
  }
  /**
   * Set the permissions of the role
   * @param permissions The permissions to set as a BitField string, until a better permission structure is implemented
   */
  async setPermissions(guildId, permissions) {
    await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
      body: { permissions }
    });
    this.permissions = permissions;
  }
  async delete(guildId) {
    await this.client.rest.delete(Routes.guildRole(guildId, this.id));
  }
  /**
   * Get the URL of the role's icon
   */
  get iconUrl() {
    return this.icon ? `https://cdn.discordapp.com/role-icons/${this.id}/${this.icon}.png` : null;
  }
};

// ../../packages/carbon/dist/src/structures/User.js
var User = class extends Base {
  /**
   * The ID of the user
   */
  id;
  /**
   * The username of the user.
   */
  username;
  /**
   * The global name of the user.
   */
  globalName;
  /**
   * The discriminator of the user.
   */
  discriminator;
  /**
   * The avatar hash of the user.
   * You can use {@link User.avatarUrl} to get the URL of the avatar.
   */
  avatar;
  /**
   * Is this user a bot?
   */
  bot;
  /**
   * Is this user a system user?
   */
  system;
  /**
   * The public flags of the user. (Bitfield)
   * @see https://discord.com/developers/docs/resources/user#user-object-user-flags
   */
  flags;
  /**
   * The banner hash of the user.
   * You can use {@link User.bannerUrl} to get the URL of the banner.
   */
  banner;
  /**
   * The accent color of the user.
   */
  accentColor;
  /**
   * Whether the user is a partial user (meaning it does not have all the data).
   * If this is true, you should use {@link User.fetch} to get the full data of the user.
   */
  partial;
  rawData = null;
  constructor(client, rawDataOrId) {
    super(client);
    if (typeof rawDataOrId === "string") {
      this.id = rawDataOrId;
      this.partial = true;
    } else {
      this.rawData = rawDataOrId;
      this.id = rawDataOrId.id;
      this.partial = false;
      this.setData(rawDataOrId);
    }
  }
  setData(data) {
    if (!data)
      throw new Error("Cannot set data without having data... smh");
    this.rawData = data;
    this.username = data.username;
    this.globalName = data.global_name;
    this.discriminator = data.discriminator;
    this.avatar = data.avatar;
    this.bot = data.bot;
    this.system = data.system;
    this.flags = data.public_flags;
    this.banner = data.banner;
    this.accentColor = data.accent_color;
    this.partial = false;
  }
  /**
   * Fetch updated data for this user.
   * If the user is partial, this will fetch all the data for the user and populate the fields.
   * If the user is not partial, all fields will be updated with new values from Discord.
   */
  async fetch() {
    const newData = await this.client.rest.get(Routes.user(this.id));
    if (!newData)
      throw new Error(`User ${this.id} not found`);
    this.setData(newData);
  }
  /**
   * Instantiate a new DM channel with this user.
   */
  async createDm(userId) {
    const dmChannel = await this.client.rest.post(Routes.userChannels(), {
      body: {
        recipient_id: userId
      }
    });
    return dmChannel;
  }
  /**
   * Send a message to this user.
   */
  async send(data) {
    const dmChannel = await this.createDm(this.id);
    const message = await this.client.rest.post(Routes.channelMessages(dmChannel.id), {
      body: {
        ...data
      }
    });
    return new Message(this.client, message);
  }
  /**
   * Get the URL of the user's avatar
   */
  get avatarUrl() {
    return this.avatar ? `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.png` : null;
  }
  /**
   * Get the URL of the user's banner
   */
  get bannerUrl() {
    return this.banner ? `https://cdn.discordapp.com/banners/${this.id}/${this.banner}.png` : null;
  }
};

// ../../packages/carbon/dist/src/structures/GuildMember.js
var GuildMember = class extends Base {
  /**
   * The guild-specific nickname of the member.
   */
  nickname;
  /**
   * The guild-specific avatar hash of the member.
   * You can use {@link GuildMember.avatarUrl} to get the URL of the avatar.
   */
  avatar;
  /**
   * Is this member muted in Voice Channels?
   */
  mute;
  /**
   * Is this member deafened in Voice Channels?
   */
  deaf;
  /**
   * The date since this member boosted the guild, if applicable.
   */
  premiumSince;
  /**
   * The flags of the member.
   * @see https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-flags
   */
  flags;
  /**
   * The roles of the member
   */
  roles;
  /**
   * The joined date of the member
   */
  joinedAt;
  /**
   * The date when the member's communication privileges (timeout) will be reinstated
   */
  communicationDisabledUntil;
  /**
   * Is this member yet to pass the guild's Membership Screening requirements?
   */
  pending;
  /**
   * The guild object of the member
   */
  guild;
  /**
   * The user object of the member
   */
  user;
  rawData = null;
  constructor(client, rawData, guild) {
    super(client);
    this.rawData = rawData;
    this.guild = guild;
    this.setData(rawData);
  }
  setData(data) {
    if (!data)
      throw new Error("Cannot set data without having data... smh");
    this.rawData = data;
    this.nickname = data.nick;
    this.avatar = data.avatar;
    this.mute = data.mute;
    this.deaf = data.deaf;
    this.premiumSince = data.premium_since;
    this.flags = data.flags;
    this.roles = data.roles?.map((roleId) => new Role(this.client, roleId));
    this.joinedAt = data.joined_at;
    this.communicationDisabledUntil = data.communication_disabled_until;
    this.pending = data.pending;
    this.user = data.user ? new User(this.client, data.user) : null;
  }
  /**
   * Set the nickname of the member
   */
  async setNickname(nickname) {
    await this.client.rest.patch(`/guilds/${this.guild?.id}/members/${this.user?.id}`, {
      body: {
        nick: nickname
      }
    });
    this.nickname = nickname;
  }
  /**
   * Add a role to the member
   */
  async addRole(roleId) {
    await this.client.rest.put(`/guilds/${this.guild?.id}/members/${this.user?.id}/roles/${roleId}`, {});
    this.roles?.push(new Role(this.client, roleId));
  }
  /**
   * Remove a role from the member
   */
  async removeRole(roleId) {
    await this.client.rest.delete(`/guilds/${this.guild?.id}/members/${this.user?.id}/roles/${roleId}`);
    this.roles = this.roles?.filter((role) => role.id !== roleId);
  }
  /**
   * Kick the member from the guild
   */
  async kick() {
    await this.client.rest.delete(`/guilds/${this.guild?.id}/members/${this.user?.id}`);
  }
  /**
   * Ban the member from the guild
   */
  async ban(options = {}) {
    await this.client.rest.put(`/guilds/${this.guild?.id}/bans/${this.user?.id}`, {
      body: {
        reason: options.reason,
        delete_message_days: options.deleteMessageDays
      }
    });
  }
  /**
   * Mute a member in voice channels
   */
  async muteMember() {
    await this.client.rest.patch(`/guilds/${this.guild?.id}/members/${this.user?.id}`, {
      body: {
        mute: true
      }
    });
    this.mute = true;
  }
  /**
   * Unmute a member in voice channels
   */
  async unmuteMember() {
    await this.client.rest.patch(`/guilds/${this.guild?.id}/members/${this.user?.id}`, {
      body: {
        mute: false
      }
    });
    this.mute = false;
  }
  /**
   * Deafen a member in voice channels
   */
  async deafenMember() {
    await this.client.rest.patch(`/guilds/${this.guild?.id}/members/${this.user?.id}`, {
      body: {
        deaf: true
      }
    });
    this.deaf = true;
  }
  /**
   * Undeafen a member in voice channels
   */
  async undeafenMember() {
    await this.client.rest.patch(`/guilds/${this.guild?.id}/members/${this.user?.id}`, {
      body: {
        deaf: false
      }
    });
    this.deaf = false;
  }
  /**
   * Set or remove a timeout for a member in the guild
   */
  async timeoutMember(communicationDisabledUntil) {
    await this.client.rest.patch(`/guilds/${this.guild?.id}/members/${this.user?.id}`, {
      body: {
        communication_disabled_until: communicationDisabledUntil
      }
    });
    this.communicationDisabledUntil = communicationDisabledUntil;
  }
  /**
   * Get the URL of the member's guild-specific avatar
   */
  get avatarUrl() {
    if (!this.user)
      return null;
    return this.avatar ? `https://cdn.discordapp.com/guilds/${this.guild.id}/users/${this.user?.id}/${this.avatar}.png` : null;
  }
};

// ../../packages/carbon/dist/src/structures/Guild.js
var Guild = class extends Base {
  /**
   * The ID of the guild
   */
  id;
  /**
   * The name of the guild.
   */
  name;
  /**
   * The description of the guild.
   */
  description;
  /**
   * The icon hash of the guild.
   * You can use {@link Guild.iconUrl} to get the URL of the icon.
   */
  icon;
  /**
   * The splash hash of the guild.
   * You can use {@link Guild.splashUrl} to get the URL of the splash.
   */
  splash;
  /**
   * The ID of the owner of the guild.
   */
  ownerId;
  /**
   * Whether the guild is a partial guild (meaning it does not have all the data).
   * If this is true, you should use {@link Guild.fetch} to get the full data of the guild.
   */
  partial;
  rawData = null;
  constructor(client, rawDataOrId) {
    super(client);
    if (typeof rawDataOrId === "string") {
      this.id = rawDataOrId;
      this.partial = true;
    } else {
      this.rawData = rawDataOrId;
      this.id = rawDataOrId.id;
      this.partial = false;
      this.setData(rawDataOrId);
    }
  }
  setData(data) {
    if (!data)
      throw new Error("Cannot set data without having data... smh");
    this.rawData = data;
    this.name = data.name;
    this.description = data.description;
    this.icon = data.icon;
    this.splash = data.splash;
    this.ownerId = data.owner_id;
    this.partial = false;
  }
  /**
   * Fetch updated data for this guild.
   * If the guild is partial, this will fetch all the data for the guild and populate the fields.
   * If the guild is not partial, all fields will be updated with new values from Discord.
   */
  async fetch() {
    const newData = await this.client.rest.get(Routes.guild(this.id));
    if (!newData)
      throw new Error(`Guild ${this.id}not found`);
    this.setData(newData);
  }
  /**
   * Leave the guild
   */
  async leave() {
    return await this.client.rest.delete(Routes.guild(this.id));
  }
  /**
   * Create a role in the guild
   */
  async createRole(data) {
    const role = await this.client.rest.post(Routes.guildRoles(this.id), {
      body: {
        ...data
      }
    });
    return new Role(this.client, role);
  }
  /**
   * Get a member in the guild by ID
   */
  async fetchMember(memberId) {
    const member = await this.client.rest.get(Routes.guildMember(this.id, memberId));
    return new GuildMember(this.client, member, this);
  }
  /**
   * Get the URL of the guild's icon
   */
  get iconUrl() {
    return this.icon ? `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.png` : null;
  }
  /**
   * Get the URL of the guild's splash
   */
  get splashUrl() {
    return this.splash ? `https://cdn.discordapp.com/splashes/${this.id}/${this.splash}.png` : null;
  }
  /**
   * Get all roles in the guild
   */
  get roles() {
    const roles = this.rawData?.roles;
    if (!roles)
      throw new Error("Cannot get roles without having data... smh");
    return roles.map((role) => new Role(this.client, role));
  }
  /**
   * Fetch a channel from the guild by ID
   */
  async fetchChannel(channelId) {
    const channel = await this.client.rest.get(Routes.channel(channelId));
    return channelFactory(this.client, channel);
  }
};

// ../../packages/carbon/dist/src/abstracts/BaseGuildChannel.js
var BaseGuildChannel = class extends BaseChannel {
  /**
   * The name of the channel.
   */
  name;
  /**
   * The ID of the guild this channel is in
   */
  guildId;
  /**
   * The position of the channel in the channel list.
   */
  position;
  /**
   * The ID of the parent category for the channel.
   */
  parentId;
  /**
   * Whether the channel is marked as nsfw.
   */
  nsfw;
  /**
   * The guild this channel is in
   */
  get guild() {
    if (!this.guildId)
      throw new Error("Cannot get guild without guild ID");
    return new Guild(this.client, this.guildId);
  }
  setData(data) {
    this.rawData = data;
    this.partial = false;
    this.name = data.name;
    this.guildId = data.guild_id;
    this.position = data.position;
    this.parentId = data.parent_id;
    this.nsfw = data.nsfw;
    this.setSpecificData(data);
  }
  /**
   * Set the name of the channel
   * @param name The new name of the channel
   */
  async setName(name) {
    await this.client.rest.patch(Routes.channel(this.id), {
      body: {
        name
      }
    });
    this.name = name;
  }
  /**
   * Set the position of the channel
   * @param position The new position of the channel
   */
  async setPosition(position) {
    await this.client.rest.patch(Routes.channel(this.id), {
      body: {
        position
      }
    });
    this.position = position;
  }
  /**
   * Set the parent ID of the channel
   * @param parent The new category channel or ID to set
   */
  async setParent(parent) {
    if (typeof parent === "string") {
      await this.client.rest.patch(Routes.channel(this.id), {
        body: {
          parent_id: parent
        }
      });
      this.parentId = parent;
    } else {
      await this.client.rest.patch(Routes.channel(this.id), {
        body: {
          parent_id: parent.id
        }
      });
      this.parentId = parent.id;
    }
  }
  /**
   * Set whether the channel is nsfw
   * @param nsfw The new nsfw status of the channel
   */
  async setNsfw(nsfw) {
    await this.client.rest.patch(Routes.channel(this.id), {
      body: {
        nsfw
      }
    });
    this.nsfw = nsfw;
  }
  /**
   * Send a message to the channel
   */
  async send(message) {
    this.client.rest.post(Routes.channelMessages(this.id), {
      body: { ...message }
    });
  }
  /**
   * Get the invites for the channel
   */
  async getInvites() {
    return await this.client.rest.get(Routes.channelInvites(this.id));
  }
  /**
   * Create an invite for the channel
   */
  async createInvite(options) {
    return await this.client.rest.post(Routes.channelInvites(this.id), {
      body: { ...options }
    });
  }
  /**
   * Trigger a typing indicator in the channel (this will expire after 10 seconds)
   */
  async triggerTyping() {
    await this.client.rest.post(Routes.channelTyping(this.id));
  }
};

// ../../packages/carbon/dist/src/structures/GuildThreadChannel.js
var GuildThreadChannel = class extends BaseGuildChannel {
  /**
   * Whether the thread is archived.
   */
  archived;
  /**
   * The duration until the thread is auto archived.
   */
  autoArchiveDuration;
  /**
   * The timestamp of when the thread was archived.
   */
  archiveTimestamp;
  /**
   * Whether the thread is locked.
   */
  locked;
  /**
   * Whether non-moderators can add other non-moderators to a thread; only available on private threads
   */
  invitable;
  /**
   * The timestamp of when the thread was created.
   */
  createTimestamp;
  /**
   * The number of messages in the thread.
   */
  messageCount;
  /**
   * The number of members in the thread.
   *
   * @remarks
   * This is only accurate until 50, after that, Discord stops counting.
   */
  memberCount;
  /**
   * The ID of the owner of the thread.
   */
  ownerId;
  /**
   * The number of messages sent in the thread.
   */
  totalMessageSent;
  /**
   * The tags applied to the thread.
   */
  appliedTags;
  setSpecificData(data) {
    this.archived = data.thread_metadata?.archived;
    this.autoArchiveDuration = data.thread_metadata?.auto_archive_duration;
    this.archiveTimestamp = data.thread_metadata?.archive_timestamp;
    this.locked = data.thread_metadata?.locked;
    this.invitable = data.thread_metadata?.invitable;
    this.createTimestamp = data.thread_metadata?.create_timestamp;
    this.messageCount = data.message_count;
    this.memberCount = data.member_count;
    this.ownerId = data.owner_id;
    this.totalMessageSent = data.total_message_sent;
    this.appliedTags = data.applied_tags;
  }
  /**
   * Join the thread
   */
  async join() {
    await this.addMember("@me");
  }
  /**
   * Add a member to the thread
   */
  async addMember(userId) {
    await this.client.rest.put(Routes.threadMembers(this.id, userId));
  }
  /**
   * Leave the thread
   */
  async leave() {
    await this.removeMember("@me");
  }
  /**
   * Get the pinned messages in the thread
   */
  async removeMember(userId) {
    await this.client.rest.delete(Routes.threadMembers(this.id, userId));
  }
  /**
   * Archive the thread
   */
  async archive() {
    await this.client.rest.patch(Routes.channel(this.id), {
      body: { archive: true }
    });
    this.archived = true;
  }
  /**
   * Unarchive the thread
   */
  async unarchive() {
    await this.client.rest.patch(Routes.channel(this.id), {
      body: { archive: false }
    });
    this.archived = false;
  }
  /**
   * Set the auto archive duration of the thread
   */
  async setAutoArchiveDuration(duration) {
    await this.client.rest.patch(Routes.channel(this.id), {
      body: { auto_archive_duration: duration }
    });
    this.autoArchiveDuration = duration;
  }
  /**
   * Lock the thread
   */
  async lock() {
    await this.client.rest.put(Routes.channel(this.id), {
      body: { locked: true }
    });
    this.locked = true;
  }
  /**
   * Unlock the thread
   */
  async unlock() {
    await this.client.rest.put(Routes.channel(this.id), {
      body: { locked: false }
    });
    this.locked = false;
  }
};

// ../../packages/carbon/dist/src/structures/Message.js
var Message = class extends Base {
  /**
   * The ID of the message
   */
  id;
  /**
   * The ID of the channel the message is in
   */
  channelId;
  /**
   * Whether the message is a partial message (meaning it does not have all the data).
   * If this is true, you should use {@link Message.fetch} to get the full data of the message.
   */
  partial;
  rawData = null;
  constructor(client, rawDataOrIds) {
    super(client);
    this.id = rawDataOrIds.id;
    this.channelId = rawDataOrIds.channel_id;
    if (Object.keys(rawDataOrIds).length === 2) {
      this.partial = true;
    } else {
      this.partial = false;
      this.setData(rawDataOrIds);
    }
  }
  setData(data) {
    this.rawData = data;
    if (!data)
      throw new Error("Cannot set data without having data... smh");
  }
  /**
   * Fetch updated data for this message.
   * If the message is partial, this will fetch all the data for the message and populate the fields.
   * If the message is not partial, all fields will be updated with new values from Discord.
   */
  async fetch() {
    const newData = await this.client.rest.get(Routes.channelMessage(this.channelId, this.id));
    if (!newData)
      throw new Error(`Message ${this.id} not found`);
    this.setData(newData);
  }
  /**
   * Delete this message from Discord
   */
  async delete() {
    return await this.client.rest.delete(Routes.channelMessage(this.channelId, this.id));
  }
  get author() {
    if (this.rawData?.webhook_id)
      return null;
    if (this.rawData?.author.username)
      return new User(this.client, this.rawData.author);
    if (this.rawData?.author.id)
      return new User(this.client, this.rawData.author.id);
    return null;
  }
  async fetchChannel() {
    const data = await this.client.rest.get(Routes.channel(this.channelId));
    return channelFactory(this.client, data);
  }
  /**
   * Pin this message
   */
  async pin() {
    await this.client.rest.put(Routes.channelPin(this.channelId, this.id));
  }
  /**
   * Unpin this message
   */
  async unpin() {
    await this.client.rest.delete(Routes.channelPin(this.channelId, this.id));
  }
  /**
   * Start a thread with this message as the associated start message.
   * If you want to start a thread without a start message, use {@link BaseGuildTextChannel.startThread}
   */
  async startThread(data) {
    const thread = await this.client.rest.post(Routes.threads(this.channelId, this.id), {
      body: { ...data }
    });
    return new GuildThreadChannel(this.client, thread);
  }
};

// ../../packages/carbon/dist/src/structures/GroupDmChannel.js
var GroupDmChannel = class extends BaseChannel {
  /**
   * The name of the channel.
   */
  name;
  /**
   * The recipients of the channel.
   */
  recipients;
  type = ChannelType.GroupDM;
  /**
   * The ID of the application that created the channel, if it was created by a bot.
   */
  applicationId;
  /**
   * The icon hash of the channel.
   */
  icon;
  /**
   * The ID of the user who created the channel.
   */
  ownerId;
  /**
   * The ID of the last message sent in the channel.
   *
   * @remarks
   * This might not always resolve to a message. The ID still stays a part of the channel's data, even if the message is deleted.
   */
  lastMessageId;
  /**
   * Whether the channel is managed by an Oauth2 application.
   */
  managed;
  setSpecificData(data) {
    this.name = data.name;
    this.recipients = data.recipients?.map((x) => new User(this.client, x));
    this.applicationId = data.application_id;
    this.icon = data.icon;
    this.ownerId = data.owner_id;
    this.lastMessageId = data.last_message_id;
    this.managed = data.managed;
  }
  /**
   * Get the URL of the channel's icon.
   */
  get iconUrl() {
    return this.icon ? `https://cdn.discordapp.com/channel-icons/${this.id}/${this.icon}.png` : null;
  }
  /**
   * Get the owner of the channel.
   */
  get owner() {
    if (!this.ownerId)
      throw new Error("Cannot get owner without owner ID");
    return new User(this.client, this.ownerId);
  }
  /**
   * The last message sent in the channel.
   *
   * @remarks
   * This might not always resolve to a message. The ID still stays a part of the channel's data, even if the message is deleted.
   * This will always return a partial message, so you can use {@link Message.fetch} to get the full message data.
   *
   */
  get lastMessage() {
    if (!this.lastMessageId)
      return null;
    return new Message(this.client, {
      id: this.lastMessageId,
      channel_id: this.id
    });
  }
  /**
   * Set the name of the channel
   * @param name The new name of the channel
   */
  async setName(name) {
    await this.client.rest.patch(Routes.channel(this.id), {
      body: {
        name
      }
    });
    this.name = name;
  }
  async addRecipient(user) {
    await this.client.rest.put(Routes.channelRecipient(this.id, typeof user === "string" ? user : user.id));
    if (this.recipients)
      this.recipients.push(typeof user === "string" ? new User(this.client, user) : user);
    else
      this.recipients = [
        typeof user === "string" ? new User(this.client, user) : user
      ];
  }
  async removeRecipient(user) {
    await this.client.rest.delete(Routes.channelRecipient(this.id, typeof user === "string" ? user : user.id));
    if (this.recipients)
      this.recipients = this.recipients.filter((x) => x.id !== (typeof user === "string" ? user : user.id));
  }
};

// ../../packages/carbon/dist/src/abstracts/BaseGuildTextChannel.js
var BaseGuildTextChannel = class extends BaseGuildChannel {
  /**
   * The ID of the last message sent in the channel.
   *
   * @remarks
   * This might not always resolve to a message. The ID still stays a part of the channel's data, even if the message is deleted.
   */
  lastMessageId;
  /**
   * The timestamp of the last pin in the channel.
   */
  lastPinTimestamp;
  /**
   * The rate limit per user for the channel, in seconds.
   */
  rateLimitPerUser;
  setSpecificData(data) {
    this.lastMessageId = data.last_message_id;
    this.lastPinTimestamp = data.last_pin_timestamp;
    this.rateLimitPerUser = data.rate_limit_per_user;
    this.setMoreSpecificData(data);
  }
  /**
   * The last message sent in the channel.
   *
   * @remarks
   * This might not always resolve to a message. The ID still stays a part of the channel's data, even if the message is deleted.
   * This will always return a partial message, so you can use {@link Message.fetch} to get the full message data.
   *
   */
  get lastMessage() {
    if (!this.lastMessageId)
      return null;
    return new Message(this.client, {
      id: this.lastMessageId,
      channel_id: this.id
    });
  }
  /**
   * Get the pinned messages in the channel
   */
  async getPinnedMessages() {
    const msgs = await this.client.rest.get(Routes.channelPins(this.id));
    return msgs.map((x) => new Message(this.client, x));
  }
  /**
   * Start a thread without an associated start message.
   * If you want to start a thread with a start message, use {@link Message.startThread}
   */
  async startThread(data) {
    const thread = await this.client.rest.post(Routes.threads(this.id), {
      body: { ...data }
    });
    return new GuildThreadChannel(this.client, thread);
  }
};

// ../../packages/carbon/dist/src/structures/GuildAnnouncementChannel.js
var GuildAnnouncementChannel = class extends BaseGuildTextChannel {
  type = ChannelType.GuildAnnouncement;
  setMoreSpecificData() {
  }
  async follow(targetChannel) {
    await this.client.rest.put(Routes.channelFollowers(this.id), {
      body: {
        webhook_channel_id: typeof targetChannel === "string" ? targetChannel : targetChannel.id
      }
    });
  }
};

// ../../packages/carbon/dist/src/structures/GuildCategoryChannel.js
var GuildCategoryChannel = class extends BaseGuildChannel {
  setSpecificData() {
  }
  /**
   * You cannot send a message to a category channel, so this method throws an error
   */
  async send() {
    throw new Error("Category channels cannot be sent to");
  }
};

// ../../packages/carbon/dist/src/abstracts/GuildThreadOnlyChannel.js
var GuildThreadOnlyChannel = class extends BaseGuildChannel {
  /**
   * The topic of the channel.
   */
  topic;
  /**
   * The default auto archive duration of the channel.
   */
  defaultAutoArchiveDuration;
  /**
   * The available tags to set on posts in the channel.
   */
  availableTags;
  /**
   * The default thread rate limit per user for the channel.
   */
  defaultThreadRateLimitPerUser;
  /**
   * The default reaction emoji for the channel.
   */
  defaultReactionEmoji;
  /**
   * The default sort order for the channel, by latest activity or by creation date.
   */
  defaultSortOrder;
  setSpecificData(data) {
    this.topic = data.topic;
    this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
    this.availableTags = data.available_tags;
    this.defaultThreadRateLimitPerUser = data.default_thread_rate_limit_per_user;
    this.defaultReactionEmoji = data.default_reaction_emoji;
    this.defaultSortOrder = data.default_sort_order;
    this.setMoreSpecificData(data);
  }
  /**
   * You cannot send a message directly to a forum or media channel, so this method throws an error.
   * Use {@link GuildThreadChannel.send} instead, or the alias {@link GuildThreadOnlyChannel.sendToPost} instead, to send a message to the channel's posts.
   */
  async send() {
    throw new Error("You cannot send a message directly to a forum or media channel. Use GuildThreadChannel.send instead, or the alias GuildThreadOnlyChannel.sendToPost instead, to send a message to the channel's posts.");
  }
  /**
   * Send a message to a post in the channel
   * @remarks
   * This is an alias for {@link GuildThreadChannel.send} that will fetch the channel, but if you already have the channel, you can use {@link GuildThreadChannel.send} instead.
   */
  async sendToPost(message, postId) {
    const channel = new GuildThreadChannel(this.client, postId);
    await channel.send(message);
  }
};

// ../../packages/carbon/dist/src/structures/GuildForumChannel.js
var GuildForumChannel = class extends GuildThreadOnlyChannel {
  /**
   * The default forum layout of the channel.
   */
  defaultForumLayout;
  setMoreSpecificData(data) {
    this.defaultForumLayout = data.default_forum_layout;
  }
};

// ../../packages/carbon/dist/src/structures/GuildMediaChannel.js
var GuildMediaChannel = class extends GuildThreadOnlyChannel {
  /**
   * The default forum layout of the channel.
   */
  defaultForumLayout;
  setMoreSpecificData() {
  }
};

// ../../packages/carbon/dist/src/structures/GuildStageOrVoiceChannel.js
var GuildStageChannel = class extends BaseGuildChannel {
  setSpecificData() {
  }
};
var GuildVoiceChannel = class extends BaseGuildChannel {
  setSpecificData() {
  }
};

// ../../packages/carbon/dist/src/structures/GuildTextChannel.js
var GuildTextChannel = class extends BaseGuildTextChannel {
  type = ChannelType.GuildText;
  /**
   * The default auto archive duration of threads in the channel.
   */
  defaultAutoArchiveDuration;
  /**
   * The default thread rate limit per user of the channel.
   */
  defaultThreadRateLimitPerUser;
  setMoreSpecificData(data) {
    this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
    this.defaultThreadRateLimitPerUser = data.default_thread_rate_limit_per_user;
  }
};

// ../../packages/carbon/dist/src/factories/channelFactory.js
var channelFactory = (client, channelData) => {
  switch (channelData.type) {
    case ChannelType.DM:
      return new DmChannel(client, channelData);
    case ChannelType.GroupDM:
      return new GroupDmChannel(client, channelData);
    case ChannelType.GuildText:
      return new GuildTextChannel(client, channelData);
    case ChannelType.GuildVoice:
      return new GuildVoiceChannel(client, channelData);
    case ChannelType.GuildCategory:
      return new GuildCategoryChannel(client, channelData);
    case ChannelType.GuildAnnouncement:
      return new GuildAnnouncementChannel(client, channelData);
    case ChannelType.AnnouncementThread:
    case ChannelType.PublicThread:
    case ChannelType.PrivateThread:
      return new GuildThreadChannel(client, channelData);
    case ChannelType.GuildStageVoice:
      return new GuildStageChannel(client, channelData);
    case ChannelType.GuildForum:
      return new GuildForumChannel(client, channelData);
    case ChannelType.GuildMedia:
      return new GuildMediaChannel(client, channelData);
    default:
      return null;
  }
};

// ../../packages/carbon/dist/src/abstracts/BaseInteraction.js
var BaseInteraction = class extends Base {
  /**
   * The type of interaction
   */
  type;
  /**
   * The raw data of the interaction
   */
  rawData;
  /**
   * The user who sent the interaction
   */
  userId;
  /**
   * Whether the interaction is deferred already
   * @internal
   */
  _deferred = false;
  constructor(client, data) {
    super(client);
    this.rawData = data;
    this.type = data.type;
    this.userId = this.rawData.user?.id || this.rawData.member?.user.id || void 0;
  }
  get message() {
    if (!this.rawData.message)
      return null;
    return new Message(this.client, this.rawData.message);
  }
  get guild() {
    if (!this.rawData.guild_id)
      return null;
    return new Guild(this.client, this.rawData.guild_id);
  }
  get user() {
    if (this.rawData.user)
      return new User(this.client, this.rawData.user);
    if (this.rawData.member)
      return new User(this.client, this.rawData.member.user);
    return null;
  }
  get channel() {
    if (!this.rawData.channel)
      return null;
    return channelFactory(this.client, this.rawData.channel);
  }
  get member() {
    if (!this.rawData.member)
      return null;
    if (!this.guild)
      return null;
    return new GuildMember(this.client, this.rawData.member, this.guild);
  }
  /**
   * Reply to an interaction.
   * If the interaction is deferred, this will edit the original response.
   * @param data The response data
   */
  async reply(data, options = {}) {
    if (this._deferred) {
      await this.client.rest.patch(Routes.webhookMessage(this.client.options.clientId, this.rawData.token, "@original"), {
        body: {
          ...data,
          components: data.components?.map((row) => row.serialize())
        },
        files: options.files
      });
    } else {
      await this.client.rest.post(Routes.interactionCallback(this.rawData.id, this.rawData.token), {
        body: {
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            ...data,
            components: data.components?.map((row) => row.serialize())
          }
        },
        files: options.files
      });
    }
  }
  /**
   * Defer the interaction response. This is used automatically by commands that are set to defer.
   * If the interaction is already deferred, this will do nothing.
   * @internal
   */
  async defer() {
    if (this._deferred)
      return;
    this._deferred = true;
    await this.client.rest.post(Routes.interactionCallback(this.rawData.id, this.rawData.token), {
      body: {
        type: InteractionResponseType.DeferredChannelMessageWithSource
      }
    });
  }
};

// ../../packages/carbon/dist/src/abstracts/BaseComponentInteraction.js
var BaseComponentInteraction = class extends BaseInteraction {
  customId;
  componentType;
  constructor(client, data) {
    super(client, data);
    if (!data.data)
      throw new Error("Invalid interaction data was used to create this class");
    this.customId = splitCustomId(data.data.custom_id)[0];
    this.componentType = data.data.component_type;
  }
};

// ../../packages/carbon/dist/src/abstracts/AnySelectMenuInteraction.js
var AnySelectMenuInteraction = class extends BaseComponentInteraction {
  customId = splitCustomId(this.rawData.data.custom_id)[0];
  constructor(client, data) {
    super(client, data);
    if (!data.data)
      throw new Error("Invalid interaction data was used to create this class");
    if (data.type !== InteractionType.MessageComponent) {
      throw new Error("Invalid interaction type was used to create this class");
    }
  }
  /**
   * The raw IDs of the selected options (either role/string/channel IDs or the IDs you provided in your options)
   */
  get values() {
    return this.rawData.data.values;
  }
};

// ../../packages/carbon/dist/src/abstracts/BaseCommand.js
var BaseCommand = class {
  /**
   * Whether the command response should be automatically deferred
   */
  defer = false;
  /**
   * Whether the command response should be ephemeral
   */
  ephemeral = false;
  /**
   * The places this command can be used in
   * @beta API types are not finalized
   */
  integrationTypes = [
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall
  ];
  /**
   * The contexts this command can be used in
   * @beta API types are not finalized
   */
  contexts = [
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  ];
  /**
   * All the components that the command is able to use.
   * You mount these here so the handler can access them
   */
  components = [];
  /**
   * All the paginators that the command is able to use.
   * You mount these here so the handler can access them
   */
  // paginators?: Paginator[] = []
  /**
   * Serializes the command into a JSON object that can be sent to Discord
   * @internal
   */
  serialize() {
    if (this.type === ApplicationCommandType.ChatInput) {
      const data2 = {
        name: this.name,
        type: this.type,
        description: this.description,
        options: this.serializeOptions(),
        integration_types: this.integrationTypes,
        contexts: this.contexts
      };
      return data2;
    }
    const data = {
      name: this.name,
      type: this.type,
      options: this.serializeOptions(),
      integration_types: this.integrationTypes,
      contexts: this.contexts
    };
    return data;
  }
};

// ../../packages/carbon/dist/src/classes/Button.js
var BaseButton = class extends BaseComponent {
  type = ComponentType.Button;
  /**
   * The emoji of the button
   */
  emoji;
  /**
   * The style of the button
   */
  style = ButtonStyle.Primary;
  /**
   * The disabled state of the button
   */
  disabled = false;
};
var Button = class extends BaseButton {
  serialize = () => {
    return {
      type: ComponentType.Button,
      style: this.style,
      label: this.label,
      custom_id: this.customId,
      disabled: this.disabled,
      emoji: this.emoji
    };
  };
};
var LinkButton = class extends BaseButton {
  customId = "";
  style = ButtonStyle.Link;
  serialize = () => {
    return {
      type: ComponentType.Button,
      url: this.url,
      style: this.style,
      label: this.label,
      disabled: this.disabled,
      emoji: this.emoji
    };
  };
};

// ../../packages/carbon/dist/src/classes/ChannelSelectMenu.js
var ChannelSelectMenu = class extends AnySelectMenu {
  type = ComponentType.ChannelSelect;
  channelTypes;
  defaultValues;
  serializeOptions() {
    return {
      type: this.type,
      default_values: this.defaultValues,
      channel_types: this.channelTypes
    };
  }
};

// ../../packages/request/dist/src/errorsMapper.js
var errorMapper = (data) => {
  if (!data?.errors)
    return [];
  const result = [];
  const traverse = (obj, path) => {
    if (typeof obj === "object" && obj !== null) {
      if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          traverse(obj[i], [...path, i.toString()]);
        }
      } else {
        for (const [key, value] of Object.entries(obj)) {
          if (key === "_errors") {
            for (const error of value) {
              result.push({
                code: error.code,
                location: path.length > 0 ? path.join(".") : "errors",
                message: error.message
              });
            }
          } else {
            traverse(value, [...path, key]);
          }
        }
      }
    }
  };
  traverse(data.errors, []);
  return result;
};

// ../../packages/request/dist/src/errors/BaseError.js
var BaseError = class extends Error {
};

// ../../packages/request/dist/src/errors/DiscordError.js
var DiscordError = class extends BaseError {
  /**
   * The HTTP status code of the response from Discord
   * @see https://discord.com/developers/docs/topics/opcodes-and-status-codes#http
   */
  status;
  /**
   * The Discord error code
   * @see https://discord.com/developers/docs/topics/opcodes-and-status-codes#json
   */
  discordCode;
  /**
   * An array of the errors that were returned by Discord
   */
  errors;
  /**
   * The raw body of the error from Discord
   * @internal
   */
  rawBody;
  constructor(response, body) {
    super(body.message);
    this.rawBody = body;
    this.status = response.status;
    this.discordCode = body.code;
    this.errors = errorMapper(body);
  }
};

// ../../packages/request/dist/src/errors/RatelimitError.js
var RateLimitError = class extends DiscordError {
  retryAfter;
  scope;
  bucket;
  constructor(response, body) {
    super(response, body);
    if (this.status !== 429)
      throw new Error("Invalid status code for RateLimitError");
    this.retryAfter = body.retry_after;
    this.scope = response.headers.get("X-RateLimit-Scope");
    this.bucket = response.headers.get("X-RateLimit-Bucket");
  }
};

// ../../packages/request/dist/src/RequestClient.js
var defaultOptions = {
  tokenHeader: "Bot",
  baseUrl: "https://discord.com/api",
  apiVersion: 10,
  userAgent: "DiscordBot (https://github.com/buape/carbon, v0.0.0)",
  timeout: 15e3,
  queueRequests: true
};
var RequestClient = class {
  /**
   * The options used to initialize the client
   */
  options;
  queue = [];
  token;
  rateLimitResetTime;
  abortController = null;
  constructor(token, options) {
    this.token = token;
    this.options = {
      ...defaultOptions,
      ...options
    };
    this.rateLimitResetTime = 0;
  }
  async waitForRateLimit() {
    const delay = this.rateLimitResetTime - Date.now();
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  async get(path) {
    return await this.request("GET", path);
  }
  async post(path, data) {
    return await this.request("POST", path, data);
  }
  async patch(path, data) {
    return await this.request("PATCH", path, data);
  }
  async put(path, data) {
    return await this.request("PUT", path, data);
  }
  async delete(path, data) {
    return await this.request("DELETE", path, data);
  }
  async request(method, path, data) {
    if (this.options.queueRequests) {
      return new Promise((resolve, reject) => {
        this.queue.push({ method, path, data, resolve, reject });
        this.processQueue();
      });
    }
    return new Promise((resolve, reject) => {
      this.executeRequest({ method, path, data, resolve, reject }).then(resolve).catch((err) => {
        reject(err);
      });
    });
  }
  async executeRequest(request) {
    await this.waitForRateLimit();
    const { method, path, data } = request;
    const url = `${this.options.baseUrl}${path}`;
    const headers = new Headers({
      Authorization: `${this.options.tokenHeader} ${this.token}`,
      ...data?.files ? {} : { "Content-Type": "application/json" }
    });
    this.abortController = new AbortController();
    let body;
    if (data?.files != null) {
      const formData = new FormData();
      for (const [index, file] of data.files.entries()) {
        let { data: fileData } = file;
        if (!(fileData instanceof Blob)) {
          fileData = new Blob([fileData]);
        }
        formData.append(`files[${file.id ?? index}]`, fileData, file.name);
      }
      if (data.body != null) {
        formData.append("payload_json", JSON.stringify(data.body));
      }
      body = formData;
    } else if (data?.body != null) {
      if (data.rawBody) {
        body = data.body;
      } else {
        body = JSON.stringify(data.body);
      }
    }
    const response = await fetch(url, {
      method,
      headers,
      body,
      signal: this.abortController.signal
    });
    if (response.status === 429) {
      const responseBody = await response.json();
      const rateLimitError = new RateLimitError(response, responseBody);
      if (this.options.queueRequests) {
        const rateLimitResetTime = Number(response.headers.get("Retry-After")) * 1e3;
        this.rateLimitResetTime = Date.now() + rateLimitResetTime;
        if (rateLimitError.scope === "global") {
          await new Promise((res) => setTimeout(res, rateLimitResetTime));
          this.queue.unshift(request);
        }
      }
      throw rateLimitError;
    }
    if (response.status >= 400 && response.status < 600) {
      throw new DiscordError(response, await response.json());
    }
    try {
      return await response.json();
    } catch (err) {
      if (err instanceof SyntaxError) {
        return await response.text();
      }
      throw err;
    }
  }
  async processQueue() {
    if (this.queue.length === 0)
      return;
    const queueItem = this.queue.shift();
    if (!queueItem)
      return;
    const { method, path, data, resolve, reject } = queueItem;
    try {
      const result = await this.executeRequest({
        method,
        path,
        data,
        resolve,
        reject
      });
      resolve(result);
    } catch (error) {
      if (error instanceof RateLimitError && this.options.queueRequests && error.scope === "global") {
        this.queue.unshift(queueItem);
      } else {
        if (error instanceof Error) {
          reject(error);
        } else {
          reject(new Error("Unknown error during request", { cause: error }));
        }
      }
    } finally {
      this.abortController = null;
      this.processQueue();
    }
  }
  abortAllRequests() {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.queue = [];
  }
};

// ../../node_modules/.pnpm/discord-verify@1.2.0/node_modules/discord-verify/dist/shared/discord-verify.f36cec27.mjs
var encoder = new TextEncoder();
var KEYS = {
  ZERO: 48,
  A: 65,
  a: 97
};
function hexCharToBinary(char) {
  const code = char.charCodeAt(0);
  if (code >= KEYS.a) {
    return code - KEYS.a + 10;
  }
  if (code >= KEYS.A) {
    return code - KEYS.A + 10;
  }
  return code - KEYS.ZERO;
}
function hexStringToBinary(key) {
  if (key == null || key.length % 2 !== 0) {
    return new Uint8Array(0).buffer;
  }
  const view = new Uint8Array(key.length / 2);
  for (let i = 0, o2 = 0; i < key.length; i += 2, ++o2) {
    view[o2] = hexCharToBinary(key[i]) << 4 | hexCharToBinary(key[i + 1]);
  }
  return view.buffer;
}
async function getCryptoKey(publicKey, subtleCrypto, algorithm) {
  const key = await subtleCrypto.importKey(
    "raw",
    hexStringToBinary(publicKey),
    algorithm,
    true,
    ["verify"]
  );
  return key;
}
var PlatformAlgorithm = {
  Web: "Ed25519",
  /**
   * Node v18.4.0+
   * Node v16.17.0+
   * For Node v17, use OldNode
   */
  NewNode: "Ed25519",
  /**
   * Node v18.3.0 and below
   * Node v17.0.0+
   * Node v16.16.0 and below
   */
  OldNode: {
    name: "NODE-ED25519",
    namedCurve: "NODE-ED25519",
    public: true
  },
  Cloudflare: {
    name: "NODE-ED25519",
    namedCurve: "NODE-ED25519",
    public: true
  },
  /**
   * Despite being documented as 	`{ name: "eddsa", namedCurve: "ed25519"}` or
   * `{ name: "ecdsa", namedCurve: "ed25519" }`, Vercel uses the same format as
   * Cloudflare in Production (despite Dev using documented formats)
   */
  VercelProd: {
    name: "NODE-ED25519",
    namedCurve: "NODE-ED25519",
    public: true
  },
  /**
   * Despite being documented as using this format, Vercel uses the same format
   * as Cloudflare in Production and only uses this format in Development.
   */
  VercelDev: { name: "eddsa", namedCurve: "ed25519" }
};
async function isValidRequest(request, publicKey, subtleCrypto, algorithm = PlatformAlgorithm.NewNode, expirationTime = 15 * 6e4) {
  const clone = request.clone();
  const timestamp = clone.headers.get("X-Signature-Timestamp");
  const signature = clone.headers.get("X-Signature-Ed25519");
  const body = await clone.text();
  return verify(
    body,
    signature,
    timestamp,
    publicKey,
    subtleCrypto,
    algorithm,
    expirationTime
  );
}
async function verify(rawBody, signature, timestamp, publicKey, subtleCrypto, algorithm = PlatformAlgorithm.NewNode, expirationTime = 15 * 6e4) {
  if (timestamp == null || signature == null || rawBody == null) {
    return false;
  }
  if (Math.abs(Date.now() / 1e3 - parseInt(timestamp, 10)) > expirationTime) {
    return false;
  }
  const key = await getCryptoKey(publicKey, subtleCrypto, algorithm);
  const name = typeof algorithm === "string" ? algorithm : algorithm.name;
  const isVerified = await subtleCrypto.verify(
    name,
    key,
    hexStringToBinary(signature),
    encoder.encode(`${timestamp ?? ""}${rawBody}`)
  );
  return isVerified;
}

// ../../node_modules/.pnpm/discord-verify@1.2.0/node_modules/discord-verify/dist/web.mjs
async function isValidRequest2(request, publicKey, algorithm = PlatformAlgorithm.Web) {
  return isValidRequest(request, publicKey, crypto.subtle, algorithm);
}

// ../../node_modules/.pnpm/itty-router@5.0.18/node_modules/itty-router/index.mjs
var t = ({ base: e = "", routes: t2 = [], ...r2 } = {}) => ({ __proto__: new Proxy({}, { get: (r3, o2, a2, s2) => (r4, ...c2) => t2.push([o2.toUpperCase?.(), RegExp(`^${(s2 = (e + r4).replace(/\/+(\/|$)/g, "$1")).replace(/(\/?\.?):(\w+)\+/g, "($1(?<$2>*))").replace(/(\/?\.?):(\w+)/g, "($1(?<$2>[^$1/]+?))").replace(/\./g, "\\.").replace(/(\/?)\*/g, "($1.*)?")}/*$`), c2, s2]) && a2 }), routes: t2, ...r2, async fetch(e2, ...o2) {
  let a2, s2, c2 = new URL(e2.url), n2 = e2.query = { __proto__: null };
  for (let [e3, t3] of c2.searchParams)
    n2[e3] = n2[e3] ? [].concat(n2[e3], t3) : t3;
  e:
    try {
      for (let t3 of r2.before || [])
        if (null != (a2 = await t3(e2.proxy ?? e2, ...o2)))
          break e;
      t:
        for (let [r3, n3, l2, i] of t2)
          if ((r3 == e2.method || "ALL" == r3) && (s2 = c2.pathname.match(n3))) {
            e2.params = s2.groups || {}, e2.route = i;
            for (let t3 of l2)
              if (null != (a2 = await t3(e2.proxy ?? e2, ...o2)))
                break t;
          }
    } catch (t3) {
      if (!r2.catch)
        throw t3;
      a2 = await r2.catch(t3, e2.proxy ?? e2, ...o2);
    }
  try {
    for (let t3 of r2.finally || [])
      a2 = await t3(a2, e2.proxy ?? e2, ...o2) ?? a2;
  } catch (t3) {
    if (!r2.catch)
      throw t3;
    a2 = await r2.catch(t3, e2.proxy ?? e2, ...o2);
  }
  return a2;
} });
var r = (e = "text/plain; charset=utf-8", t2) => (r2, o2 = {}) => {
  if (void 0 === r2 || r2 instanceof Response)
    return r2;
  const a2 = new Response(t2?.(r2) ?? r2, o2.url ? void 0 : o2);
  return a2.headers.set("content-type", e), a2;
};
var o = r("application/json; charset=utf-8", JSON.stringify);
var a = (e) => ({ 400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found", 500: "Internal Server Error" })[e] || "Unknown Error";
var s = (e = 500, t2) => {
  if (e instanceof Error) {
    const { message: r2, ...o2 } = e;
    e = e.status || 500, t2 = { error: r2 || a(e), ...o2 };
  }
  return t2 = { status: e, ..."object" == typeof t2 ? t2 : { error: t2 || a(e) } }, o(t2, { status: e });
};
var c = (e) => {
  e.proxy = new Proxy(e.proxy ?? e, { get: (t2, r2) => t2[r2]?.bind?.(e) ?? t2[r2] ?? t2?.params?.[r2] });
};
var n = ({ format: e = o, missing: r2 = () => s(404), finally: a2 = [], before: n2 = [], ...l2 } = {}) => t({ before: [c, ...n2], catch: s, finally: [(e2, ...t2) => e2 ?? r2(...t2), e, ...a2], ...l2 });
var l = class extends Error {
  status;
  constructor(e = 500, t2) {
    super("object" == typeof t2 ? t2.error : t2), "object" == typeof t2 && Object.assign(this, t2), this.status = e;
  }
};
var p = r("text/plain; charset=utf-8", String);
var f = r("text/html");
var u = r("image/jpeg");
var h = r("image/png");
var g = r("image/webp");

// ../../packages/carbon/dist/src/classes/Command.js
var Command = class extends BaseCommand {
  /**
   * The options that the user passes along with the command in Discord
   */
  options;
  /**
   * The type of command, either ChatInput, User, or Message. User and Message are context menu commands.
   * @default ChatInput
   */
  type = ApplicationCommandType.ChatInput;
  /**
   * The function that is called when the command's autocomplete is triggered.
   * @param interaction The interaction that triggered the autocomplete
   * @remarks You are expected to `override` this function to provide your own autocomplete functionality.
   */
  async autocomplete(interaction) {
    throw new Error(`The ${interaction.rawData.data.name} command does not support autocomplete`);
  }
  /**
   * @internal
   */
  serializeOptions() {
    return this.options;
  }
};

// ../../packages/carbon/dist/src/classes/CommandWithSubcommands.js
var CommandWithSubcommands = class extends BaseCommand {
  type = ApplicationCommandType.ChatInput;
  /**
   * @internal
   */
  serializeOptions() {
    return this.subcommands.map((subcommand) => ({
      name: subcommand.name,
      description: subcommand.description,
      type: ApplicationCommandOptionType.Subcommand,
      options: subcommand.serializeOptions()
    }));
  }
};

// ../../packages/carbon/dist/src/classes/CommandWithSubcommandGroups.js
var CommandWithSubcommandGroups = class extends CommandWithSubcommands {
  /**
   * The subcommands that the user can use
   */
  subcommands = [];
  /**
   * @internal
   */
  serializeOptions() {
    const subcommands = this.subcommands.map((subcommand) => ({
      name: subcommand.name,
      description: subcommand.description,
      type: ApplicationCommandOptionType.Subcommand,
      options: subcommand.serializeOptions()
    }));
    const subcommandGroups = this.subcommandGroups.map((subcommandGroup) => ({
      name: subcommandGroup.name,
      description: subcommandGroup.description,
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: subcommandGroup.serializeOptions()
    }));
    return [...subcommands, ...subcommandGroups];
  }
};

// ../../packages/carbon/dist/src/internals/OptionsHandler.js
var OptionsHandler = class extends Base {
  /**
   * The raw options that were in the interaction data, before they were parsed.
   */
  raw;
  /**
   * The errors that were encountered while parsing the options.
   */
  errors = [];
  constructor(client, options) {
    super(client);
    this.raw = options;
  }
  /**
   * Get the value of a string option.
   * @param key The name of the option to get the value of.
   * @returns The value of the option, or undefined if the option was not provided.
   */
  getString(key) {
    const value = this.raw.find((x) => x.name === key && x.type === ApplicationCommandOptionType.String)?.value;
    if (!value || typeof value !== "string")
      return void 0;
    return value;
  }
  /**
   * Get the value of an integer option.
   * @param key The name of the option to get the value of.
   * @returns The value of the option, or undefined if the option was not provided.
   */
  getInteger(key) {
    const num = this.raw.find((x) => x.name === key && x.type === ApplicationCommandOptionType.Integer)?.value;
    if (!num || typeof num !== "number" || !Number.isSafeInteger(num))
      return void 0;
    return num;
  }
  /**
   * Get the value of a number option.
   * @param key The name of the option to get the value of.
   * @returns The value of the option, or undefined if the option was not provided.
   */
  getNumber(key) {
    const value = this.raw.find((x) => x.name === key && x.type === ApplicationCommandOptionType.Number)?.value;
    if (!value || typeof value !== "number")
      return void 0;
    return value;
  }
  /**
   * Get the value of a boolean option.
   * @param key The name of the option to get the value of.
   * @returns The value of the option, or undefined if the option was not provided.
   */
  getBoolean(key) {
    const value = this.raw.find((x) => x.name === key && x.type === ApplicationCommandOptionType.Boolean)?.value;
    if (!value || typeof value !== "boolean")
      return void 0;
    return value;
  }
  /**
   * Get the value of a user option.
   * @param key The name of the option to get the value of.
   * @returns The value of the option, or undefined if the option was not provided.
   */
  getUser(key) {
    const id = this.raw.find((x) => x.name === key && x.type === ApplicationCommandOptionType.User)?.value;
    if (!id || typeof id !== "string")
      return void 0;
    return new User(this.client, id);
  }
  /**
   * Get the value of a channel option.
   * @param key The name of the option to get the value of.
   * @returns The value of the option, or undefined if the option was not provided.
   */
  async getChannel(key) {
    const id = this.raw.find((x) => x.name === key && x.type === ApplicationCommandOptionType.Channel)?.value;
    if (!id || typeof id !== "string")
      return void 0;
    const data = await this.client.rest.get(Routes.channel(id));
    return channelFactory(this.client, data);
  }
  /**
   * Get the value of a role option.
   * @param key The name of the option to get the value of.
   * @returns The value of the option, or undefined if the option was not provided.
   */
  getRole(key) {
    const id = this.raw.find((x) => x.name === key && x.type === ApplicationCommandOptionType.Role)?.value;
    if (!id || typeof id !== "string")
      return void 0;
    return new Role(this.client, id);
  }
  /**
   * Get the value of a mentionable option.
   * @param key The name of the option to get the value of.
   * @returns The value of the option, or undefined if the option was not provided.
   */
  async getMentionable(key) {
    const id = this.raw.find((x) => x.name === key && x.type === ApplicationCommandOptionType.Mentionable)?.value;
    if (!id || typeof id !== "string")
      return void 0;
    const user = new User(this.client, id);
    await user.fetch().catch(() => {
      return new Role(this.client, id);
    });
    return user;
  }
};

// ../../packages/carbon/dist/src/internals/AutocompleteInteraction.js
var AutocompleteInteraction = class extends BaseInteraction {
  /**
   * This is the options of the commands, parsed from the interaction data.
   */
  options;
  constructor(client, data, command) {
    super(client, data);
    if (data.type !== InteractionType.ApplicationCommandAutocomplete) {
      throw new Error("Invalid interaction type was used to create this class");
    }
    if (data.data.type !== ApplicationCommandType.ChatInput) {
      throw new Error("Invalid command type was used to create this class");
    }
    if (command instanceof Command && !data.data.options?.find((x) => x.type === ApplicationCommandOptionType.Subcommand || x.type === ApplicationCommandOptionType.SubcommandGroup)) {
      this.options = new AutocompleteOptionsHandler(client, data.data.options ?? []);
    }
  }
  async defer() {
    throw new Error("Defer is not available for autocomplete interactions");
  }
  async reply() {
    throw new Error("Reply is not available for autocomplete interactions");
  }
  /**
   * Respond with the choices for an autocomplete interaction
   */
  async respond(choices) {
    console.log(choices);
    await this.client.rest.post(Routes.interactionCallback(this.rawData.id, this.rawData.token), {
      body: {
        type: InteractionResponseType.ApplicationCommandAutocompleteResult,
        data: {
          choices
        }
      }
    });
  }
};
var AutocompleteOptionsHandler = class extends OptionsHandler {
  /**
   * Get the focused option (the one that is being autocompleted)
   */
  getFocused() {
    const focused = this.raw.find((x) => "focused" in x && x.focused);
    if (!focused)
      return null;
    switch (focused.type) {
      case ApplicationCommandOptionType.String:
        return this.getString(focused.name);
      case ApplicationCommandOptionType.Integer:
        return this.getInteger(focused.name);
      case ApplicationCommandOptionType.Number:
        return this.getNumber(focused.name);
      case ApplicationCommandOptionType.Boolean:
        return this.getBoolean(focused.name);
      default:
        return null;
    }
  }
};

// ../../packages/carbon/dist/src/internals/CommandInteraction.js
var CommandInteraction = class extends BaseInteraction {
  /**
   * This is the options of the commands, parsed from the interaction data.
   * It is only available if the command is a {@link Command} class, and the command is a ChatInput command.
   */
  options;
  constructor(client, data, command) {
    super(client, data);
    if (data.type !== InteractionType.ApplicationCommand) {
      throw new Error("Invalid interaction type was used to create this class");
    }
    if (command instanceof Command && data.data.type === ApplicationCommandType.ChatInput && !data.data.options?.find((x) => x.type === ApplicationCommandOptionType.Subcommand || x.type === ApplicationCommandOptionType.SubcommandGroup)) {
      this.options = new OptionsHandler(client, data.data.options ?? []);
    }
  }
};

// ../../packages/carbon/dist/src/internals/CommandHandler.js
var CommandHandler = class extends Base {
  getCommand(rawInteraction) {
    const command = this.client.commands.find((x) => x.name === rawInteraction.data.name);
    if (!command)
      throw new Error("Command not found");
    if (command instanceof CommandWithSubcommandGroups) {
      if (rawInteraction.data.type !== ApplicationCommandType.ChatInput) {
        throw new Error("Subcommand groups must be used with ChatInput");
      }
      const data = rawInteraction.data;
      const subcommandGroupName = data.options?.find((x) => x.type === ApplicationCommandOptionType.SubcommandGroup)?.name;
      if (!subcommandGroupName)
        throw new Error("No subcommand group name");
      const subcommandGroup = command.subcommandGroups.find((x) => x.name === subcommandGroupName);
      if (!subcommandGroup)
        throw new Error("Subcommand group not found");
      const subcommandName = (data.options?.find((x) => x.type === ApplicationCommandOptionType.SubcommandGroup)).options?.find((x) => x.type === ApplicationCommandOptionType.Subcommand)?.name;
      if (!subcommandName)
        throw new Error("No subcommand name");
      const subcommand = subcommandGroup.subcommands.find((x) => x.name === subcommandName);
      if (!subcommand)
        throw new Error("Subcommand not found");
      return subcommand;
    }
    if (command instanceof CommandWithSubcommands) {
      if (rawInteraction.data.type !== ApplicationCommandType.ChatInput) {
        throw new Error("Subcommands must be used with ChatInput");
      }
      const data = rawInteraction.data;
      const subcommand = command.subcommands.find((x) => x.name === data.options?.[0]?.name);
      if (!subcommand)
        throw new Error("Subcommand not found");
      return subcommand;
    }
    if (command instanceof Command) {
      return command;
    }
    throw new Error("Command is not a valid command type");
  }
  async handleCommandInteraction(rawInteraction) {
    const command = this.getCommand(rawInteraction);
    if (!command)
      return false;
    const interaction = new CommandInteraction(this.client, rawInteraction, command);
    try {
      const command2 = this.getCommand(rawInteraction);
      if (command2.defer) {
        await interaction.defer();
      }
      return await command2.run(interaction);
    } catch (e) {
      if (e instanceof Error)
        console.error(e.message);
      console.error(e);
    }
  }
  async handleAutocompleteInteraction(rawInteraction) {
    const command = this.getCommand(rawInteraction);
    if (!command)
      return false;
    const interaction = new AutocompleteInteraction(this.client, rawInteraction, command);
    try {
      const command2 = this.getCommand(rawInteraction);
      return await command2.autocomplete(interaction);
    } catch (e) {
      if (e instanceof Error)
        console.error(e.message);
      console.error(e);
    }
  }
};

// ../../packages/carbon/dist/src/classes/MentionableSelectMenu.js
var MentionableSelectMenu = class extends AnySelectMenu {
  type = ComponentType.MentionableSelect;
  defaultValues;
  serializeOptions() {
    return {
      type: this.type,
      default_values: this.defaultValues
    };
  }
};

// ../../packages/carbon/dist/src/classes/RoleSelectMenu.js
var RoleSelectMenu = class extends AnySelectMenu {
  type = ComponentType.RoleSelect;
  defaultValues;
  serializeOptions() {
    return {
      type: this.type,
      default_values: this.defaultValues
    };
  }
};

// ../../packages/carbon/dist/src/classes/StringSelectMenu.js
var StringSelectMenu = class extends AnySelectMenu {
  type = ComponentType.StringSelect;
  serializeOptions() {
    return {
      type: this.type,
      options: this.options
    };
  }
};

// ../../packages/carbon/dist/src/classes/UserSelectMenu.js
var UserSelectMenu = class extends AnySelectMenu {
  type = ComponentType.UserSelect;
  defaultValues;
  serializeOptions() {
    return {
      type: this.type,
      default_values: this.defaultValues
    };
  }
};

// ../../packages/carbon/dist/src/internals/ButtonInteraction.js
var ButtonInteraction = class extends BaseComponentInteraction {
  customId = splitCustomId(this.rawData.data.custom_id)[0];
  constructor(client, data) {
    super(client, data);
    if (!data.data)
      throw new Error("Invalid interaction data was used to create this class");
    if (data.type !== InteractionType.MessageComponent) {
      throw new Error("Invalid interaction type was used to create this class");
    }
    if (data.data.component_type !== ComponentType.Button) {
      throw new Error("Invalid component type was used to create this class");
    }
  }
};

// ../../packages/carbon/dist/src/internals/ChannelSelectMenuInteraction.js
var ChannelSelectMenuInteraction = class extends AnySelectMenuInteraction {
  constructor(client, data) {
    super(client, data);
    if (data.data.component_type !== ComponentType.ChannelSelect) {
      throw new Error("Invalid component type was used to create this class");
    }
  }
};

// ../../packages/carbon/dist/src/internals/MentionableSelectMenuInteraction.js
var MentionableSelectMenuInteraction = class extends AnySelectMenuInteraction {
  constructor(client, data) {
    super(client, data);
    if (data.data.component_type !== ComponentType.MentionableSelect) {
      throw new Error("Invalid component type was used to create this class");
    }
  }
  get values() {
    return this.rawData.data.values;
  }
};

// ../../packages/carbon/dist/src/internals/RoleSelectMenuInteraction.js
var RoleSelectMenuInteraction = class extends AnySelectMenuInteraction {
  constructor(client, data) {
    super(client, data);
    if (data.data.component_type !== ComponentType.RoleSelect) {
      throw new Error("Invalid component type was used to create this class");
    }
  }
  get values() {
    return this.rawData.data.values;
  }
};

// ../../packages/carbon/dist/src/internals/StringSelectMenuInteraction.js
var StringSelectMenuInteraction = class extends AnySelectMenuInteraction {
  constructor(client, data) {
    super(client, data);
    if (data.data.component_type !== ComponentType.StringSelect) {
      throw new Error("Invalid component type was used to create this class");
    }
  }
  get values() {
    return this.rawData.data.values;
  }
};

// ../../packages/carbon/dist/src/internals/UserSelectMenuInteraction.js
var UserSelectMenuInteraction = class extends AnySelectMenuInteraction {
  constructor(client, data) {
    super(client, data);
    if (data.data.component_type !== ComponentType.UserSelect) {
      throw new Error("Invalid component type was used to create this class");
    }
  }
  get values() {
    return this.rawData.data.values;
  }
};

// ../../packages/carbon/dist/src/internals/ComponentHandler.js
var ComponentHandler = class extends Base {
  async handleInteraction(data) {
    const allComponents = this.client.commands.filter((x) => x.components && x.components.length > 0).flatMap((x) => x.components);
    const component = allComponents.find((x) => x.customId === data.data.custom_id && x.type === data.data.component_type);
    if (!component)
      return false;
    if (component instanceof Button) {
      const interaction = new ButtonInteraction(this.client, data);
      if (component.defer)
        await interaction.defer();
      await component.run(interaction);
    } else if (component instanceof RoleSelectMenu) {
      const interaction = new RoleSelectMenuInteraction(this.client, data);
      if (component.defer)
        await interaction.defer();
      await component.run(interaction);
    } else if (component instanceof ChannelSelectMenu) {
      const interaction = new ChannelSelectMenuInteraction(this.client, data);
      if (component.defer)
        await interaction.defer();
      await component.run(interaction);
    } else if (component instanceof MentionableSelectMenu) {
      const interaction = new MentionableSelectMenuInteraction(this.client, data);
      if (component.defer)
        await interaction.defer();
      await component.run(interaction);
    } else if (component instanceof StringSelectMenu) {
      const interaction = new StringSelectMenuInteraction(this.client, data);
      if (component.defer)
        await interaction.defer();
      await component.run(interaction);
    } else if (component instanceof UserSelectMenu) {
      const interaction = new UserSelectMenuInteraction(this.client, data);
      if (component.defer)
        await interaction.defer();
      await component.run(interaction);
    } else {
      throw new Error(`Unknown component with type ${data.data.component_type} and custom ID ${data.data.custom_id}`);
    }
  }
};

// ../../packages/carbon/dist/src/classes/Client.js
var ClientMode;
(function(ClientMode2) {
  ClientMode2["NodeJS"] = "node";
  ClientMode2["CloudflareWorkers"] = "cloudflare";
  ClientMode2["Bun"] = "bun";
  ClientMode2["Vercel"] = "vercel";
  ClientMode2["Web"] = "web";
})(ClientMode || (ClientMode = {}));
var Client = class {
  /**
   * The options used to initialize the client
   */
  options;
  /**
   * The commands that the client has registered
   */
  commands;
  /**
   * The router used to handle requests
   */
  router;
  /**
   * The rest client used to interact with the Discord API
   */
  rest;
  /**
   * The handler for the component interactions sent from Discord
   */
  componentHandler;
  commandHandler;
  /**
   * Creates a new client
   * @param options The options used to initialize the client
   * @param commands The commands that the client has registered
   */
  constructor(options, commands) {
    if (!options.clientId)
      throw new Error("Missing client ID");
    if (!options.publicKey)
      throw new Error("Missing public key");
    if (!options.token)
      throw new Error("Missing token");
    this.options = options;
    this.commands = commands;
    const routerData = this.options.mode === ClientMode.Bun && this.options.port ? { port: this.options.port } : {};
    this.router = n(routerData);
    this.rest = new RequestClient(options.token, options.requestOptions);
    this.componentHandler = new ComponentHandler(this);
    this.commandHandler = new CommandHandler(this);
    this.setupRoutes();
    if (this.options.autoDeploy)
      this.deployCommands();
  }
  /**
   * Deploy the commands registered to Discord.
   * This is automatically called when running in NodeJS mode.
   */
  async deployCommands() {
    try {
      const commands = this.commands.map((command) => {
        return command.serialize();
      });
      await this.rest.put(Routes.applicationCommands(this.options.clientId), {
        body: commands
      });
      console.log(`Deployed ${commands.length} commands to Discord`);
    } catch (err) {
      console.error("Failed to deploy commands");
      console.error(err);
    }
  }
  /**
   * Setup the routes for the client
   */
  setupRoutes() {
    this.router.get("/", () => {
      if (this.options.redirectUrl)
        return Response.redirect(this.options.redirectUrl, 302);
      throw new l(404);
    });
    this.router.post(this.options.interactionRoute || "/interaction", async (req, ctx) => {
      return await this.handle(req, ctx);
    });
  }
  /**
   * If you want use a custom handler for HTTP requests instead of Carbon's router, you can use this method.
   * @param req The request to handle
   * @param ctx Cloudflare Workers only. The execution context of the request, provided in the fetch handler from CF.
   * @returns A response to send back to the client.
   */
  async handle(req, ctx) {
    const isValid = await this.validateInteraction(req);
    if (!isValid) {
      return new Response("Invalid request signature", { status: 401 });
    }
    const rawInteraction = await req.json();
    if (rawInteraction.type === InteractionType.Ping) {
      return o({
        type: InteractionResponseType.Pong
      });
    }
    if (rawInteraction.type === InteractionType.ApplicationCommand) {
      if (ctx?.waitUntil) {
        ctx.waitUntil((async () => {
          await this.commandHandler.handleCommandInteraction(rawInteraction);
        })());
      } else {
        await this.commandHandler.handleCommandInteraction(rawInteraction);
      }
    }
    if (rawInteraction.type === InteractionType.ApplicationCommandAutocomplete) {
      if (ctx?.waitUntil) {
        ctx.waitUntil((async () => {
          await this.commandHandler.handleAutocompleteInteraction(rawInteraction);
        })());
      } else {
        await this.commandHandler.handleAutocompleteInteraction(rawInteraction);
      }
    }
    if (rawInteraction.type === InteractionType.MessageComponent) {
      if (ctx?.waitUntil) {
        ctx.waitUntil((async () => {
          await this.componentHandler.handleInteraction(rawInteraction);
        })());
      } else {
        await this.componentHandler.handleInteraction(rawInteraction);
      }
    }
    return new Response(null, { status: 202 });
  }
  /**
   * Validate the interaction request
   * @param req The request to validate
   */
  async validateInteraction(req) {
    if (req.method !== "POST") {
      throw new l(405);
    }
    const isValid = await isValidRequest2(req, this.options.publicKey, this.options.mode === ClientMode.CloudflareWorkers ? PlatformAlgorithm.Cloudflare : this.options.mode === ClientMode.Vercel ? PlatformAlgorithm.VercelProd : this.options.mode === ClientMode.Web ? PlatformAlgorithm.Web : PlatformAlgorithm.NewNode);
    return isValid;
  }
};

// ../../packages/carbon/dist/src/classes/Row.js
var Row = class {
  /**
   * The components in the action row
   */
  components;
  constructor(components) {
    this.components = components;
  }
  /**
   * Add a component to the action row
   * @param component The component to add
   */
  addComponent(component) {
    this.components.push(component);
  }
  /**
   * Remove a component from the action row
   * @param component The component to remove
   */
  removeComponent(component) {
    const index = this.components.indexOf(component);
    if (index === -1)
      return;
    this.components.splice(index, 1);
  }
  /**
   * Remove all components from the action row
   */
  removeAllComponents() {
    this.components = [];
  }
  serialize() {
    return {
      type: 1,
      components: this.components.map((component) => component.serialize())
    };
  }
};

// src/commands/ping.ts
var PingCommand = class extends Command {
  name = "ping";
  description = "A simple ping command";
  defer = false;
  async run(interaction) {
    return interaction.reply({
      content: "Pong <:caughtIn4k:1145473115703496816>"
    });
  }
};

// src/commands/testing/button.ts
var ButtonCommand = class extends Command {
  name = "button";
  description = "A simple command with a button!";
  defer = true;
  components = [new PingButton(), new Link()];
  async run(interaction) {
    await interaction.reply({
      content: "Pong <:caughtIn4k:1145473115703496816>",
      components: [new Row([new PingButton(), new Link()])]
    });
  }
};
var PingButton = class extends Button {
  customId = "ping";
  label = "Ping";
  style = ButtonStyle.Primary;
  async run(interaction) {
    await interaction.reply({ content: "OMG YOU CLICKED THE BUTTON" });
  }
};
var Link = class extends LinkButton {
  label = "Link";
  url = "https://buape.com";
};

// src/commands/testing/every_select.ts
var SelectCommand = class extends Command {
  name = "every_select";
  description = "Send every select menu";
  defer = true;
  components = [
    new StringSelect(),
    new RoleSelect(),
    new MentionableSelect(),
    new ChannelSelect(),
    new UserSelect()
  ];
  async run(interaction) {
    interaction.reply({
      content: "Select menus! <:caughtIn4k:1145473115703496816>",
      components: [
        new Row([new StringSelect()]),
        new Row([new RoleSelect()]),
        new Row([new MentionableSelect()]),
        new Row([new ChannelSelect()]),
        new Row([new UserSelect()])
      ]
    });
  }
};
var StringSelect = class extends StringSelectMenu {
  customId = "string-select";
  placeholder = "String select menu";
  options = [{ label: "Option 1", value: "option1" }];
  async run(interaction) {
    interaction.reply({ content: interaction.values.join(", ") });
  }
};
var RoleSelect = class extends RoleSelectMenu {
  customId = "role-select";
  placeholder = "Role select menu";
  async run(interaction) {
    interaction.reply({ content: interaction.values.join(", ") });
  }
};
var MentionableSelect = class extends MentionableSelectMenu {
  customId = "mentionable-select";
  placeholder = "Mentionable select menu";
  async run(interaction) {
    interaction.reply({ content: interaction.values.join(", ") });
  }
};
var ChannelSelect = class extends ChannelSelectMenu {
  customId = "channel-select";
  placeholder = "Channel select menu";
  async run(interaction) {
    interaction.reply({ content: interaction.values.join(", ") });
  }
};
var UserSelect = class extends UserSelectMenu {
  customId = "user-select";
  placeholder = "User select menu";
  async run(interaction) {
    interaction.reply({ content: interaction.values.join(", ") });
  }
};

// src/commands/testing/options.ts
var Options = class extends Command {
  name = "options";
  description = "Options test";
  defer = true;
  options = [
    {
      name: "str",
      type: ApplicationCommandOptionType.String,
      description: "DESCRIPTION",
      required: true
    }
  ];
  async run(interaction) {
    interaction.reply({
      content: `${interaction.options?.getString("str")}`
    });
  }
};

// src/commands/testing/subcommand.ts
var Sub1 = class extends Command {
  name = "sub1";
  description = "Subcommand 1";
  defer = true;
  async run(interaction) {
    interaction.reply({ content: "Subcommand 1" });
  }
};
var Sub2 = class extends Command {
  name = "sub2";
  description = "Subcommand 2";
  defer = true;
  async run(interaction) {
    interaction.reply({ content: "Subcommand 2" });
  }
};
var Subc = class extends CommandWithSubcommands {
  name = "subc";
  description = "Subcommands!";
  defer = true;
  subcommands = [new Sub1(), new Sub2()];
};

// src/commands/testing/subcommandgroup.ts
var Sub12 = class extends Command {
  name = "sub1";
  description = "Subcommand 1";
  defer = true;
  async run(interaction) {
    interaction.reply({ content: "Subcommand 1" });
  }
};
var Sub22 = class extends Command {
  name = "sub2";
  description = "Subcommand 2";
  defer = true;
  async run(interaction) {
    interaction.reply({ content: "Subcommand 2" });
  }
};
var Subc2 = class extends CommandWithSubcommands {
  name = "subc";
  description = "Subcommands!";
  defer = true;
  subcommands = [new Sub12(), new Sub22()];
};
var Subc22 = class extends CommandWithSubcommands {
  name = "subc2";
  description = "Subcommands!";
  defer = true;
  subcommands = [new Sub12(), new Sub22()];
};
var SubcG = class extends CommandWithSubcommandGroups {
  name = "subg";
  description = "Subcommand group!";
  subcommandGroups = [new Subc2(), new Subc22()];
};

// src/index.ts
var src_default = {
  async fetch(request, _env, ctx) {
    const client = new Client(
      {
        clientId: _env.CLIENT_ID,
        publicKey: _env.PUBLIC_KEY,
        token: _env.DISCORD_TOKEN,
        mode: ClientMode.CloudflareWorkers
      },
      [
        new ButtonCommand(),
        new Options(),
        new PingCommand(),
        new SelectCommand(),
        new Subc(),
        new SubcG()
      ]
    );
    if (request.url.endsWith("/deploy")) {
      await client.deployCommands();
      return new Response("Deployed commands");
    }
    const response = await client.router.fetch(request, ctx);
    return response;
  }
};
export {
  src_default as default
};
//# sourceMappingURL=index.js.map
