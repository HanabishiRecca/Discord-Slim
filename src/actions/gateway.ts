import { METHODS, PATHS, Path } from './_common';
import { Request, RequestOptions } from '../request';
import type * as types from '../types';

export const Get = (requestOptions?: RequestOptions) =>
    Request<{
        url: string;
    }>(METHODS.GET, PATHS.gateway, requestOptions);

export const GetBot = (requestOptions?: RequestOptions) =>
    Request<{
        url: string;
        shards: number;
        session_start_limit: types.SessionStartLimit;
    }>(METHODS.GET, Path(PATHS.gateway, PATHS.bot), requestOptions);
