
import React from 'react';
import AppNavigation  from './src/navigation';
import Toast from 'react-native-toast-message';
import { Provider} from 'react-redux';
import store from './store';
import { LogBox } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import Pusher from 'pusher-js/react-native';

LogBox.ignoreLogs(['Warning: ...']);
console.disableYellowBox = true;
console.warn = () => {};
console.error = () => {};
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
export default function App() {

  Pusher.logToConsole = true;

const pusher = new Pusher('c92de035c19a321f7907', {
  cluster: 'ap2',
  encrypted: true,
});

  const STRIPE_KEY = "pk_test_51OQ738JB8JXGX9W97A2VVXhdVmlDfqlwBc3OxiKn4OgjzAsm1HmeLsDmBZ4fq9ftjTznIlq4RxcbQwjb5lGS9SIS00QKnJH9EA"
  return (
    <Provider store={store}>
          <StripeProvider
      publishableKey={STRIPE_KEY}
    >
<AppNavigation />
<Toast topOffset={70} />
</StripeProvider>
</Provider>
  
  );
}

