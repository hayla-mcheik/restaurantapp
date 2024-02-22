import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,TouchableOpacity,ScrollView  } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import axios from 'axios';
import url from '../components/url';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import { useDispatch, useSelector } from 'react-redux';
import { selectAddresses , setAddresses } from '../../addressReducer';
const MyAddress = () => {
  const dispatch = useDispatch();
  const reduxAddressesList = useSelector(selectAddresses);
const navigation = useNavigation();
const getAddresses = async () => {
    const token = await AsyncStorage.getItem('auth_token');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    };
    const response = await axios.get(`${url.baseURL}/showaddresses`, { headers });

    dispatch(setAddresses(response.data.addresses));

};


const deleteAddress = async (addressId) => {
    const token = await AsyncStorage.getItem('auth_token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    };

    await axios.get(`${url.baseURL}/deleteaddresses/${addressId}`, { headers });

    dispatch(deleteAddress(addressId));

    getAddresses();

    Toast.show({
      text1: 'Address deleted successfully',
      type: 'success',
      position: 'top',
      duration: 3000,
    });

};
useEffect(() => {
  getAddresses();
});


  
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" backgroundColor='white' />
      <GestureHandlerRootView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
          className="space-y-6 pt-14">
          <Header />
          <View className="flex flex-row justify-end m-4">
          <TouchableOpacity
onPress={()=>navigation.navigate('Dashboard')}
className="absolute left-4 bg-gray-100 p-2 rounded-full shadow">
<ArrowLeftIcon  strokeWidth={3} color="black" />
</TouchableOpacity>
            <TouchableOpacity className="bg-red-500 p-3" onPress={()=>navigation.navigate('AddAddresses')}>
<Text className="text-white">Add New Address</Text>
</TouchableOpacity>
        </View>
          <View style={styles.tableContainer}>

            <View style={styles.tableRow}>
              <Text style={styles.tableHeading}>Id</Text>
              <Text style={styles.tableHeading}>Label</Text>
              <Text style={styles.tableHeading}>Address</Text>
              <Text style={styles.tableHeading}>Action</Text>
            </View>

            {/* Table Body */}
            {reduxAddressesList.map((address, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableData}>{address.id}</Text>
                <Text style={styles.tableData}>{address.label}</Text>
                <Text style={styles.tableData}>{address.address}</Text>
                <Text style={styles.tableData}>
                <MaterialCommunityIcons
    name="delete"
    color="red"
    backgroundColor="transparent"
    size={20}
    onPress={() => deleteAddress(address.id)} 
/>


                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </View>
  );
};

export default MyAddress;

const styles = StyleSheet.create({
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    margin: 10,
  }, 
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  tableHeading: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableData: {
    flex: 1,
    textAlign: 'center',
  },
});
