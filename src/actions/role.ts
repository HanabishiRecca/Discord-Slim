import { METHODS, PATHS, Path } from './_common';
import { Request, RequestOptions } from '../request';
import type * as types from '../types';

export const Create = (guild_id: string, params?: {
    name?: string;
    permissions?: string;
    color?: number;
    hoist?: boolean;
    icon?: string;
    unicode_emoji?: string;
    mentionable?: boolean;
}, requestOptions?: RequestOptions) =>
    Request<types.Role>(METHODS.POST, Path(PATHS.guilds, guild_id, PATHS.roles), requestOptions, params);

export const Modify = (guild_id: string, role_id: string, params?: {
    name?: string | null;
    permissions?: string | null;
    color?: number | null;
    hoist?: boolean | null;
    icon?: string | null;
    unicode_emoji?: string | null;
    mentionable?: boolean | null;
}, requestOptions?: RequestOptions) =>
    Request<types.Role>(METHODS.PATCH, Path(PATHS.guilds, guild_id, PATHS.roles, role_id), requestOptions, params);

export const Delete = (guild_id: string, role_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.guilds, guild_id, PATHS.roles, role_id), requestOptions);
