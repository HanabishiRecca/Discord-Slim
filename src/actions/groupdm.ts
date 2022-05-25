import { METHODS, PATHS, Path } from './_common';
import { Request, RequestOptions } from '../request';
import type * as types from '../types';

export const AddRecipient = (channel_id: string, user_id: string, params: {
    access_token: string;
    nick: string;
}, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.PUT, Path(PATHS.channels, channel_id, PATHS.recipients, user_id), requestOptions, params);

export const RemoveRecipient = (channel_id: string, user_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.channels, channel_id, PATHS.recipients, user_id), requestOptions);

export const Modify = (id: string, params: {
    name?: string;
    icon?: string;
}, requestOptions?: RequestOptions) =>
    Request<types.GroupDMChannel>(METHODS.PATCH, Path(PATHS.channels, id), requestOptions, params);

export const Create = (params: {
    access_tokens: string[];
    nicks: {
        [id: string]: string;
    };
}, requestOptions?: RequestOptions) =>
    Request<types.DMChannel>(METHODS.POST, Path(PATHS.users, PATHS.me, PATHS.channels), requestOptions, params);

export const Close = (channel_id: string, requestOptions?: RequestOptions) =>
    Request<types.GroupDMChannel>(METHODS.DELETE, Path(PATHS.channels, channel_id), requestOptions);
