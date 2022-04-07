import { METHODS, PATHS, Path } from './_common';
import { Request, RequestOptions } from '../request';
import type * as types from '../types';

export const Get = (guild_id: string, user_id: string, requestOptions?: RequestOptions) =>
    Request<types.Ban>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.bans, user_id), requestOptions);

export const Add = (guild_id: string, user_id: string, params?: {
    delete_message_days?: number;
}, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.PUT, Path(PATHS.guilds, guild_id, PATHS.bans, user_id), requestOptions, params);

export const Remove = (guild_id: string, user_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.guilds, guild_id, PATHS.bans, user_id), requestOptions);
