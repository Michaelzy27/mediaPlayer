import { post } from './axiosWithAuthHeader';


export abstract class UserAPI {
  static async getAuth(walletAddress: string) : Promise<{
    message: string
  }> {
    return post('/get-auth', {
      address: walletAddress
    });
  }

  static async sendAuth(walletAddress: string, signature: string, key?: string) : Promise<{
    token: string
  }> {
    return post('/send-auth', {
      signature,
      address: walletAddress,
      key
    });
  }

  static async getStakeAddress(walletAddressHex: string) {
    return post('/get-stakeAddress', {
      address: walletAddressHex
    });
  }
}

