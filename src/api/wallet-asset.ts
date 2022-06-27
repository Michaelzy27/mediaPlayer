import axios from 'axios';

const axiosInstance = axios.create( {
    baseURL: process.env.REACT_APP_API_URL
  });

export interface IAssetInfo {
  unit: string;
  quantity: string;
  metadataType: number;
  info: {
    name: string;
    image: string;
  }
}

interface GetResponse {
  assets: IAssetInfo[];
}

export abstract class WalletAssetAPI {
  static async get(wallet: string) : Promise<GetResponse | null> {
    const response = await axios.get(`wallet-asset/${wallet}?showInfo=1`, {
      validateStatus: (status) => status === 200 || status === 400
    });
    if (response.status === 400){
      return null
    }

    return response.data;
  }
}
