import React, { useState, useEffect } from 'react';
import { View,Image, Text, TouchableOpacity  , ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import url from './url.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, setInitialCartCount } from '../../CartReducer.js';
const Header = () => {
  const navigation = useNavigation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const cartCountRedux = useSelector((state) => state.cart.cartCount);


  async function updateCartCount() {
    const token = await AsyncStorage.getItem('auth_token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    };

    if (isAuthenticated) {
      const response = await axios.get(`${url.baseURL}/cartcount`, { headers });
      dispatch(setInitialCartCount(response.data.cartCount));
      console.log('cart count inital in header',response.data.cartCount);
      
    } else {
      dispatch(setInitialCartCount(0));
    }
}

  useEffect(() => {
    updateCartCount();
  }, []);

  const handleNavigateHome = () => {
    navigation.navigate('Home');
  };

  const handleNavigateCart = () => {
    navigation.navigate('Cart');
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    updateCartCount(); 
  };

  return (
    <GestureHandlerRootView>
      <ScrollView className="fixed top-0 w-full p-3" stickyHeaderIndices={[0]}>
        <View className="mx-4 flex-row justify-between items-center mb-2">
          <TouchableOpacity onPress={handleNavigateHome}>
            <Image source={require('../../assets/images/logo.png')} style={{ height: hp(5), width: hp(22) }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNavigateCart}>
          <Text className="text-white flex flex-row items-center justify-center align-center ml-4 font-bold text-l" style={{ color: '#ff3008' }}>{isAuthenticated ? cartCountRedux : 0}</Text>
            <MaterialCommunityIcons name="cart" color="black" background="transparent" size={30} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default Header;
