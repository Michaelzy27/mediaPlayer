import { Layout } from 'antd';
import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';
import { ROUTES } from 'routes';
import { AppHeader } from 'components/layout/AppHeader';

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

const createRoute = (route: any, index: number) => {
  const Component = () =>
    RouteComponentWithTitle({ title: route.title, element: route.component });
  if (route.subs) {
    return (
      <Route key={`route-${index}`} path={route.path} element={<Component />}>
        {route.subs.map(createRoute)}
      </Route>
    );
  } else {
    return (
      <Route key={`route-${index}`} path={route.path} element={<Component />} />
    );
  }
};

/// NOTE: this is utilized to prevent wasted re-rendering by the use of useNavigate
const AuthedAppIdleTimeoutWrapper = (props: { children: React.ReactNode }) => {
  const user = {
    userId: 'TODO',
  };
  return <>{props.children}</>;
};

export const AuthedApp = () => {
  return (
    <div className="App">
      <AuthedAppIdleTimeoutWrapper>
        <Layout>
          <Layout.Header className="">
            <AppHeader />
          </Layout.Header>
          <Layout.Content className={'flex'}>
            <Routes>{ROUTES.map(createRoute)}</Routes>
          </Layout.Content>
          <Layout.Footer>
            <div className={'bg-slate-800 text-center'}>
              © 2022 SoundRig
            </div>
          </Layout.Footer>
        </Layout>
      </AuthedAppIdleTimeoutWrapper>
    </div>
  );
};

