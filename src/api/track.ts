import { POST } from 'api/axios';
import Auth, { AuthState } from 'auth/Auth';
import { getCaptcha } from 'api/captcha';

type TrackRequest = {
  playIpfs?: string,
}

export abstract class TrackAPI {
  static async track(ipfsFile: string): Promise<void> {
    console.log('TRACK', ipfsFile);
    try {
      const { authState, address } = Auth.getCurrentAuthData();
      const captcha = await getCaptcha('track_play');
      await POST<TrackRequest, void>(`/track`, {
        playIpfs: ipfsFile
      }, { captcha });
    } catch (e) {
      console.error(e);
    }
  }
}
