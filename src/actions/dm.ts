import { METHODS, PATHS, Path } from './_common';
import { Request, RequestOptions } from '../request';
import type * as types from '../types';

export const Create = (params: {
    recipient_id: string;
}, requestOptions?: RequestOptions) =>
    Request<types.DMChannel>(METHODS.POST, Path(PATHS.users, PATHS.me, PATHS.channels), requestOptions, params);

export const Close = (channel_id: string, requestOptions?: RequestOptions) =>
    Request<types.DMChannel>(METHODS.DELETE, Path(PATHS.channels, channel_id), requestOptions);
