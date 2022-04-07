import { METHODS, PATHS, Path, Query } from './_common';
import { Request, RequestOptions } from '../request';
import type * as helpers from '../helpers';
import type * as types from '../types';

export const GetSettings = (guild_id: string, requestOptions?: RequestOptions) =>
    Request<types.GuildWidgetSettings>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.widget), requestOptions);

export const Modify = (guild_id: string, params: types.GuildWidgetSettings, requestOptions?: RequestOptions) =>
    Request<types.GuildWidgetSettings>(METHODS.PATCH, Path(PATHS.guilds, guild_id, PATHS.widget), requestOptions, params);

export const Get = (guild_id: string, requestOptions?: RequestOptions) =>
    Request<types.GuildWidget>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.widget_json), requestOptions);

export const GetImage = (guild_id: string, params?: {
    style?: helpers.WidgetStyleOptions;
}, requestOptions?: RequestOptions) =>
    Request<Buffer>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.widget_png) + Query(params), requestOptions);
