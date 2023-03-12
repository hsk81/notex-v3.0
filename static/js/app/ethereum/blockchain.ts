/* eslint @typescript-eslint/no-explicit-any: [off] */
import detectProvider from '@metamask/detect-provider';
import { EventEmitter } from 'events';
export type Address = bigint;

export type Provider = Awaited<ReturnType<typeof detectProvider>> & {
    request: (...args: any[]) => any;
    isConnected: () => boolean;
} & EventEmitter;
export type Connect = {
    address: Address
};
export class Blockchain extends EventEmitter {
    private static get me(): Blockchain {
        if (this._me === undefined) {
            this._me = new Blockchain();
        }
        return this._me;
    }
    private constructor() {
        super(); this.setMaxListeners(200);
    }
    public static get provider(): Promise<Provider> {
        return this.me.provider();
    }
    private async provider(): Promise<Provider> {
        if (this._provider === undefined || this._provider === null) {
            const provider = await detectProvider();
            this._provider = provider as any;
        }
        return this._provider as Provider;
    }
    public static isInstalled(): Promise<boolean> {
        return this.me.isInstalled();
    }
    private async isInstalled(): Promise<boolean> {
        if (this._isInstalled === undefined) {
            this._isInstalled = await this.provider().then(
                (p) => Boolean(p)
            );
        }
        return Boolean(this._isInstalled);
    }
    public static isConnected(): Promise<boolean> {
        return this.me.isConnected();
    }
    private async isConnected(): Promise<boolean> {
        if (this._isConnected === undefined) {
            this._isConnected = await this.provider().then(
                (p) => Boolean(p?.isConnected())
            );
        }
        return Boolean(this._isConnected);
    }
    public static async connect(): Promise<Address> {
        return this.me.connect();
    }
    private async connect(): Promise<Address> {
        const accounts = await this.provider().then((p) => p?.request({
            method: 'eth_requestAccounts'
        }));
        if (!accounts?.length) {
            throw new Error('missing accounts');
        }
        const address = await this.selectedAddress();
        if (!address) {
            throw new Error('missing selected-address');
        }
        setTimeout(() => {
            this.emit('connect', { address });
        });
        return address;
    }
    public static get selectedAddress(): Promise<Address | null> {
        return this.me.selectedAddress();
    }
    private async selectedAddress(): Promise<Address | null> {
        if (this._selectedAddress === null && this._provider) {
            const req = this.provider().then((p) => p?.request({
                method: 'eth_accounts'
            }));
            this._selectedAddress = await req.then((a: string[]) =>
                a?.length > 0 ? BigInt(a[0]) : null
            );
        }
        return this._selectedAddress;
    }
    public static onConnect(
        listener: (options: Connect) => void
    ) {
        return this.me.onConnect(listener);
    }
    private onConnect(
        listener: (options: Connect) => void
    ) {
        this.on('connect', listener);
        return () => {
            this.off('connect', listener);
        };
    }
    public static onceConnect(
        listener: (options: Connect) => void
    ) {
        return this.me.onceConnect(listener);
    }
    private onceConnect(
        listener: (options: Connect) => void
    ) {
        return () => {
            this.off('connect', listener);
        };
    }
    private get _provider(): Provider | undefined {
        return this.__provider;
    }
    private set _provider(provider: Provider | undefined) {
        this.__provider = provider;
    }
    private get _selectedAddress(): Address | null {
        return this.__selectedAddress;
    }
    private set _selectedAddress(value: Address | null) {
        this.__selectedAddress = value;
    }
    private get _isInstalled(): boolean | undefined {
        return this.__isInstalled;
    }
    private set _isInstalled(value: boolean | undefined) {
        this.__isInstalled = value;
    }
    private get _isConnected(): boolean | undefined {
        return this.__isConnected;
    }
    private set _isConnected(value: boolean | undefined) {
        this.__isConnected = value;
    }
    private __selectedAddress: Address | null = null;
    private __isInstalled: boolean | undefined;
    private __isConnected: boolean | undefined;
    private __provider: Provider | undefined;
    private static _me: any;
}
export default Blockchain;
