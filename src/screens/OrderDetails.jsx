import { StyleSheet, Text, TouchableOpacity, View , Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import  Header  from '../components/header';
import { Card } from '@rneui/base';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import url from '../components/url';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';

const OrderDetails = () => {
  const route = useRoute();
    const { orderId, orderData } = route.params;
    const [orders , setOrders] = useState([]);
    const [image , setImage] = useState("");
    const[ordername , setOrderName] = useState("");
    const [status , setStatus] = useState("");
    const [orderitems , setOrderItems] = useState([]);
const navigation = useNavigation();

const calculateSubtotal = () => {
  let subtotal = 0;

  orderitems.forEach((item) => {
    const quantity = parseInt(item.quantity);
    const price = parseFloat(item.price);
    subtotal += quantity * price;
  });

  return subtotal;
};


const getOrders = async () => {
      const token = await AsyncStorage.getItem('auth_token');
      const headers = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
      };
      const response = await axios.get(`${url.baseURL}/showorder/details/${orderId}`, { headers });
      setOrders(response.data.order);  // Update this line to use response.data.orders
      setImage(response.data.order.order_items[0].menu.image);
      setOrderName(response.data.order.order_no);
      setOrderItems(response.data.order.order_items);
      setStatus(response.data.order.status_message);


};

useEffect(() => {
    getOrders();
  }, []);
  return (
    <View className="flex-1 bg-white">
  <StatusBar style="dark" />
  <GestureHandlerRootView>
    <ScrollView 
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom : 50}}
    className="space-y-6 pt-14"
    >
<Header />

<View className="mt-5">
<TouchableOpacity
onPress={()=>navigation.goBack()}
className="absolute left-4 mb-5 bg-gray-100 p-2 rounded-full shadow">
<ArrowLeftIcon  strokeWidth={3} color="black" size={30}/>
</TouchableOpacity>
    <Text className="mx-4 text-lg font-bold mt-20">My Order Details</Text>
<View>
{orderitems.length > 0 ? (
    <Card>

    <View className="mt-5 bg-gray-100 p-3 rounded-3xl shadow-2xl mb-3 mx-2 ">
    <View className="flex-row items-center justify-start ">
    <Image
      src={`${url.mediaURL}/${image}`}
      className="rounded-3xl"
      style={{ height: 100, width: 100 }}
    />
    <View>
    <Text className="mx-2 text-neutral-900 font-bold">{ordername}</Text>
    <Text className="mx-2 text-neutral-900">Order items:</Text>
{orderitems.map((item) => (
    <Text key={item.menu.name} className="mx-2 text-neutral-900">
        {item.menu.name}
    </Text>
))}

    </View>
</View>

<View className="mt-4 mx-4">
                    <Text className="font-bold text-neutral-900">Subtotal: ${calculateSubtotal()}</Text>
                    <Text className="font-bold text-neutral-900">Status: {status}</Text>
                  </View>
  </View>
    </Card>

) : (
  <View>
  <Text className="mx-4 text-lg font-bold mt-5">No order items exist.</Text>
  </View>
)}
</View>
</View>
    </ScrollView>
    </GestureHandlerRootView>
    </View>
  )
}

export default OrderDetails

const styles = StyleSheet.create({})