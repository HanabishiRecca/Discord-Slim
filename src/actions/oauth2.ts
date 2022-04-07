import { METHODS, PATHS, Path, Param } from './_common';
import { Request, RequestOptions } from '../request';
import type * as helpers from '../helpers';
import type * as types from '../types';

export const TokenExchange = (params: ({
    client_id: string;
    client_secret: string;
    redirect_uri: string;
    scope: helpers.OAuth2Scopes | string;
} & ({
    grant_type: helpers.OAuth2GrantTypes.AUTHORIZATION_CODE;
    code: string;
} | {
    grant_type: helpers.OAuth2GrantTypes.REFRESH_TOKEN;
    refresh_token: string;
})), requestOptions?: RequestOptions) =>
    Request<{
        access_token: string;
        token_type: helpers.TokenTypes.BEARER;
        expires_in: number;
        refresh_token: string;
        scope: helpers.OAuth2Scopes | string;
    }>(METHODS.POST, Path(PATHS.oauth2, PATHS.token), requestOptions, Param(params));

export const GetCurrentApplicationInformation = (requestOptions?: RequestOptions) =>
    Request<types.Application>(METHODS.GET, Path(PATHS.oauth2, PATHS.applications, PATHS.me), requestOptions);

export const GetCurrentAuthorizationInformation = (requestOptions?: RequestOptions) =>
    Request<{
        application: types.Application,
        scopes: string[];
        expires: string;
        user?: types.User;
    }>(METHODS.GET, Path(PATHS.oauth2, PATHS.me), requestOptions);
