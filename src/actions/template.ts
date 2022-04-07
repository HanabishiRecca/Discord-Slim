import { METHODS, PATHS, Path } from './_common';
import { Request, RequestOptions } from '../request';
import type * as types from '../types';

export const Get = (template_code: string, requestOptions?: RequestOptions) =>
    Request<types.Template>(METHODS.GET, Path(PATHS.guilds, PATHS.templates, template_code), requestOptions);

export const Create = (guild_id: string, params: {
    name: string;
    description?: string;
}, requestOptions?: RequestOptions) =>
    Request<types.Template>(METHODS.POST, Path(PATHS.guilds, guild_id, PATHS.templates), requestOptions, params);

export const Sync = (guild_id: string, template_code: string, requestOptions?: RequestOptions) =>
    Request<types.Template>(METHODS.PUT, Path(PATHS.guilds, guild_id, PATHS.templates, template_code), requestOptions);

export const Modify = (guild_id: string, template_code: string, params: {
    name?: string;
    description?: string;
}, requestOptions?: RequestOptions) =>
    Request<types.Template>(METHODS.PATCH, Path(PATHS.guilds, guild_id, PATHS.templates, template_code), requestOptions, params);

export const Delete = (guild_id: string, template_code: string, requestOptions?: RequestOptions) =>
    Request<types.Template>(METHODS.DELETE, Path(PATHS.guilds, guild_id, PATHS.templates, template_code), requestOptions);
