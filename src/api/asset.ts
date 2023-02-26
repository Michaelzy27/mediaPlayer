import { GET } from './axios';
import Auth, { AuthState } from '../auth/Auth';
import { DEMO_WALLET } from 'utils/constants';
import DataLoader from 'dataloader'

interface IAsset {
  id: string
  policyId: string
  info: {
    name: string;
    image: string;
    file?: {
      mediaType: string;
      name: string;
      src: string;
      url?: string;

    };
    audios?: IFileInfo[];
    videos?: IFileInfo[];
    texts?: IFileInfo[];
    images?: IFileInfo[];
    isMusic: boolean;
    isVideo: boolean;
    artist: string;
  };
  metadata: any
}

interface IFileInfo {
  mediaType: string;
  name?: string;
  src: string;
  artist?: string;
  url?: string;
  text?: string;
}

const assetLoader = new DataLoader((keys) => {
  return Promise.all(keys.map((k) => {
    return GET<IAsset>(`asset/${k}`);
  }))
})

export abstract class AssetAPI {
  static async get(assetId: string) : Promise<IAsset | null> {
    const {authState, address} = Auth.getCurrentAuthData()
    if (authState === AuthState.SignedIn && address !== DEMO_WALLET){
      return await assetLoader.load(assetId);
    }
    else {
      return await GET<IAsset>(`public/asset/${assetId}`);
    }
  }

  static async getText(url: string) : Promise<string | null> {
    return await GET<string>(url);
  }
}
