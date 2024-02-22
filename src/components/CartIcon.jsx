import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState , useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import url from './url.jsx';
import { useSelector } from 'react-redux';

const CartIcon = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [cartcount, setCartCount] = useState(0);
  const [subtotal, setSubTotal] = useState(0);
  async function getcartcount() {
      const token = await AsyncStorage.getItem('auth_token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      };
  
      if(isAuthenticated) {

        // User is authenticated
        const response = await axios.get(`${url.baseURL}/cartcount`,{ headers });
setCartCount(response.data.cartCount);
setSubTotal(response.data.subtotal);
      } else {
        setCartCount(0);
        setSubTotal(0);
      }

  }

  useEffect(() => {
    getcartcount();
  }, []);

  const navigation = useNavigation();
  return (
    <View className="bottom-5">
 <TouchableOpacity 
 onPress={()=> navigation.navigate('Cart')}
 className="bg-red-500 flex-row justify-between items-center mx-5p-4 py-3 shadow-lg">
<View className="p-2 px-4">
<Text className="font-extrabold text-white text-lg">

</Text>
</View>
<TouchableOpacity onPress={()=> navigation.navigate('Cart')}>
<Text className="flex-1 text-center font-extrabold text-white text-lg">
View Cart
</Text>
</TouchableOpacity>
<Text className="font-extrabold text-white text-lg">


</Text>
 </TouchableOpacity>
    </View>
  )
}

export default CartIcon

const styles = StyleSheet.create({})