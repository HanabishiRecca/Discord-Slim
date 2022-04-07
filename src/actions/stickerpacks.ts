import { METHODS, PATHS } from './_common';
import { Request, RequestOptions } from '../request';
import type * as types from '../types';

export const ListNitro = (requestOptions?: RequestOptions) =>
    Request<{ sticker_packs: types.StickerPack[]; }>(METHODS.GET, PATHS.sticker_packs, requestOptions);
