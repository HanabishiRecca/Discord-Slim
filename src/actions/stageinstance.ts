import { METHODS, PATHS, Path } from './_common';
import { Request, RequestOptions } from '../request';
import type * as helpers from '../helpers';
import type * as types from '../types';

export const Create = (params: {
    channel_id: string;
    topic: string;
    privacy_level?: helpers.PrivacyLevels;
    send_start_notification?: boolean;
}, requestOptions?: RequestOptions) =>
    Request<types.StageInstance>(METHODS.POST, PATHS.stage_instances, requestOptions, params);

export const Get = (channel_id: string, requestOptions?: RequestOptions) =>
    Request<types.StageInstance>(METHODS.GET, Path(PATHS.stage_instances, channel_id), requestOptions);

export const Modify = (channel_id: string, params: {
    topic?: string;
    privacy_level?: helpers.PrivacyLevels;
}, requestOptions?: RequestOptions) =>
    Request<types.StageInstance>(METHODS.PATCH, Path(PATHS.stage_instances, channel_id), requestOptions, params);

export const Delete = (channel_id: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.stage_instances, channel_id), requestOptions);
