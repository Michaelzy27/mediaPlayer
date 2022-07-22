import { AuthedApp } from 'components/page/AuthedApp';
import 'remixicon/fonts/remixicon.css';
import './App.less'
import useUser from './hooks/useUser';

const App = () => {
  return <AuthedApp />;
};

export default App;
