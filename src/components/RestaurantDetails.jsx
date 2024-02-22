import {StyleSheet, Text, View , Image, TouchableOpacity , ScrollView  } from 'react-native'
import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CartIcon from './CartIcon';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import url from './url.jsx'; 
import  Header  from '../components/header';
import MenuItems from './MenuItems';
import { useDispatch, useSelector } from 'react-redux';
import { selectWishlist, setWishlist } from '../../wishlistReducer';
import {setCart , selectCart } from "../../CartReducer.js";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useIsFocused } from '@react-navigation/native';
const RestaurantDetails = () => {
  const isFocused = useIsFocused();

  useEffect(() => {
    // This effect will run every time the screen is focused
    if (isFocused) {
      // You can perform any refresh logic here
      console.log('Screen is focused. Refreshing...');
      // For example, you can fetch the updated data here
      // FetchRestaurantDetails(RestaurantId);
    }
  }, [isFocused, RestaurantId]);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
const dispatch = useDispatch();
  const reduxWishlistList = useSelector(selectWishlist);
  const reduxCartDetails = useSelector((state) => state.cart.cartDetails);
  const route = useRoute();
  const  restaurantId  = route&&route.params&&route.params.restaurantId?route.params.restaurantId: 1;
  const [restaurantImage, setRestaurantImage] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [RestaurantId, setRestaurantId] = useState(null);
  const [address, setAddress] = useState("");
  const [categorymenu , setCategoryMenu] = useState([]);
  const [categoryrestaurant , setCategoryRestaurant] = useState([]);
const[categoryname , setCategoryName]= useState("");
  const navigation = useNavigation();

  async function getRestaurants() {
    
      const response = await axios.get(`${url.baseURL}/listing/details/${restaurantId}`); 
      if (response.data && response.data.restaurant) {
        setRestaurantImage(response.data.restaurant.image);
        setRestaurantName(response.data.restaurant.name);
        setRestaurantId(response.data.restaurant.id);
        setAddress(response.data.restaurant.address);
        setCategoryMenu(response.data.menucategories);
        setCategoryRestaurant(response.data.menucategories.restaurant_id);
        setCategoryName(response.data.restaurant.category.name);

      } else {
        Toast.show({
          text1: 'Invalid response format. Restaurant data not found in response',
          type: 'success',
          position: 'top',
          duration: 3000,
        });
      }
 
  }
  
  const getWishlist = async () => {
    if (!isAuthenticated) {
      return; 
    }
      const token = await AsyncStorage.getItem('auth_token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      };
      const response = await axios.get(`${url.baseURL}/wishlist`, { headers });
      dispatch(setWishlist(response.data));

  };
  
  
  async function getCartCount() {
    if (!isAuthenticated) {
      return; 
    }
      const token = await AsyncStorage.getItem('auth_token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      };  
        const response = await axios.get(`${url.baseURL}/cartcount`, { headers });
        dispatch(setCart(response.data.cartItems)); 
  }

  useEffect(() => {
    getCartCount();
    getWishlist();
    getRestaurants();

  }, []);




  return (
    <View className="flex-1 bg-white">
        <StatusBar style="dark" />
        <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}
        className="space-y-6 mt-14">
<Header />
      <StatusBar style="light" />
<ScrollView>
  <View className="relative">
<Image className="w-full h-72"    src={`${url.mediaURL}/${restaurantImage}`} />
<TouchableOpacity
onPress={()=>navigation.goBack()}
className="absolute top-14 left-4 bg-gray-50 p-2 rounded-full shadow">
<ArrowLeftIcon  strokeWidth={3} color="black" />
</TouchableOpacity>
  </View>

<View className="bg-white pt-6">
<View style={{paddingLeft: hp(1)}}>
<Text className="text-3xl font-bold capitalize ">{restaurantName}</Text>
<View className="flex-row space-x-2 my-1">
<View className="block space-x-1">
<Text className="text-gray-500 mx-1 capitalize">
Category:{categoryname}
</Text>
<Text className="text-gray-500 mt-2">Location: {address}</Text>
</View>

</View>
</View>
</View>


<View className="pb-5 bg-white">
  <Text className="px-4 py-4 text-2xl font-bold">Menu items</Text>

  {categorymenu.map((category) => {
    
    return(
    <View key={category.id}>
      <Text className="mx-4 font-bold text-lg capitalize">
        {category.name} : {category.menuitems.length === 0 ? 'No items' : `${category.menuitems.length} item(s)`}
      </Text>
      {category.menuitems.length > 0 ? (
        category.menuitems.map((item) =>      

        {
          const exist = reduxWishlistList.some((_item) => _item.menu_item_id === item.id);
          const exist2 = reduxCartDetails.some((_item) => _item.menu_item_id === item.id);

          return (
          <MenuItems item={item} key={item.id} RestaurantId={RestaurantId} categoryrestaurant={category} exist={exist}  exist2={exist2} />
        )})
      ) : (
        <Text className="mx-4 text-gray-500 mt-4 mb-5">No items in this category</Text>
      )}
    </View>
  )})}
</View>



</ScrollView>
<CartIcon />
</ScrollView>
    </View>
  )
}

export default RestaurantDetails

const styles = StyleSheet.create({})