import React, { useState , useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import url from './url.jsx';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from "react-redux";
import {setCart ,  addToCart , setInitialCartCount} from "../../CartReducer.js";
import {  setWishlist } from "../../wishlistReducer.js"
import { useNavigation } from '@react-navigation/native';
const MenuItems = ({ item , RestaurantId , categoryrestaurant , exist , exist2}) => {
  const cart = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [quantity, setQuantity] = useState(0);

  const navigation = useNavigation();


  async function getCartCount() {
    const token = await AsyncStorage.getItem('auth_token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    };

    if (isAuthenticated) {
      const response = await axios.get(`${url.baseURL}/cartcount`, { headers });
      dispatch(setInitialCartCount(response.data.cartCount));
      dispatch(setCart(response.data.cartItems)); 
    } 
}

  const handleAddToCart = async (itemId) => {
      const token = await AsyncStorage.getItem('auth_token');
      if (!isAuthenticated) {
        navigation.navigate('Login', {goBack:true});
        return;
      }
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      };
      const data = {
        menu_item_id: itemId,
        quantity: quantity,
      };  
      if (cart.length > 0) {
        if (categoryrestaurant.restaurant_id !== RestaurantId) {     
          Toast.show({
            text1: 'Cannot add items from different restaurants to the cart',
            type: 'info',
            position: 'top',
            duration: 3000,
          });
          return;
        }
      }
      const response = await axios.post(`${url.baseURL}/addtocart/${item.id}`, data, { headers });
   
      if (response.data.status === 200) {
        Toast.show({
          text1: 'Item added to cart successfully',
          type: 'success',
          position: 'top',
          duration: 3000,
        }); 
          dispatch(addToCart(item));   
          getCartCount();      
      } else if (response.data.status === 401) {
        navigation.navigate('Login', {goBack:true});
        getCartCount();
        getWishlist();
        return;
      } 
        else if (response.data.status === 403) {
        Toast.show({
          text1: 'Cannot add items from different restaurants to the cart',
          type: 'info',
          position: 'top',
          duration: 3000,
        });
      } 
      
      
      else if (response.data.status === 422) {
        Toast.show({
          text1: 'Only users can add to cart',
          type: 'info',
          position: 'top',
          duration: 3000,
        });
      }
      else if (response.data.status === 404) {
        Toast.show({
          text1: 'this quantity is not available',
          type: 'info',
          position: 'top',
          duration: 3000,
        });
      }

      else if (response.data.status === 423)
      {
        Toast.show({
          text1: 'Already added to cart',
          type: 'info',
          position: 'top',
          duration: 3000,
        });
      }
      
      else {
        Toast.show({
          text1: 'Failed to add item to cart. Please try again.',
          type: 'info',
          position: 'top',
          duration: 3000,
        });
      }

  };

  const getWishlist = async () => {
    if (!isAuthenticated) {
      return; 
    }
     else if (isAuthenticated) {
      const token = await AsyncStorage.getItem('auth_token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      };
      const response = await axios.get(`${url.baseURL}/wishlist`, { headers });
      dispatch(setWishlist(response.data)); 
    } 
 
  };

  const handleAddToWishlist = async () => {
      const token = await AsyncStorage.getItem('auth_token');
      if(!isAuthenticated)
      {
        navigation.navigate('Login', {nextScreen:'RestaurantDetails'});
        return;
      }
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      };
      const data = {
        menu_item_id: item.id,
      }; 
      const response = await axios.post(`${url.baseURL}/addtowishlist/${item.id}`, data, { headers });
      // Check the status code and handle accordingly
      if (response.data.status === 200) {
        getWishlist();
        Toast.show({
          text1: 'Item added to wishlist successfully',
          type: 'success',
          position: 'top',
          duration: 3000,
        });
  

      } else if (response.data.status === 401) {
        navigation.navigate('Login', {nextScreen:'RestaurantDetails'});
        return;
      } 


      else if (response.data.status === 422) {
        Toast.show({
          text1: 'Only users can add to wishlist',
          type: 'info',
          position: 'top',
          duration: 3000,
        });
      }
      
      else if (response.data.status === 420) {
        removeFromWishlist();
      }

  };


  const removeFromWishlist = async () => {
      const token = await AsyncStorage.getItem('auth_token');
      if(!isAuthenticated)
      {
        navigation.navigate('Login', {nextScreen:'RestaurantDetails'});
        return;
      }
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      };
      const data = {
        menu_item_id: item.id,
        quantity: quantity === 0 ? 1 : quantity,        
      }; 
      const response = await axios.post(`${url.baseURL}/deletewishlistitem/${item.id}`, data, { headers });
      getWishlist();
      if (response.data.status === 200) {
        Toast.show({
          text1: 'Item removed from wishlist',
          type: 'success',
          position: 'top',
          duration: 3000,
        });
        
      } else if (response.data.status === 401) {
        navigation.navigate('Login', {nextScreen:'RestaurantDetails'});
        return;
      } 


      else if (response.data.status === 422) {
        Toast.show({
          text1: 'Only users can remove wishlist',
          type: 'info',
          position: 'top',
          duration: 3000,
        });
      }

  };

  
  return (
    
    <View>  
      <View className="flex-row items-center bg-white p-3 rounded-3xl shadow-2xl mb-3 mx-2">
        <Image src={`${url.mediaURL}/${item.image}`} className="rounded-3xl" style={{ height: 100, width: 100 }} />

        <View className="flex flex-1 space-y-3">
          <View className="pl-3">
            <Text className="text-xl capitalize font-bold mt-2">{item.name}</Text>
            <Text className="text-gray-500 mt-2">Description about {item.name} </Text>

          </View>

          <View className="flex-row justify-between pl-3 items-center">
  <Text className="text-gray-700 text-lg font-bold">${item.price}</Text>

</View>

<View className="flex flex-row text-center p-2 m-2">
  {exist2 && isAuthenticated ? (
    <View className="bg-green-500 p-2 m-1">
      <TouchableOpacity onPress={() => handleAddToCart(item.id)} className="flex flex-row">
        <MaterialCommunityIcons name='cart' color='#fff' size={14} />
        <Text className="text-white font-bold" style={styles.textbutton}>
          Added to Cart
        </Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View className="bg-red-500 p-2 m-1">
      <TouchableOpacity onPress={() => handleAddToCart(item.id)} className="flex flex-row">
        <MaterialCommunityIcons name='cart' color='#fff' size={14} />
        <Text className="text-white font-bold" style={styles.textbutton}>
          Add to Cart
        </Text>
      </TouchableOpacity>
    </View>
  )}

  {exist && isAuthenticated ? (
    <View className="bg-green-500 p-2 m-1">
      <TouchableOpacity onPress={() => handleAddToWishlist(item.id)} className="flex flex-row">
        <MaterialCommunityIcons name="heart" color="#fff" size={14} />
        <Text className="text-white font-bold" style={styles.textbutton}>
          Added to Wishlist
        </Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View className="bg-red-500 p-2 m-1">
      <TouchableOpacity onPress={() => handleAddToWishlist(item.id)} className="flex flex-row">
        <MaterialCommunityIcons name='heart' color='#fff' size={14} />
        <Text className="text-white font-bold" style={styles.textbutton}>
          Add to Wishlist
        </Text>
      </TouchableOpacity>
    </View>
  )}
</View>


        
        </View>
      </View>
    </View>
  );
};
export default MenuItems;
const styles = StyleSheet.create({
  textbutton: {
  fontSize:12,
  }
});
