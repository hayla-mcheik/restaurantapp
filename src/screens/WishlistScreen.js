import { StyleSheet, Text, TouchableOpacity, View , Image , ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import url from '../components/url';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import  Header  from '../components/header';
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { selectWishlist, setWishlist } from '../../wishlistReducer';
const WishlistScreen = () => {
const navigation = useNavigation();
const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

const dispatch = useDispatch();
const reduxWishlistList = useSelector(selectWishlist);
const getWishlist = async () => {
  
    const token = await AsyncStorage.getItem('auth_token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    };
    const response = await axios.get(`${url.baseURL}/wishlist`, { headers });
    dispatch(setWishlist(response.data)); 
};



const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token && isAuthenticated) {
        await getWishlist();
      } 
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [isAuthenticated]);


  return (
    <View className="flex-1 bg-white">
        <StatusBar style="dark" />
        <GestureHandlerRootView>
        <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}
        className="space-y-6 pt-14">
<Header />
<View className="mt-4">
<View className="flex">
<TouchableOpacity
onPress={()=>navigation.goBack()}
className="absolute left-4 bg-gray-100 p-2 rounded-full shadow">
<ArrowLeftIcon  strokeWidth={3} color="black" />
</TouchableOpacity>
  <Text className="mx-4 font-bold text-lg mt-20">My Wishlist List</Text>
  </View>

  {loading ? (
    
    <View><Text>Loading...</Text></View>

) : (
  <View className="mt-5">
  
 {reduxWishlistList.length === 0 ? (
  <View className="flex flex-row justify-center items-center mt-20">
    <Text>No items in the wishlist</Text>
  </View>
) : (
  <View className="mt-5">
      {isAuthenticated ? (
        
  <View className="mt-5">
    {reduxWishlistList.map((item, index) => (
      <View key={item.id} className="flex-row items-center bg-gray-100 p-3 rounded-3xl shadow-2xl mb-3 mx-2">
        {item.menuitems && item.menuitems.image && (
          <Image
            src={`${url.mediaURL}/${item.menuitems.image}`}
            className="rounded-3xl"
            style={{ height: 60, width: 60 }}
          />
        )}
        <View className="flex flex-1 space-y-3">
          <View className="pl-3 flex flex-row justify-between items-center">
            {item.menuitems && (
              <Text className="text-l text-neutral-800">{item.menuitems.name}</Text>
            )}

{item.menuitems && (
              <Text className="text-l text-neutral-800">${item.menuitems.price}</Text>
            )}
          </View>
        </View>
      </View>
    ))}
  </View>
) :            <View className="flex flex-row justify-center items-center mt-20">
<Text>Please log in to view your wishlist.</Text>
</View>
}

  </View>
)}

  </View>
)}
</View>
        </ScrollView>
        </GestureHandlerRootView>   
    </View>
  )
}

export default WishlistScreen

const styles = StyleSheet.create({})