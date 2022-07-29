import 'axios'
import axios from 'axios';
const API = 'mainnetRkSpzOUH7RXTppopVFlchlfUkMaEVEYg';

const host = 'https://cardano-mainnet.blockfrost.io/api/v0'

export const getFingerPrint = async (fullAssetId: string) => {
 const response = await axios.get(`${host}/assets/${fullAssetId}`, {
   headers: {
     'project_id': API,
   }
 });
 return response.data['fingerprint'];
}