import { METHODS, PATHS, Path } from './_common';
import { Request, RequestOptions } from '../request';
import type * as types from '../types';

export const Get = (guild_id: string, user_id: string, requestOptions?: RequestOptions) =>
    Request<types.Member>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.members, user_id), requestOptions);

export const Add = (guild_id: string, user_id: string, params: {
    access_token: string;
    nick?: string;
    roles?: string[];
    mute?: boolean;
    deaf?: boolean;
}, requestOptions?: RequestOptions) =>
    Request<types.Member | null>(METHODS.PUT, Path(PATHS.guilds, guild_id, PATHS.members, user_id), requestOptions, params);

export const Modify = (guild_id: string, user_id: string, params: {
    nick?: string | null;
    roles?: string[] | null;
    mute?: boolean | null;
    deaf?: boolean | null;
    channel_id?: string | null;
    communication_disabled_until?: string | null;
}, requestOptions?: RequestOptions) =>
    Request<types.Member>(METHODS.PATCH, Path(PATHS.guilds, guild_id, PATHS.members, user_id), requestOptions, params);

export const ModifyCurrent = (guild_id: string, params: {
    nick?: string | null;
}, requestOptions?: RequestOptions) =>
    Request<types.Member>(METHODS.PATCH, Path(PATHS.guilds, guild_id, PATHS.members, PATHS.me), requestOptions, params);

export const AddRole = (guild_id: string, user_id: string, role_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.PUT, Path(PATHS.guilds, guild_id, PATHS.members, user_id, PATHS.roles, role_id), requestOptions);

export const RemoveRole = (guild_id: string, user_id: string, role_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.guilds, guild_id, PATHS.members, user_id, PATHS.roles, role_id), requestOptions);

export const Remove = (guild_id: string, user_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.guilds, guild_id, PATHS.members, user_id), requestOptions);
