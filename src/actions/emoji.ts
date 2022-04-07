import { METHODS, PATHS, Path } from './_common';
import { Request, RequestOptions } from '../request';
import type * as types from '../types';

export const Get = (guild_id: string, emoji_id: string, requestOptions?: RequestOptions) =>
    Request<types.Emoji>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.emojis, emoji_id), requestOptions);

export const Add = (guild_id: string, params: {
    name: string;
    image: string;
    roles?: string[];
}, requestOptions?: RequestOptions) =>
    Request<types.Emoji>(METHODS.POST, Path(PATHS.guilds, guild_id, PATHS.emojis), requestOptions, params);

export const Modify = (guild_id: string, emoji_id: string, params: {
    name?: string;
    roles?: string[] | null;
}, requestOptions?: RequestOptions) =>
    Request<types.Emoji>(METHODS.PATCH, Path(PATHS.guilds, guild_id, PATHS.emojis, emoji_id), requestOptions, params);

export const Delete = (guild_id: string, emoji_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.guilds, guild_id, PATHS.emojis, emoji_id), requestOptions);
