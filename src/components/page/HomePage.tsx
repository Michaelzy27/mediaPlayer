import { Player } from '../player/Player';
import useUser from '../../hooks/useUser';

export const HomePage = () => {
  const { user } = useUser('user-main');

  if (user == null || user.walletFunds == null){
    return <div className={'flex-1 grid items-center justify-center'}>
      <div className={'text-center grid gap-2'}>
        <div className={'text-6xl font-bold'}> Welcome to SoundRig </div>
        <div className={'text-xl font-bold'}> Connect wallet to start </div>
      </div>
    </div>
  }

  return <Player assets={user.walletFunds.assets}/>
}