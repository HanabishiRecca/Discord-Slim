import { METHODS, PATHS, Path } from './_common';
import { Request, RequestOptions } from '../request';

export const Add = (channel_id: string, message_id: string, emoji: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.PUT, Path(PATHS.channels, channel_id, PATHS.messages, message_id, PATHS.reactions, encodeURIComponent(emoji), PATHS.me), requestOptions);

export const DeleteOwn = (channel_id: string, message_id: string, emoji: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.channels, channel_id, PATHS.messages, message_id, PATHS.reactions, encodeURIComponent(emoji), PATHS.me), requestOptions);

export const Delete = (channel_id: string, message_id: string, user_id: string, emoji: string, requestOptions?: RequestOptions) =>
    Request<null>(METHODS.DELETE, Path(PATHS.channels, channel_id, PATHS.messages, message_id, PATHS.reactions, encodeURIComponent(emoji), user_id), requestOptions);
