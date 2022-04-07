import { METHODS, PATHS, Path } from './_common';
import { Request, RequestOptions } from '../request';
import type * as helpers from '../helpers';
import type * as types from '../types';

export const Modify = (thread_id: string, params: {
    name?: string;
    archived?: boolean;
    auto_archive_duration?: helpers.ThreadArchiveDurations;
    locked?: boolean;
    invitable?: boolean;
    rate_limit_per_user?: number | null;
}, requestOptions?: RequestOptions) =>
    Request<types.Thread>(METHODS.PATCH, Path(PATHS.channels, thread_id), requestOptions, params);

export const Delete = (thread_id: string, requestOptions?: RequestOptions) =>
    Request<types.Thread>(METHODS.DELETE, Path(PATHS.channels, thread_id), requestOptions);

export const StartWithMessage = (channel_id: string, message_id: string, params: {
    name: string;
    auto_archive_duration?: helpers.ThreadArchiveDurations;
    rate_limit_per_user?: number | null;
}, requestOptions?: RequestOptions) =>
    Request<types.Thread>(METHODS.POST, Path(PATHS.channels, channel_id, PATHS.messages, message_id, PATHS.threads), requestOptions, params);

export const Start = (channel_id: string, params: {
    name: string;
    auto_archive_duration?: helpers.ThreadArchiveDurations;
    type?: helpers.ChannelTypes.GUILD_PRIVATE_THREAD | helpers.ChannelTypes.GUILD_PUBLIC_THREAD | helpers.ChannelTypes.GUILD_NEWS_THREAD;
    invitable?: boolean;
    rate_limit_per_user?: number | null;
}, requestOptions?: RequestOptions) =>
    Request<types.Thread>(METHODS.POST, Path(PATHS.channels, channel_id, PATHS.threads), requestOptions, params);

export const Join = (thread_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.PUT, Path(PATHS.channels, thread_id, PATHS.thread_members, PATHS.me), requestOptions);

export const AddMember = (thread_id: string, user_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.PUT, Path(PATHS.channels, thread_id, PATHS.thread_members, user_id), requestOptions);

export const Leave = (thread_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.channels, thread_id, PATHS.thread_members, PATHS.me), requestOptions);

export const RemoveMember = (thread_id: string, user_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.channels, thread_id, PATHS.thread_members, user_id), requestOptions);

export const GetMember = (thread_id: string, user_id: string, requestOptions?: RequestOptions) =>
    Request<types.ThreadMember>(METHODS.GET, Path(PATHS.channels, thread_id, PATHS.thread_members, user_id), requestOptions);

export const ListMembers = (thread_id: string, requestOptions?: RequestOptions) =>
    Request<types.ThreadMember[]>(METHODS.GET, Path(PATHS.channels, thread_id, PATHS.thread_members), requestOptions);
