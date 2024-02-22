// Import necessary components

import React , {useState , useEffect} from 'react';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from '../../CartReducer';
import { useNavigation } from '@react-navigation/native';

const OrdersScreenWebView = () => {
  const dispatch = useDispatch(); 
  const authToken = useSelector(state => state.auth.auth_token);
  const [webViewContent, setWebViewContent] = useState('');
  const navigation = useNavigation(); 

  const checkoutUrl = `http://192.168.10.182:8000/checkoutmobile?token=${encodeURIComponent(authToken)}`;


  useEffect(() => {
    fetch(checkoutUrl)
      .then(response => response.text())
      .then(responseText => {
        setWebViewContent(responseText);
      })
      .catch(error => {
        console.error('Error fetching HTML:', error);
      });
      
  }, [authToken, checkoutUrl]);

  const handleWebViewMessage = event => {
    const messageData = event.nativeEvent.data;
    console.log('Received message from WebView:', messageData);
    const parsedData = JSON.parse(messageData);
    if (parsedData.type === 'paymentSuccess') {
      dispatch(clearCart());
      navigation.navigate('Thankyou');
    }
  };
  

  return (
    <WebView
      source={{ html: webViewContent, baseUrl: checkoutUrl }}
      onMessage={handleWebViewMessage}
    />
  );
};

export default OrdersScreenWebView;
