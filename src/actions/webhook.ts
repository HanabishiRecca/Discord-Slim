import { METHODS, PATHS, Path, Query } from './_common';
import { Request, RequestOptions } from '../request';
import type * as helpers from '../helpers';
import type * as types from '../types';

export const Create = (channel_id: string, params: {
    name: string;
    avatar?: string | null;
}, requestOptions?: RequestOptions) =>
    Request<types.Webhook>(METHODS.POST, Path(PATHS.channels, channel_id, PATHS.webhooks), requestOptions, params);

export const Get = (webhook_id: string, requestOptions?: RequestOptions) =>
    Request<types.Webhook>(METHODS.GET, Path(PATHS.webhooks, webhook_id), requestOptions);

export const GetWithToken = (webhook_id: string, webhook_token: string, requestOptions?: RequestOptions) =>
    Request<types.Webhook>(METHODS.GET, Path(PATHS.webhooks, webhook_id, webhook_token), requestOptions);

export const Modify = (webhook_id: string, params: {
    name?: string;
    avatar?: string | null;
    channel_id?: string;
}, requestOptions?: RequestOptions) =>
    Request<types.Webhook>(METHODS.PATCH, Path(PATHS.webhooks, webhook_id), requestOptions, params);

export const ModifyWithToken = (webhook_id: string, webhook_token: string, params: {
    name?: string;
    avatar?: string | null;
}, requestOptions?: RequestOptions) =>
    Request<types.Webhook>(METHODS.PATCH, Path(PATHS.webhooks, webhook_id, webhook_token), requestOptions, params);

export const Delete = (webhook_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.webhooks, webhook_id), requestOptions);

export const DeleteWithToken = (webhook_id: string, webhook_token: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.webhooks, webhook_id, webhook_token), requestOptions);

export const Execute = <T extends boolean>(webhook_id: string, webhook_token: string, params1: {
    content?: string;
    username?: string;
    avatar_url?: string;
    tts?: string;
    embeds?: types.Embed[];
    allowed_mentions?: types.AllowedMentions;
    components?: types.ActionRow[];
    flags?: helpers.MessageFlags;
}, params2?: {
    wait?: T;
    thread_id?: string;
}, requestOptions?: RequestOptions) =>
    Request<T extends true ?
        types.Message : null
    >(METHODS.POST, Path(PATHS.webhooks, webhook_id, webhook_token) + Query(params2), requestOptions, params1);

export const ExecuteSlack = (webhook_id: string, webhook_token: string, params?: {
    thread_id?: string;
    wait?: boolean;
}, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.POST, Path(PATHS.webhooks, webhook_id, webhook_token, PATHS.slack) + Query(params), requestOptions);

export const ExecuteGitHub = (webhook_id: string, webhook_token: string, params?: {
    thread_id?: string;
    wait?: boolean;
}, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.POST, Path(PATHS.webhooks, webhook_id, webhook_token, PATHS.github) + Query(params), requestOptions);

export const GetMessage = (webhook_id: string, webhook_token: string, message_id: string, params?: {
    thread_id?: string;
}, requestOptions?: RequestOptions) =>
    Request<types.Message>(METHODS.GET, Path(PATHS.webhooks, webhook_id, webhook_token, PATHS.messages, message_id) + Query(params), requestOptions);

export const EditMessage = (webhook_id: string, webhook_token: string, message_id: string, params1: {
    content?: string;
    embeds?: types.Embed[];
    allowed_mentions?: types.AllowedMentions;
    components?: types.ActionRow[];
    attachments?: types.Attachment[];
}, params2?: {
    thread_id?: string;
}, requestOptions?: RequestOptions) =>
    Request<types.Message>(METHODS.PATCH, Path(PATHS.webhooks, webhook_id, webhook_token, PATHS.messages, message_id) + Query(params2), requestOptions, params1);

export const DeleteMessage = (webhook_id: string, webhook_token: string, message_id: string, params?: {
    thread_id?: string;
}, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.webhooks, webhook_id, webhook_token, PATHS.messages, message_id) + Query(params), requestOptions);
