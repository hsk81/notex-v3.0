export enum ChainId {
    ETHEREUM_MAINNET = '0x1',       // 1
    ETHEREUM_GOERLI = '0x5',        // 5
    AVALANCHE_MAINNET = '0xa86a',   // 43114
    AVALANCHE_FUJI = '0xa869',      // 43113
    HARDHAT = '0x7a69',             // 31337
}
export class Chain {
    public constructor(id: string) {
        const chain_id = `0x${parseInt(id).toString(16)}` as ChainId;
        const chain_ids = new Set(Object.values(ChainId));
        if (!chain_ids.has(chain_id)) {
            throw new Error(`unsupported chain(id=${id})`);
        }
        this._id = chain_id;
    }
    public get name(): string {
        switch (this._id) {
            case ChainId.AVALANCHE_MAINNET:
                return 'Avalanche C-Chain';
            case ChainId.AVALANCHE_FUJI:
                return 'Avalanche Fuji Testnet';
            case ChainId.ETHEREUM_MAINNET:
                return 'Ethereum Mainnet';
            case ChainId.ETHEREUM_GOERLI:
                return 'Ethereum Goerli Testnet';
            case ChainId.HARDHAT:
                return 'Hardhat Localhost';
        }
    }
    public get id(): ChainId {
        return this._id;
    }
    public get currency(): {
        name: string, symbol: string, decimals: number
    } {
        switch (this._id) {
            case ChainId.AVALANCHE_MAINNET:
            case ChainId.AVALANCHE_FUJI:
                return {
                    name: 'AVAX',
                    symbol: 'AVAX',
                    decimals: 18
                };
            case ChainId.ETHEREUM_MAINNET:
            case ChainId.ETHEREUM_GOERLI:
            case ChainId.HARDHAT:
                return {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                };
        }
    }
    public get rpcUrls(): string[] {
        switch (this._id) {
            case ChainId.AVALANCHE_MAINNET:
                return ['https://api.avax.network/ext/bc/C/rpc'];
            case ChainId.AVALANCHE_FUJI:
                return ['https://api.avax-test.network/ext/bc/C/rpc'];
            case ChainId.ETHEREUM_MAINNET:
                return ['https://mainnet.infura.io/v3/'];
            case ChainId.ETHEREUM_GOERLI:
                return ['https://goerli.infura.io/v3/'];
            case ChainId.HARDHAT:
                return ['http://localhost:8545'];
        }
    }
    public get explorerUrls(): string[] {
        switch (this._id) {
            case ChainId.AVALANCHE_MAINNET:
                return ['https://snowtrace.io'];
            case ChainId.AVALANCHE_FUJI:
                return ['https://testnet.snowtrace.io'];
            case ChainId.ETHEREUM_MAINNET:
                return ['https://etherscan.io'];
            case ChainId.ETHEREUM_GOERLI:
                return ['https://goerli.etherscan.io'];
            case ChainId.HARDHAT:
                return [];
        }
    }
    private _id: ChainId;
}
export default Chain;
