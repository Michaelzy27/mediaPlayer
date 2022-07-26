import { POST } from './axios';


export abstract class UserAPI {
  static async getAuth(walletAddress: string) : Promise<{
    message: string
  }> {
    return POST('/get-auth', {
      address: walletAddress
    });
  }

  static async sendAuth(walletAddress: string, signature: string, key?: string) : Promise<{
    token: string
  }> {
    return POST('/send-auth', {
      signature,
      address: walletAddress,
      key
    });
  }

  static async getStakeAddress(walletAddressHex: string) {
    return POST('/get-stakeAddress', {
      address: walletAddressHex
    });
  }
}

