import { METHODS, PATHS, Path } from './_common';
import { Request, RequestOptions } from '../request';
import type * as types from '../types';

export const ListRegions = (requestOptions?: RequestOptions) =>
    Request<types.VoiceRegion[]>(METHODS.GET, Path(PATHS.voice, PATHS.regions), requestOptions);

export const UpdateCurrentState = (guild_id: string, params: {
    channel_id: string;
    suppress?: boolean;
    request_to_speak_timestamp?: string | null;
}, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.PATCH, Path(PATHS.guilds, guild_id, PATHS.voice_states, PATHS.me), requestOptions, params);

export const UpdateUserState = (guild_id: string, user_id: string, params: {
    channel_id: string;
    suppress?: boolean;
}, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.PATCH, Path(PATHS.guilds, guild_id, PATHS.voice_states, user_id), requestOptions, params);
