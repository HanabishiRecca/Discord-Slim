import { METHODS, PATHS, Path, Query } from './_common';
import { Request, RequestOptions } from '../request';
import type * as helpers from '../helpers';
import type * as types from '../types';

export const Get = (channel_id: string, message_id: string, requestOptions?: RequestOptions) =>
    Request<types.Message>(METHODS.GET, Path(PATHS.channels, channel_id, PATHS.messages, message_id), requestOptions);

export const Create = (channel_id: string, params: {
    content?: string;
    nonce?: number | string;
    tts?: string;
    embeds?: types.Embed[];
    allowed_mentions?: types.AllowedMentions;
    message_reference?: {
        message_id: string;
        channel_id?: string;
        guild_id?: string;
        fail_if_not_exists?: boolean;
    };
    components?: types.ActionRow[];
    sticker_ids?: string[];
    flags?: helpers.MessageFlags;
}, requestOptions?: RequestOptions) =>
    Request<types.Message>(METHODS.POST, Path(PATHS.channels, channel_id, PATHS.messages), requestOptions, params);

export const Crosspost = (channel_id: string, message_id: string, requestOptions?: RequestOptions) =>
    Request<types.Message>(METHODS.POST, Path(PATHS.channels, channel_id, PATHS.messages, message_id, PATHS.crosspost), requestOptions);

export const Delete = (channel_id: string, message_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.channels, channel_id, PATHS.messages, message_id), requestOptions);

export const Edit = (channel_id: string, message_id: string, params: {
    content?: string;
    embeds?: types.Embed[];
    flags?: helpers.MessageFlags;
    allowed_mentions?: types.AllowedMentions;
    components?: types.ActionRow[];
    attachments?: types.Attachment[];
}, requestOptions?: RequestOptions) =>
    Request<types.Message>(METHODS.PATCH, Path(PATHS.channels, channel_id, PATHS.messages, message_id), requestOptions, params);

export const Pin = (channel_id: string, message_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.PUT, Path(PATHS.channels, channel_id, PATHS.pins, message_id), requestOptions);

export const Unpin = (channel_id: string, message_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.channels, channel_id, PATHS.pins, message_id), requestOptions);

export const GetReactions = (channel_id: string, message_id: string, emoji: string, params?: {
    after?: string;
    limit?: number;
}, requestOptions?: RequestOptions) =>
    Request<types.User[]>(METHODS.GET, Path(PATHS.channels, channel_id, PATHS.messages, message_id, PATHS.reactions, encodeURIComponent(emoji)) + Query(params), requestOptions);

export const DeleteAllReactions = (channel_id: string, message_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.channels, channel_id, PATHS.messages, message_id, PATHS.reactions), requestOptions);

export const DeleteAllReactionsForEmoji = (channel_id: string, message_id: string, emoji: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.channels, channel_id, PATHS.messages, message_id, PATHS.reactions, encodeURIComponent(emoji)), requestOptions);
