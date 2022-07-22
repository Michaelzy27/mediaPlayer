import axiosInstance from './axiosWithAuthHeader';

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
    };
    artist: string;
  };
}

interface GetResponse {
  assets: IAssetInfo[];
}

export abstract class WalletAssetAPI {
  static async get(wallet: string): Promise<GetResponse | null> {
    const response = await axiosInstance.get(`wallet-asset?showInfo=1`, {
      validateStatus: (status) => status === 200 || status === 404,
    });
    if (response.status === 404) {
      return null;
    }

    return response.data;
  }

  static async resync(wallet: string) {
    await axiosInstance.post(`wallet-asset`, null, {});
  }
}

export abstract class WalletAssetDemoAPI {
  static async get(wallet: string): Promise<GetResponse | null> {
    const response = await axiosInstance.get(
      `wallet-asset/${wallet}?showInfo=1`,
      {
        validateStatus: (status) => status === 200 || status === 404,
      }
    );
    if (response.status === 404) {
      return null;
    }

    return response.data;
  }

  static async resync(wallet: string) {
    await axiosInstance.post(`wallet-asset/${wallet}`, null, {});
  }
}
