import { Link } from 'react-router-dom';
import * as React from 'react';

// Dapps, Products & Integrations
// https://cardano.ideascale.com/c/idea/416274
// Cross-Chain Collaboration
// https://cardano.ideascale.com/c/idea/421375
// Grow Africa, Grow Cardano
// https://cardano.ideascale.com/c/idea/418954
// Grow East Asia, Grow Cardano
// https://cardano.ideascale.com/c/idea/420563

const items = [
  {
    name: 'Dapps, Products & Integrations',
    link: 'https://cardano.ideascale.com/c/idea/416274'
  },
  {
    name: 'Cross-Chain Collaboration',
    link: 'https://cardano.ideascale.com/c/idea/421375'
  },
  {
    name: 'Grow Africa, Grow Cardano',
    link: 'https://cardano.ideascale.com/c/idea/418954'
  },
  {
    name: 'Grow East Asia, Grow Cardano',
    link: 'https://cardano.ideascale.com/c/idea/420563'
  }
];
export const VotePage = () => {
  return <div className={'flex-1 grid items-center justify-center'}>

    <div className={'text-center grid gap-2 md:gap-6'}>
      <div className={'text-2xl md:hidden font-bold'}>Welcome to SoundRig</div>
      <div className={'text-lg md:hidden font-bold'}> Connect wallet on desktop to start </div>
      <div className={'h-3'}/>
      <div className={'text-2xl lg:text-6xl font-bold'}>Vote for us!</div>
      {items.map((i) => {
        return <div key={i.link}>
          <div className={'text-lg md:text-xl font-bold'}>{i.name}</div>
          <a href={i.link} target={'__blank'}
             className={'text-base md:text-lg'}
          >{i.link}</a>
        </div>
      })}
    </div>
  </div>;
};