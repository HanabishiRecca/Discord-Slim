import { METHODS, PATHS, Path, Query } from './_common';
import { Request, RequestOptions } from '../request';
import type * as types from '../types';

export const GetCurrent = (requestOptions?: RequestOptions) =>
    Request<types.User>(METHODS.GET, Path(PATHS.users, PATHS.me), requestOptions);

export const Get = (user_id: string, requestOptions?: RequestOptions) =>
    Request<types.User>(METHODS.GET, Path(PATHS.users, user_id), requestOptions);

export const ModifyCurrent = (params: {
    username?: string;
    avatar?: string | null;
}, requestOptions?: RequestOptions) =>
    Request<types.User>(METHODS.PATCH, Path(PATHS.users, PATHS.me), requestOptions, params);

export const GetCurrentGuilds = (params?: {
    limit?: number;
} & ({
    before?: string;
    after?: undefined;
} | {
    before?: undefined;
    after?: string;
}), requestOptions?: RequestOptions) =>
    Request<(types.Guild & {
        owner: boolean;
        permissions: string;
    })[]>(METHODS.GET, Path(PATHS.users, PATHS.me, PATHS.guilds) + Query(params), requestOptions);

export const GetCurrentMember = (guild_id: string, requestOptions?: RequestOptions) =>
    Request<types.Member>(METHODS.GET, Path(PATHS.users, PATHS.me, PATHS.guilds, guild_id, PATHS.member), requestOptions);

export const LeaveGuild = (guild_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.users, PATHS.me, PATHS.guilds, guild_id), requestOptions);

export const GetConnections = (requestOptions?: RequestOptions) =>
    Request<types.Connection[]>(METHODS.GET, Path(PATHS.users, PATHS.me, PATHS.connections), requestOptions);
