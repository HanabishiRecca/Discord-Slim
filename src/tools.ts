import * as helpers from './helpers';
import type * as types from './types';

type Permission = typeof helpers.Permissions[keyof typeof helpers.Permissions];
type PermissionSet = string | number | bigint;

export const Permissions = {

    equals: (a: PermissionSet, b: PermissionSet) =>
        BigInt(a) == BigInt(b),

    combine: (permissions: (PermissionSet | Permission)[]) => {
        let result = 0n;
        for(const p of permissions)
            result |= BigInt(p);
        return String(result);
    },

    check: (source: PermissionSet, permission: Permission) =>
        (BigInt(source) & BigInt(permission)) == BigInt(permission),

    has: (source: PermissionSet, permission: Permission) =>
        Permissions.check(source, helpers.Permissions.ADMINISTRATOR) || Permissions.check(source, permission),

    add: (source: PermissionSet, permission: Permission) =>
        String(BigInt(source) | BigInt(permission)),

    remove: (source: PermissionSet, permission: Permission) =>
        String(BigInt(source) & ~BigInt(permission)),

};

const EID = (value: { id: string; } | string) =>
    (typeof value == 'object') ? value.id : value;

export const Mention = {

    User: (
        user: types.User | { id: string; } | string,
    ) => `<@${EID(user)}>`,

    Channel: (
        channel: types.Channel | { id: string; } | string,
    ) => `<#${EID(channel)}>`,

    Role: (
        role: types.Role | { id: string; } | string,
    ) => `<@&${EID(role)}>`,

};

export const Format = {

    Emoji: (
        emoji: types.Emoji | { name: string; id: string; animated?: boolean; },
    ) => `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`,

    Reaction: (
        emoji: types.Emoji | { name: string; id: string; }
    ) => `${emoji.name}:${emoji.id}`,

    Timestamp: (
        timestamp: number | string | Date,
        style?: helpers.TimestampStyles,
    ) => {
        let value;

        if(timestamp instanceof Date)
            value = Math.trunc(timestamp.getTime() / 1000);
        else if(typeof timestamp == 'string')
            value = Math.trunc(new Date(timestamp).getTime() / 1000);
        else
            value = timestamp;

        return style ?
            `<t:${value}:${style}>` :
            `<t:${value}>`;
    },

};

export const Link = {

    Message: (
        message: types.Message | { id: string; channel_id: string; guild_id?: string; },
    ) => `${helpers.HOST}/channels/${message.guild_id ?? '@me'}/${message.channel_id}/${message.id}`,

};

const SizeExtOpt = (size?: number, ext?: string) =>
    (ext ? `.${ext}` : '') + (size ? `?size=${size}` : '');

export const Resource = {

    CustomEmoji: (
        emoji: types.Emoji | { id?: string; },
        size?: number,
        ext?: 'png' | 'jpg' | 'webp' | 'gif',
    ) => emoji.id ?
            `${helpers.CDN}/emojis/${emoji.id}${SizeExtOpt(size, ext)}` : null,

    GuildIcon: (
        guild: types.Guild | { id: string; icon?: string; },
        size?: number,
        ext?: 'png' | 'jpg' | 'webp' | 'gif',
    ) => guild.icon ?
            `${helpers.CDN}/icons/${guild.id}/${guild.icon}${SizeExtOpt(size, ext)}` : null,

    GuildSplash: (
        guild: types.Guild | { id: string; splash?: string; },
        size?: number,
        ext?: 'png' | 'jpg' | 'webp',
    ) => guild.splash ?
            `${helpers.CDN}/splashes/${guild.id}/${guild.splash}${SizeExtOpt(size, ext)}` : null,

    GuildDiscoverySplash: (
        guild: types.Guild | { id: string; discovery_splash?: string; },
        size?: number,
        ext?: 'png' | 'jpg' | 'webp',
    ) => guild.discovery_splash ?
            `${helpers.CDN}/discovery-splashes/${guild.id}/${guild.discovery_splash}${SizeExtOpt(size, ext)}` : null,

    GuildBanner: (
        guild: types.Guild | { id: string; banner?: string; },
        size?: number,
        ext?: 'png' | 'jpg' | 'webp',
    ) => guild.banner ?
            `${helpers.CDN}/banners/${guild.id}/${guild.banner}${SizeExtOpt(size, ext)}` : null,

    UserAvatar: (
        user: types.User | { id: string; discriminator: string | number; avatar?: string; },
        size?: number,
        ext?: 'png' | 'jpg' | 'webp' | 'gif',
    ) => user.avatar ?
            `${helpers.CDN}/avatars/${user.id}/${user.avatar}${SizeExtOpt(size, ext)}` :
            `${helpers.CDN}/embed/avatars/${Number(user.discriminator) % 5}.png`,

    UserBanner: (
        user: types.User | { id: string; banner?: string; },
        size?: number,
        ext?: 'png' | 'jpg' | 'webp' | 'gif',
    ) => user.banner ?
            `${helpers.CDN}/banners/${user.id}/${user.banner}${SizeExtOpt(size, ext)}` : null,

    ApplicationIcon: (
        application: types.Application | { id: string; icon?: string; },
        size?: number,
        ext?: 'png' | 'jpg' | 'webp',
    ) => application.icon ?
            `${helpers.CDN}/app-icons/${application.id}/${application.icon}${SizeExtOpt(size, ext)}` : null,

    ApplicationAsset: (
        application: types.Application | { id: string; } | string,
        asset_id: string,
        size?: number,
        ext?: 'png' | 'jpg' | 'webp',
    ) => `${helpers.CDN}/app-assets/${EID(application)}/${asset_id}${SizeExtOpt(size, ext)}`,

    AchievementIcon: (
        application: types.Application | { id: string; } | string,
        achievement_id: string | number | BigInt,
        icon_hash: string,
        size?: number, ext?: 'png' | 'jpg' | 'webp',
    ) => `${helpers.CDN}/app-assets/${EID(application)}/achievements/${achievement_id}/icons/${icon_hash}${SizeExtOpt(size, ext)}`,

    StickerPackBanner: (
        application: types.Application | { id: string; } | string,
        sticker_pack: types.StickerPack | { banner_asset_id: string; },
        size?: number,
        ext?: 'png' | 'jpg' | 'webp',
    ) => `${helpers.CDN}/app-assets/${EID(application)}/store/${sticker_pack.banner_asset_id}${SizeExtOpt(size, ext)}`,

    TeamIcon: (
        team: types.Team | { id: string; icon?: string; },
        size?: number,
        ext?: 'png' | 'jpg' | 'webp',
    ) => team.icon ?
            `${helpers.CDN}/team-icons/${team.id}/${team.icon}${SizeExtOpt(size, ext)}` : null,

    Sticker: (
        sticker: types.Sticker | { id: string; format_type: helpers.MessageStickerFormatTypes; },
    ) => `${helpers.CDN}/stickers/${EID(sticker)}.${(sticker.format_type == helpers.MessageStickerFormatTypes.LOTTIE) ? 'json' : 'png'}`,

    RoleIcon: (
        role: types.Role | { id: string; icon: string; },
        size?: number,
        ext?: 'png' | 'jpg' | 'webp',
    ) => role.icon ?
            `${helpers.CDN}/role-icons/${role.id}/${role.icon}${SizeExtOpt(size, ext)}` : null,

};
