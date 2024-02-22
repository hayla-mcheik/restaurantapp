import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity , ScrollView  } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import * as Icon from 'react-native-feather';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import url from '../components/url';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import Header from '../components/header';
import {setInitialCartCount ,  removeFromCart , clearCart} from '../../CartReducer';
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
const CartScreen = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const cart = useSelector((state) => state.cart.cart);
  const cartCountRedux = useSelector((state) => state.cart.cartCount);
  const dispatch = useDispatch();
  const [subtotal, setSubTotal] = useState(0);
  const [cartItemsDetails, setCartItemsDetails] = useState([]);
  const [quantity, setQuantity] = useState(0); 

  const handleAddToCart = async (itemId , itemQuantity) => {
      const token = await AsyncStorage.getItem('auth_token');
    
      if (!isAuthenticated) {
        navigation.navigate('Login', { goBack: true });
        return;
      }
    
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      };
    
      const data = {
        menu_item_id: itemId,
        quantity: itemQuantity + 1,
      };
    
      const response = await axios.post(`${url.baseURL}/quantityaddtocart/${itemId}`, data, { headers });
      setQuantity(0);
      if (response.data.status === 200) {
        Toast.show({
          text1: 'Item added to cart successfully',
          type: 'success',
          position: 'top',
          duration: 3000,
        });
        getCartCount();
      }  else if (response.data.status === 403) {
        Toast.show({
          text1: 'Quantity exceeds the limit',
          type: 'info',
          position: 'top',
          duration: 3000,
        });
      }  else if (response.data.status === 404) {
        Toast.show({
          text1: 'Out of stock',
          type: 'info',
          position: 'top',
          duration: 3000,
        });
      } else {
        Toast.show({
          text1: 'Failed to add item to cart. Please try again.',
          type: 'info',
          position: 'top',
          duration: 3000,
        });
      }
  };
  


  const handleDecrementToCart = async (itemId , itemQuantity) => {
      const token = await AsyncStorage.getItem('auth_token');
      if (!isAuthenticated) {
        navigation.navigate('Login');
        return;
      }
  
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      };
  
      const data = {
        menu_item_id: itemId,
        quantity: itemQuantity, // You only need to decrement by 1
      };
      
      // Otherwise, decrement the quantity
      const response = await axios.post(`${url.baseURL}/updatecartquantity/${itemId}`, data, { headers });
      if (response.data.status === 200) {
        if (itemQuantity === 1) {
          Toast.show({
            text1: 'Item quantity cannot be less than 1',
            type: 'error',
            position: 'top',
            duration: 3000,
          });
        } else {
          Toast.show({
            text1: 'Item quantity updated successfully',
            type: 'success',
            position: 'top',
            duration: 3000,
          });
          getCartCount();
        }
      } else {
        Toast.show({
          text1: 'Failed to update item quantity. Please try again.',
          type: 'info',
          position: 'top',
          duration: 3000,
        });
      }
  
  };
  

  async function getCartCount() {
      const token = await AsyncStorage.getItem('auth_token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      };

      if (isAuthenticated) {
        const response = await axios.get(`${url.baseURL}/cartcount`, { headers });
        dispatch(setInitialCartCount(response.data.cartCount));
        setSubTotal(response.data.subtotal);
        setCartItemsDetails(response.data.cartItems);
      } else {
        dispatch(setInitialCartCount(0));
        setSubTotal(0);
      }
  }

  const deleteCartItem = async (itemId) => {
      const token = await AsyncStorage.getItem('auth_token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      };
  
      if (isAuthenticated) {
        const response = await axios.get(`${url.baseURL}/deleteorderitems/${itemId}`, { headers });
  
        if (response.data.status === 200) {
          getCartCount();
          // If the server deletion was successful, update the local Redux state
          dispatch(removeFromCart({ id: itemId }));
  
          // Manually update the cartItemsDetails state by removing the deleted item
          setCartItemsDetails(prevCartItems => prevCartItems.filter(item => item.id !== itemId));
          navigation.replace('CartScreen');
          Toast.show({
            text1: 'Item deleted successfully',
            type: 'success',
            position: 'top',
            duration: 3000,
          });
  
          await getCartCount();
        } else if (response.data.status === 404) {
          Toast.show({
            text1: response.data.message,
            type: 'success',
            position: 'top',
            duration: 3000,
          });
        } else {
          Toast.show({
            text1: response.data,
            type: 'success',
            position: 'top',
            duration: 3000,
          });
        }
      }
  };
  
  const deleteCart = async () => {
      const token = await AsyncStorage.getItem('auth_token');
      if (!isAuthenticated)  {
        Toast.show({
          text1: 'Please Login To delete cart',
          type: 'error',
          position: 'top',
          duration: 3000,
        });
        return;
      }
  
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      };
  
      const response = await axios.get(`${url.baseURL}/deletecartitems`, { headers });
  
      if (response.status === 200) {
        Toast.show({
          text1: 'Cart deleted successfully',
          type: 'success',
          position: 'top',
          duration: 3000,
        });
      } else {
        Toast.show({
          text1: 'Error deleting cart:',
          type: 'success',
          position: 'top',
          duration: 3000,
        });
      }

  };
  

  const clearCartHandler = async () => {
    try {
      // Delete items from the server
      await deleteCart();
  
      // Wait for the server operation to complete, then dispatch clearCart
      dispatch(clearCart());
  
      // Manually update the cartItemsDetails state after clearing the cart
      setCartItemsDetails([]);
  
      Toast.show({
        text1: 'Cart cleared successfully',
        type: 'success',
        position: 'top',
        duration: 3000,
      });
    } catch (error) {
      Toast.show({
        text1: 'Failed to clear cart. Please try again.',
        type: 'error',
        position: 'top',
        duration: 3000,
      });
    }
  };
  

  useEffect(() => {
    getCartCount();
  }, []);

  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-white">
        <StatusBar style="dark" />
        <GestureHandlerRootView>
        <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}
        className="space-y-6 pt-14">
<Header />
          <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ backgroundColor: 'white', padding: 10, marginBottom: 20 }}>
              <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>Your Cart</Text>
              
              <Text style={{ textAlign: 'center', color: '#888' }}>Restaurant</Text>
            </View>
            <TouchableOpacity
onPress={()=>navigation.goBack()}
className="absolute top-5 left-4 bg-gray-50 p-2 rounded-full shadow">
<ArrowLeftIcon strokeWidth={3} color="black" />
</TouchableOpacity>
            <View style={{ backgroundColor: '#FF4500', flexDirection: 'row', padding: 20, marginTop: 10, alignItems: 'center' }}>
              <Image source={require('../../assets/images/img3.jpeg')} style={{ width: 80, height: 80, borderRadius: 40 }} />
              <Text style={{ marginLeft: 20, color: 'white', fontWeight: 'bold', fontSize: 20 }}>Your Cart Here</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 50, paddingTop: 5 }}>
              {cartItemsDetails && cartItemsDetails.length > 0 ? (
                cartItemsDetails.map((item, index) => (
                  <View key={index} style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'white' }}>
                    <Text style={{ fontWeight: 'bold' }}>{item.quantity} x</Text>
                    <Image
                      source={{ uri: `${url.mediaURL}/${item.menuitems[0]?.image}` }}
                      style={{ height: 60, width: 60, borderRadius: 30 }}
                    />
                    <Text style={{ marginLeft: 10, flex: 1, fontWeight: 'bold', color: '#333' }}>{item.menuitems[0]?.name}</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>${item.price}</Text>
                    <View className="flex-row items-center">
  <TouchableOpacity
  onPress={() => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    handleDecrementToCart(item.menu_item_id , item.quantity); 
    
  }}
  className="p-1 rounded-full bg-red-500"
>
  <Icon.Minus strokeWidth={2} height={20} width={20} stroke={'white'} />
</TouchableOpacity>


<Text className="px-3">{item.quantity}</Text>

<TouchableOpacity
  onPress={() => {

      setQuantity((prevQuantity) => prevQuantity + 1);
      handleAddToCart(item.menu_item_id , item.quantity); 
    
  }}
  className="p-1 rounded-full bg-red-500"
>
  <Icon.Plus strokeWidth={2} height={20} width={20} stroke={'white'} />
</TouchableOpacity>

  </View>
                    <TouchableOpacity onPress={() => deleteCartItem(item.id)} style={{ marginLeft: 10 }}>
                      <Text style={{ color: 'red', fontWeight: 'bold' }}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                  <Text style={{ fontSize: 14, color: '#333' }}>No cart items</Text>
                </View>
              )}
            </ScrollView>

            <View style={{ backgroundColor: '#FF4500', padding: 10, marginTop: 5 }}>
              {cartItemsDetails && cartItemsDetails.length > 0 ? (
                <>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18, marginBottom: 5 }}>Cart Items ({cartCountRedux })</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                    <Text style={{ color: 'white' }}>Total Order</Text>
                    <Text style={{ color: 'white' }}>${subtotal}</Text>
                  </View>
      
          
                  <TouchableOpacity
                    style={{ backgroundColor: '#FF6347', padding: 10, borderRadius: 10, marginTop: 10 }}
                    onPress={() => navigation.navigate('OrdersScreenWebView')}
                  >
                    <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>Checkout</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ backgroundColor: 'red', padding: 10, borderRadius: 10, marginTop: 10 }}
                    onPress={clearCartHandler}
                  >
                    <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>Clear Cart</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                  <Text style={{ fontSize: 14, color: 'white' }}>Add items to your cart to proceed with checkout.</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </View>
  );
};

export default CartScreen;