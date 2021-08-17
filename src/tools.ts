import { Permissions as Flags, TimestampStyles, CDN, HOST } from './helpers.js';
import type { Guild, User, Application, Team, Emoji, Message, Channel, Role } from './types';

type Permission = typeof Flags[keyof typeof Flags];
type PermissionSet = string | number | bigint;

export const Permissions = {
    equals: (a: PermissionSet, b: PermissionSet) =>
        BigInt(a) == BigInt(b),

    combine: (permissions: PermissionSet[]) => {
        let result = 0n;
        for(const p of permissions)
            result |= BigInt(p);
        return String(result);
    },

    check: (source: PermissionSet, permission: Permission) =>
        (BigInt(source) & BigInt(permission)) == BigInt(permission),

    has: (source: PermissionSet, permission: Permission) =>
        Permissions.check(source, Flags.ADMINISTRATOR) || Permissions.check(source, permission),

    add: (source: PermissionSet, permission: Permission) =>
        String(BigInt(source) | BigInt(permission)),

    remove: (source: PermissionSet, permission: Permission) =>
        String(BigInt(source) & ~BigInt(permission)),
};

const EID = (value: any) => (typeof value == 'object') ? value.id : value;

export const Mentions = {
    User: (user: User | { id: string; } | string) => `<@${EID(user)}>`,
    Channel: (channel: Channel | { id: string; } | string) => `<#${EID(channel)}>`,
    Role: (role: Role | { id: string; } | string) => `<@&${EID(role)}>`,
};

export const Format = {
    Emoji: (emoji: Emoji) => `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`,
    Reaction: (emoji: Emoji) => `${emoji.name}:${emoji.id}`,
    Timestamp: (timestamp: number | string | Date, style?: TimestampStyles) => {
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
    Message: (message: Message | {
        id: string;
        channel_id: string;
        guild_id?: string;
    }) =>
        `${HOST}/channels/${message.guild_id ?? '@me'}/${message.channel_id}/${message.id}`,
};

const SizeExtOpt = (size?: number, ext?: string) => (ext ? `.${ext}` : '') + (size ? `?size=${size}` : '');

export const CdnImages = {
    CustomEmoji: (emoji: Emoji | {
        id: string;
    } | string, size?: number, ext?: 'png' | 'jpg' | 'webp' | 'gif') =>
        `${CDN}/emojis/${EID(emoji)}${SizeExtOpt(size, ext)}`,

    GuildIcon: (guild: Guild | {
        id: string;
        icon: string;
    }, size?: number, ext?: 'png' | 'jpg' | 'webp' | 'gif') =>
        guild.icon ? `${CDN}/icons/${guild.id}/${guild.icon}${SizeExtOpt(size, ext)}` : null,

    GuildSplash: (guild: Guild | {
        id: string;
        splash: string;
    }, size?: number, ext?: 'png' | 'jpg' | 'webp') =>
        guild.splash ? `${CDN}/splashes/${guild.id}/${guild.splash}${SizeExtOpt(size, ext)}` : null,

    GuildDiscoverySplash: (guild: Guild | {
        id: string;
        discovery_splash: string;
    }, size?: number, ext?: 'png' | 'jpg' | 'webp') =>
        guild.discovery_splash ? `${CDN}/discovery-splashes/${guild.id}/${guild.discovery_splash}${SizeExtOpt(size, ext)}` : null,

    GuildBanner: (guild: Guild | {
        id: string;
        banner: string;
    }, size?: number, ext?: 'png' | 'jpg' | 'webp') =>
        guild.banner ? `${CDN}/banners/${guild.id}/${guild.banner}${SizeExtOpt(size, ext)}` : null,

    UserAvatar: (user: User | {
        id: string;
        discriminator: string | number;
        avatar?: string;
    }, size?: number, ext?: 'png' | 'jpg' | 'webp' | 'gif') =>
        user.avatar ?
            `${CDN}/avatars/${user.id}/${user.avatar}${SizeExtOpt(size, ext)}` :
            `${CDN}/embed/avatars/${Number(user.discriminator) % 5}.png`,

    UserBanner: (user: User | {
        id: string;
        banner: string;
    }, size?: number, ext?: 'png' | 'jpg' | 'webp' | 'gif') =>
        user.banner ? `${CDN}/banners/${user.id}/${user.banner}${SizeExtOpt(size, ext)}` : null,

    ApplicationIcon: (application: Application | {
        id: string;
        icon: string;
    }, size?: number, ext?: 'png' | 'jpg' | 'webp') =>
        application.icon ? `${CDN}/app-icons/${application.id}/${application.icon}${SizeExtOpt(size, ext)}` : null,

    ApplicationAsset: (application: Application | {
        id: string;
    } | string, asset_id: string, size?: number, ext?: 'png' | 'jpg' | 'webp') =>
        `${CDN}/app-assets/${EID(application)}/${asset_id}${SizeExtOpt(size, ext)}`,

    AchievementIcon: (application: Application | {
        id: string;
    } | string, achievement_id: string, icon_hash: string, size?: number, ext?: 'png' | 'jpg' | 'webp') =>
        `${CDN}/app-assets/${EID(application)}/achievements/${achievement_id}/icons/${icon_hash}${SizeExtOpt(size, ext)}`,

    TeamIcon: (team: Team | {
        id: string;
        icon: string;
    }, size?: number, ext?: 'png' | 'jpg' | 'webp') =>
        team.icon ? `${CDN}/team-icons/${team.id}/${team.icon}${SizeExtOpt(size, ext)}` : null,
};
