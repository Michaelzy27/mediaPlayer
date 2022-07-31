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
    audios?: {
      mediaType: string;
      name?: string;
      src: string;
      artist?: string;
      url?: string;
    }[];
    videos?: {
      mediaType: string;
      name?: string;
      src: string;
      artist?: string;
      url?: string;
    }[];
    isMusic: boolean;
    isVideo: boolean;
    artist: string;
  };
  metadata: any
}

export abstract class AssetAPI {
  static async get(assetId: string) : Promise<IAsset | null> {
    return await GET<IAsset>(`asset/${assetId}`);
  }
}
