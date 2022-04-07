import { METHODS, PATHS, Path } from './_common';
import { Request, RequestOptions } from '../request';
import type * as types from '../types';

export const Get = (sticker_id: string, requestOptions?: RequestOptions) =>
    Request<types.Sticker>(METHODS.GET, Path(PATHS.stickers, sticker_id), requestOptions);

export const GetFromGuild = (guild_id: string, sticker_id: string, requestOptions?: RequestOptions) =>
    Request<types.Sticker>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.stickers, sticker_id), requestOptions);

// Create: TODO

export const Modify = (guild_id: string, sticker_id: string, params: {
    name?: string;
    description?: string | null;
    tags?: string;
}, requestOptions?: RequestOptions) =>
    Request<types.Sticker>(METHODS.PATCH, Path(PATHS.guilds, guild_id, PATHS.stickers, sticker_id), requestOptions, params);

export const Delete = (guild_id: string, sticker_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.guilds, guild_id, PATHS.stickers, sticker_id), requestOptions);
