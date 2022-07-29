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
    audios?: {
      mediaType: string;
      name?: string;
      src: string;
      artist?: string;
    }[];
    videos?: {
      mediaType: string;
      name?: string;
      src: string;
      artist?: string;
    }[];
    isMusic: boolean;
    isVideo: boolean;
    artist: string;
  };
}

interface GetResponse {
  assets: IAssetInfo[];
}

export abstract class WalletAssetAPI {
  static async get(wallet: string, type?: 1 | 2): Promise<GetResponse | null> {
    let query = 'showInfo=1';
    if (type != null) query += `&metadataType=${type}`
    return await GET(`wallet-asset/${wallet}?${query}`);
  }

  static async resync(wallet: string) {
    await POST(`wallet-asset/${wallet}`, null);
  }
}
