import { GET } from './axios';

interface IAsset {
  id: string
  policyId: string
  type: number
  info: object
  metadata: any
}

export abstract class AssetAPI {
  static async get(assetId: string) : Promise<IAsset | null> {
    return await GET<IAsset>(`asset/${assetId}`);
  }
}
