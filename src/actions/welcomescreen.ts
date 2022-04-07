import { METHODS, PATHS, Path } from './_common';
import { Request, RequestOptions } from '../request';
import type * as types from '../types';

export const Get = (guild_id: string, requestOptions?: RequestOptions) =>
    Request<types.WelcomeScreen>(METHODS.GET, Path(PATHS.guilds, guild_id, PATHS.welcome_screen), requestOptions);

export const Modify = (guild_id: string, params: {
    enabled?: boolean | null;
    welcome_channels?: types.WelcomeScreenChannel[] | null;
    description?: string | null;
}, requestOptions?: RequestOptions) =>
    Request<types.WelcomeScreen>(METHODS.PATCH, Path(PATHS.guilds, guild_id, PATHS.welcome_screen), requestOptions, params);
