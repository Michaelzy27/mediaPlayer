import { Image, Table } from 'antd';
import { IAsset } from '../../hooks/useUser';
import { IAssetInfo } from '../../api/wallet-asset';

const createIpfsURL = (srcStr: string) => {
  const ipfsURL = "https://ipfs.blockfrost.dev/ipfs/";
  const ipfsPrefix = "ipfs://";
  return ipfsURL + srcStr.replace(ipfsPrefix, "");
}

export const AssetsList = (props: {
  assets: IAssetInfo[],
}) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'info',
      key: 'name',
      render: (i: any) => i?.name,
    },
    {
      title: 'Image',
      dataIndex: 'info',
      key: 'image',
      render:  (i: any) => {
        const {image} = i??{};
        return image?  <Image height={80} src={createIpfsURL(image)} /> : null;
      }
    },
    {
      title: 'File',
      dataIndex: 'info',
      key: 'file',
      render:  (info: any) => {
        const src = info?.['file']?.['src'];
        const mediaType = info?.['file']?.['mediaType'];

        if (typeof src !== 'string' || !mediaType.startsWith('audio')){
          return null;
        }
        return <video controls>
          <source src={createIpfsURL(src)} type={mediaType}>
          </source>
        </video>
      }
    }
  ];

  console.log(props.assets[0])

  return <Table dataSource={props.assets} columns={columns} rowKey={(i) => i.unit} >
  </Table>
}
