import { METHODS, PATHS, Path, Query } from './_common';
import { Request, RequestOptions } from '../request';
import type * as helpers from '../helpers';
import type * as types from '../types';

export const Create = (channel_id: string, params: {
    max_age?: number;
    max_uses?: number;
    temporary?: boolean;
    unique?: boolean;
    target_type?: helpers.InviteTargetTypes;
    target_user_id?: string;
    target_application_id?: string;
}, requestOptions?: RequestOptions) =>
    Request<types.Invite>(METHODS.POST, Path(PATHS.channels, channel_id, PATHS.invites), requestOptions, params);

export const Get = (invite_code: string, params?: {
    with_counts?: boolean;
    with_expiration?: boolean;
    guild_scheduled_event_id?: string;
}, requestOptions?: RequestOptions) =>
    Request<types.Invite>(METHODS.GET, Path(PATHS.invites, invite_code) + Query(params), requestOptions);

export const Delete = (invite_code: string, requestOptions?: RequestOptions) =>
    Request<types.Invite>(METHODS.DELETE, Path(PATHS.invites, invite_code), requestOptions);
