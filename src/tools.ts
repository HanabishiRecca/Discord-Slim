import { Permissions as Flags, CDN } from './helpers';
import { Guild, User, Application, Team } from './types';

type Permission = typeof Flags[keyof typeof Flags];
type PermissionSet = string | number | bigint;

export const Permissions = {
    equals: (a: PermissionSet, b: PermissionSet) =>
        BigInt(a) == BigInt(b),

    combine: (permissions: PermissionSet[]) => {
        let result = 0n;
        for(const p of permissions)
            result |= BigInt(p);
        return result.toString();
    },

    check: (source: PermissionSet, permission: Permission) =>
        (BigInt(source) & BigInt(permission)) == BigInt(permission),

    has: (source: PermissionSet, permission: Permission) =>
        Permissions.check(source, Flags.ADMINISTRATOR) || Permissions.check(source, permission),

    add: (source: PermissionSet, permission: Permission) =>
        (BigInt(source) | BigInt(permission)).toString(),

    remove: (source: PermissionSet, permission: Permission) =>
        (BigInt(source) & ~BigInt(permission)).toString(),
};

export const Mentions = {
    User: (user_id: string) => `<@${user_id}>`,
    Channel: (channel_id: string) => `<#${channel_id}>`,
    Role: (role_id: string) => `<@&${role_id}>`,
};

const SizeExtOpt = (size?: number, ext?: string) => (ext ? `.${ext}` : '') + (size ? `?size=${size}` : '');

export const CdnImages = {
    CustomEmoji: (emoji_id: string, size?: number, ext?: 'png' | 'gif') =>
        `${CDN}/emojis/${emoji_id}${SizeExtOpt(size, ext)}`,

    GuildIcon: (guild: Guild, size?: number, ext?: 'png' | 'jpg' | 'webp' | 'gif') => guild.icon ?
        `${CDN}/icons/${guild.id}/${guild.icon}${SizeExtOpt(size, ext)}` :
        null,

    GuildSplash: (guild: Guild, size?: number, ext?: 'png' | 'jpg' | 'webp') => guild.splash ?
        `${CDN}/splashes/${guild.id}/${guild.splash}${SizeExtOpt(size, ext)}` :
        null,

    GuildDiscoverySplash: (guild: Guild, size?: number, ext?: 'png' | 'jpg' | 'webp') => guild.discovery_splash ?
        `${CDN}/discovery-splashes/${guild.id}/${guild.discovery_splash}${SizeExtOpt(size, ext)}` :
        null,

    GuildBanner: (guild: Guild, size?: number, ext?: 'png' | 'jpg' | 'webp') => guild.banner ?
        `${CDN}/banners/${guild.id}/${guild.banner}${SizeExtOpt(size, ext)}` :
        null,

    UserAvatar: (user: User, size?: number, ext?: 'png' | 'jpg' | 'webp' | 'gif') => user.avatar ?
        `${CDN}/avatars/${user.id}/${user.avatar}${SizeExtOpt(size, ext)}` :
        `${CDN}/embed/avatars/${Number(user.discriminator) % 5}.png`,

    ApplicationIcon: (application: Application, size?: number, ext?: 'png' | 'jpg' | 'webp') => application.icon ?
        `${CDN}/app-icons/${application.id}/${application.icon}${SizeExtOpt(size, ext)}` :
        null,

    ApplicationAsset: (application: Application, asset_id: string, size?: number, ext?: 'png' | 'jpg' | 'webp') =>
        `${CDN}/app-assets/${application.id}/${asset_id}${SizeExtOpt(size, ext)}`,

    AchievementIcon: (application: Application, achievement_id: string, icon_hash: string, size?: number, ext?: 'png' | 'jpg' | 'webp') =>
        `${CDN}/app-assets/${application.id}/achievements/${achievement_id}/icons/${icon_hash}${SizeExtOpt(size, ext)}`,

    TeamIcon: (team: Team, size?: number, ext?: 'png' | 'jpg' | 'webp') => team.icon ?
        `${CDN}/team-icons/${team.id}/${team.icon}${SizeExtOpt(size, ext)}` :
        null,
};
