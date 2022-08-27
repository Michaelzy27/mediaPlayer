import 'remixicon/fonts/remixicon.css';
import './App.less';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import { AppHeader } from './components/layout/AppHeader';
import { IRoute, ROUTES, ROUTES_MOBILE } from './routes/routes';

const DISCORD = 'https://discord.gg/C2tjMcY7'
const TWITTER = 'https://twitter.com/SoundRigNFT'


const RouteComponentWithTitle = (props: {
  title: string;
  element: () => JSX.Element;
}) => {
  useEffect(() => {
    document.title = (props.title ? `${props.title} - ` : '') + 'Sound Rig';
  }, [props.title]);
  const Component = props.element;
  return <Component />;
};

const createRoute = (route: IRoute, index: number) => {
  const Component = () =>
    RouteComponentWithTitle({ title: route.title, element: route.component });
  // if (route.subs) {
  //   return (
  //     <Route key={`route-${index}`} path={route.path} element={<Component />}>
  //       {route.subs.map(createRoute)}
  //     </Route>
  //   );
  // }
  // else {
  // }
  return (
    <Route key={`route-${index}`} path={route.path} element={<Component />} />
  );
};

/// NOTE: this is utilized to prevent wasted re-rendering by the use of useNavigate
const AuthedAppIdleTimeoutWrapper = (props: { children: React.ReactNode }) => {
  const user = {
    userId: 'TODO'
  };
  return <>{props.children}</>;
};

export const App = () => {
  return (
    <div className='App'>
      <AuthedAppIdleTimeoutWrapper>
        <Layout>
          <Layout.Header className=''>
            <AppHeader />
          </Layout.Header>
          <Layout.Content className={'hidden md:flex'}>
            <Routes>{ROUTES.map(createRoute)}</Routes>
          </Layout.Content>
          <Layout.Content className={'flex md:hidden'}>
            <Routes>{ROUTES_MOBILE.map(createRoute)}</Routes>
          </Layout.Content>
          <Layout.Footer>
            <div className={'bg-slate-800 text-center py-1 whitespace-pre'}>
              <span> © 2022 SoundRig  •  <a href={DISCORD} target={'__blank'}>Discord</a>  •  <a href={TWITTER} target={'__blank'}>Twitter</a></span>
            </div>
          </Layout.Footer>
        </Layout>
      </AuthedAppIdleTimeoutWrapper>
    </div>
  );
};
