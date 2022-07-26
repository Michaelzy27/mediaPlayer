import {GET, POST} from './axios';

export interface IAssetInfo {
  unit: string;
  quantity: string;
  metadataType: number;
  info: {
    name: string;
    image: string;
    file?: {
      mediaType: string;
      name: string;
      src: string;
      iv: string;
    };
    artist: string;
  };
}

interface GetResponse {
  assets: IAssetInfo[];
}

export abstract class WalletAssetAPI {
  static async get(wallet: string): Promise<GetResponse | null> {
    return await GET(`wallet-asset/${wallet}?showInfo=1`);
  }

  static async resync(wallet: string) {
    await POST(`wallet-asset/${wallet}`, null);
  }
}
