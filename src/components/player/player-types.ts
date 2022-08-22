import { IAssetInfo } from 'api/wallet-asset';

export interface SongInfo {
  thumbnail: string;
  title: string;
  artistsNames: string;
}

interface PlayerProps {
}

export enum Media {
  Audio = 'Audio',
  Video = 'Video',
  Text = 'Text',
  Tun3z = 'Tun3z',
}

export interface ITune {
  unit: string;
  name: string;
  artist: string;
  image: string;
  imageUrl?: string;
  items: ISong[];
}

export interface ISong {
  key: string;
  unit: string;
  image: string;
  imageUrl?: string;
  name: string;
  artist: string;
  media: Media;
  isTun3z: boolean;
  file?: {
    src: string;
    mediaType: string;
    encrypted?: boolean;
  },
}

const SUPPORT_MEDIA_TYPE = {
  'application/pdf': {},
  'audio/mp3': {},
  'audio/mpeg': {},
  'audio/wav': {},
  'image/gif': {},
  'image/jpeg': {},
  'image/jpg': {},
  'image/png': {},
  'model/gltf-binary': {},
  'null': {},
  'text/html': {},
  'video/mp4': {}
};

const AUDIO_MEDIA_TYPE = {
  'audio/mp3': {},
  'audio/mpeg': {},
  'audio/wav': {}
};

const VIDEO_MEDIA_TYPE = {
  'video/mp4': {}
};

