import { GET } from './axios';
import Auth, { AuthState } from '../auth/Auth';

interface IAsset {
  id: string
  policyId: string
  type: number
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

export abstract class AssetAPI {
  static async get(assetId: string) : Promise<IAsset | null> {
    const {authState} = Auth.getCurrentAuthData()
    if (authState === AuthState.SignedIn){
      return await GET<IAsset>(`asset/${assetId}`);
    }
    else {
      return await GET<IAsset>(`public/asset/${assetId}`);
    }
  }

  static async getText(url: string) : Promise<string | null> {
    return await GET<string>(url);
  }
}
