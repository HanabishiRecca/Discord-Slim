import { TokenTypes } from './helpers';

export class Authorization {
    private _type: TokenTypes;
    private _token: string;
    private _cache = '';

    constructor(
        token: string,
        type: TokenTypes = TokenTypes.BOT
    ) {
        this._token = token;
        this._type = type;
        this._update();
    }

    private _update = () =>
        this._cache = this._type ?
            `${this._type} ${this._token}` :
            this._token;

    get type() { return this._type; };

    set type(value: TokenTypes) {
        this._type = value;
        this._update();
    };

    get token() { return this._token; };

    set token(value: string) {
        this._token = value;
        this._update();
    };

    get value() { return this._cache; };

    toString = () => this._cache;
}
