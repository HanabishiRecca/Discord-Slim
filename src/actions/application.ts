import { METHODS, PATHS, Path, Query } from './_common';
import { Request, RequestOptions } from '../request';
import type * as helpers from '../helpers';
import type * as types from '../types';

export const GetGlobalCommands = (application_id: string, params?: {
    with_localizations?: boolean;
}, requestOptions?: RequestOptions) =>
    Request<(types.ApplicationCommand & {
        name_localized?: string;
        description_localized?: string;
    })[]>(METHODS.GET, Path(PATHS.applications, application_id, PATHS.commands) + Query(params), requestOptions);

export const CreateGlobalCommand = (application_id: string, params: types.ApplicationCommandBase, requestOptions?: RequestOptions) =>
    Request<types.ApplicationCommand>(METHODS.POST, Path(PATHS.applications, application_id, PATHS.commands), requestOptions, params);

export const GetGlobalCommand = (application_id: string, command_id: string, requestOptions?: RequestOptions) =>
    Request<types.ApplicationCommand>(METHODS.GET, Path(PATHS.applications, application_id, PATHS.commands, command_id), requestOptions);

export const EditGlobalCommand = (application_id: string, command_id: string, params: Partial<Omit<types.ApplicationCommandBase, 'type'>>, requestOptions?: RequestOptions) =>
    Request<types.ApplicationCommand>(METHODS.PATCH, Path(PATHS.applications, application_id, PATHS.commands, command_id), requestOptions, params);

export const DeleteGlobalCommand = (application_id: string, command_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.applications, application_id, PATHS.commands, command_id), requestOptions);

export const GetGuildCommands = (application_id: string, guild_id: string, params?: {
    with_localizations?: boolean;
}, requestOptions?: RequestOptions) =>
    Request<(types.ApplicationCommand & {
        name_localized?: string;
        description_localized?: string;
        dm_permission?: undefined;
    })[]>(METHODS.GET, Path(PATHS.applications, application_id, PATHS.guilds, guild_id, PATHS.commands) + Query(params), requestOptions);

export const BulkOverwriteGlobalCommands = (application_id: string, params: types.ApplicationCommandBase[], requestOptions?: RequestOptions) =>
    Request<types.ApplicationCommand[]>(METHODS.PUT, Path(PATHS.applications, application_id, PATHS.commands), requestOptions, params);

export const CreateGuildCommand = (application_id: string, guild_id: string, params: types.ApplicationCommandBase & {
    dm_permission?: undefined;
}, requestOptions?: RequestOptions) =>
    Request<types.ApplicationCommand>(METHODS.POST, Path(PATHS.applications, application_id, PATHS.guilds, guild_id, PATHS.commands), requestOptions, params);

export const GetGuildCommand = (application_id: string, guild_id: string, command_id: string, requestOptions?: RequestOptions) =>
    Request<types.ApplicationCommand & {
        dm_permission?: undefined;
    }>(METHODS.GET, Path(PATHS.applications, application_id, PATHS.guilds, guild_id, PATHS.commands, command_id), requestOptions);

export const EditGuildCommand = (application_id: string, guild_id: string, command_id: string, params: Partial<Omit<types.ApplicationCommandBase, (
    | 'type'
    | 'dm_permission'
)>>, requestOptions?: RequestOptions) =>
    Request<types.ApplicationCommand & {
        dm_permission?: undefined;
    }>(METHODS.PATCH, Path(PATHS.applications, application_id, PATHS.guilds, guild_id, PATHS.commands, command_id), requestOptions, params);

export const DeleteGuildCommand = (application_id: string, guild_id: string, command_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.applications, application_id, PATHS.guilds, guild_id, PATHS.commands, command_id), requestOptions);

export const BulkOverwriteGuildCommands = (application_id: string, guild_id: string, params: (types.ApplicationCommandBase & {
    dm_permission?: undefined;
})[], requestOptions?: RequestOptions) =>
    Request<(types.ApplicationCommand & {
        dm_permission?: undefined;
    })[]>(METHODS.PUT, Path(PATHS.applications, application_id, PATHS.guilds, guild_id, PATHS.commands), requestOptions, params);

export const GetGuildCommandPermissions = (application_id: string, guild_id: string, requestOptions?: RequestOptions) =>
    Request<types.GuildApplicationCommandPermissions[]>(METHODS.GET, Path(PATHS.applications, application_id, PATHS.guilds, guild_id, PATHS.commands, PATHS.permissions), requestOptions);

export const GetCommandPermissions = (application_id: string, guild_id: string, command_id: string, requestOptions?: RequestOptions) =>
    Request<types.GuildApplicationCommandPermissions>(METHODS.GET, Path(PATHS.applications, application_id, PATHS.guilds, guild_id, PATHS.commands, command_id, PATHS.permissions), requestOptions);

export const EditCommandPermissions = (application_id: string, guild_id: string, command_id: string, params: {
    permissions: types.ApplicationCommandPermissions[];
}, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.PUT, Path(PATHS.applications, application_id, PATHS.guilds, guild_id, PATHS.commands, command_id, PATHS.permissions), requestOptions, params);

export const CreateInteractionResponse = (interaction_id: string, interaction_token: string, params: types.InteractionResponse, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.POST, Path(PATHS.interactions, interaction_id, interaction_token, PATHS.callback), requestOptions, params);

export const GetOriginalInteractionResponse = (application_id: string, interaction_token: string, requestOptions?: RequestOptions) =>
    Request<types.Message>(METHODS.GET, Path(PATHS.webhooks, application_id, interaction_token, PATHS.messages, PATHS.original), requestOptions);

export const EditOriginalInteractionResponse = (application_id: string, interaction_token: string, params: {
    content?: string;
    embeds?: types.Embed[];
    allowed_mentions?: types.AllowedMentions;
    components?: types.ActionRow[];
}, requestOptions?: RequestOptions) =>
    Request<types.Message>(METHODS.PATCH, Path(PATHS.webhooks, application_id, interaction_token, PATHS.messages, PATHS.original), requestOptions, params);

export const DeleteOriginalInteractionResponse = (application_id: string, interaction_token: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.webhooks, application_id, interaction_token, PATHS.messages, PATHS.original), requestOptions);

export const CreateFollowupMessage = (application_id: string, interaction_token: string, params: {
    content?: string;
    username?: string;
    avatar_url?: string;
    tts?: string;
    embeds?: types.Embed[];
    allowed_mentions?: types.AllowedMentions;
    flags?: helpers.MessageFlags;
    components?: types.ActionRow[];
}, requestOptions?: RequestOptions) =>
    Request<types.Message | null>(METHODS.POST, Path(PATHS.webhooks, application_id, interaction_token), requestOptions, params);

export const GetFollowupMessage = (application_id: string, interaction_token: string, message_id: string, requestOptions?: RequestOptions) =>
    Request<types.Message>(METHODS.GET, Path(PATHS.webhooks, application_id, interaction_token, PATHS.messages, message_id), requestOptions);

export const EditFollowupMessage = (application_id: string, interaction_token: string, message_id: string, params: {
    content?: string;
    embeds?: types.Embed[];
    allowed_mentions?: types.AllowedMentions;
    components?: types.ActionRow[];
}, requestOptions?: RequestOptions) =>
    Request<types.Message>(METHODS.PATCH, Path(PATHS.webhooks, application_id, interaction_token, PATHS.messages, message_id), requestOptions, params);

export const DeleteFollowupMessage = (application_id: string, interaction_token: string, message_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.webhooks, application_id, interaction_token, PATHS.messages, message_id), requestOptions);
