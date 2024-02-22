import { StyleSheet, Text, View ,Image, TouchableOpacity , ScrollView } from 'react-native'
import React , {useState , useEffect } from 'react'
import  Header  from '../components/header';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView} from 'react-native-gesture-handler';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import url from '../components/url';
import {setInitialCartCount } from '../../CartReducer';
import { useDispatch } from 'react-redux';

const Thankyou = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  async function getCartCount() {
    const token = await AsyncStorage.getItem('auth_token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    };
      const response = await axios.get(`${url.baseURL}/cartcount`, { headers });
      dispatch(setInitialCartCount(response.data.cartCount));
      console.log('cart count in thank you:' , response.data.cartCount);
  }

  useEffect(() => {
    getCartCount();
  }, []);

  return (
    <View className="flex-1 bg-white">
        <StatusBar style="dark" backgroundColor='white' />
        <GestureHandlerRootView>
        <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}
        className="space-y-6 pt-14">
<Header />


<View className="flex flex-row items-center justify-center align-center mt-20">
<Image  className="mt-20" source ={require('../../assets/images/thanks.png')} style={{height: hp(30), width: hp(30)}} />
</View>
<View>
<TouchableOpacity className="flex flex-row items-center justify-center align-center" onPress={()=>navigation.navigate('Home')}>
  <Text className="font-bold text-lg">Go to Home</Text>
</TouchableOpacity>
</View>
</ScrollView>
</GestureHandlerRootView>
</View>
  )
}

export default Thankyou

const styles = StyleSheet.create({})