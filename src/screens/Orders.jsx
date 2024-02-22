import { StyleSheet, Text, View ,TouchableOpacity , ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import url from '../components/url';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView} from 'react-native-gesture-handler';
import  Header  from '../components/header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
const Orders = () => {
    const route = useRoute();
const [orders , setOrders] = useState([]);
const navigation = useNavigation();
const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Add this line

const getOrders = async () => {
    const token = await AsyncStorage.getItem('auth_token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    };
    const response = await axios.get(`${url.baseURL}/showorder`, { headers });
    setOrders(response.data.orders);
};


useEffect(() => {
    getOrders();
  }, []);

  const handleOrderPress = (index, event) => {
    const selectedOrder = orders[index];
    if (selectedOrder) {
      navigation.navigate('OrderDetails', {
        orderId: selectedOrder.id,
      });
    }
  };
  
  
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <GestureHandlerRootView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
          className="space-y-6 pt-14"
        >
          <Header />
          <TouchableOpacity
onPress={()=>navigation.navigate('Dashboard')}
className="absolute top-14 pb-5 left-4 bg-gray-50 p-2 rounded-full shadow">
<ArrowLeftIcon strokeWidth={3} color="black" />
</TouchableOpacity>
          <View className="mt-5 pt-10">
            <View className="flex">
              <Text className="mx-4 font-bold text-lg">My Orders List</Text>
            </View>
            <View className="mt-5">
              {isAuthenticated ? (
                orders.length > 0 ? (
                  orders.map((item, index) => (
                    <View
                      className="flex-row items-center bg-gray-100 p-3 rounded-3xl shadow-2xl mb-3 mx-2 "
                      key={index}
                    >
                      <Text>{item.order_no}</Text>
                      <View className="flex flex-1 space-y-3">
                        <View className="pl-3 flex flex-row justify-between items-center">
                          <Text className="text-l text-neutral-800"></Text>
                          <TouchableOpacity onPress={() => handleOrderPress(index)}>
                            <Text>
                              <MaterialCommunityIcons
                                name="eye"
                                color="red"
                                background="transparent"
                                size={30}
                              />
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  <View className="flex flex-row justify-center items-center mt-20">
                    <Text>No orders available.</Text>
                  </View>
                )
              ) : (
                <View className="flex flex-row justify-center items-center mt-20">
                  <Text>Please log in to view your orders.</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </View>
  )
}

export default Orders

const styles = StyleSheet.create({})