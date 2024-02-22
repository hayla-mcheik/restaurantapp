
import { StyleSheet, Text, View ,TextInput, ScrollView  } from 'react-native'
import React,{useState, useEffect} from 'react'
import { StatusBar } from 'expo-status-bar'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline';
import Categories from '../components/categories';
import Restaurant from '../components/restaurant';
import MostPopular from '../components/mostpopular';
import  Header  from '../components/header';
import Footer from '../components/Footer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import url from '../components/url';
import { useDispatch, useSelector } from 'react-redux';
const HomeScreen = () => {
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
      dispatch(cartCountRedux(response.data.cartCount));
    } else {
      dispatch(setInitialCartCount(0));
    }
}

  useEffect(() => {
    updateCartCount();
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

<View className="mx-4 space-y-2 mb-2">
<Text style={{fontSize: hp(3)}} className="text-neutral-600 font-bold">Find Awesome Deals</Text>
<View>
    <Text style={{fontSize: hp(1.5)}} className="font-semibold text-neutral-600">Lists of top restaurants, cafes, pubs, and bars in Melbourne, based on trends</Text>
</View>
</View>


<View className="mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]">
<TextInput 

placeholder='Search Restaurants'
placeholderTextColor={'gray'}
style={{fontSize: hp(1.7)}}
className="flex-1 text-base mb-1 tracking-wider"
/>
<View className="bg-white rounded-full p-3">
    <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color="gray" />
</View>
</View>

<View>
<Categories />
</View>

<View>
    <Restaurant />
</View>

<View>
    <MostPopular title="Most Popular" data={MostPopular} />
</View>


        </ScrollView>

        </GestureHandlerRootView>
      <Footer />
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})
