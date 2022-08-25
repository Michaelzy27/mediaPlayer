import { GET } from './axios';

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
}

export abstract class AssetAPI {
  static async get(assetId: string) : Promise<IAsset | null> {
    return await GET<IAsset>(`asset/${assetId}`);
  }

  static async getText(url: string) : Promise<string | null> {
    return await GET<string>(url);
  }
}
