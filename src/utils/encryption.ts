import { GET } from '../api/axios';


export async function loadAndDecrypt(props: {src: string, iv: string}) : Promise<Buffer> {
  const data = await GET(props.src);
  console.log(data);
  return Buffer.from([]);
}