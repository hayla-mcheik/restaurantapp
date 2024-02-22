import { StyleSheet, Text, TouchableOpacity, View , ScrollView } from 'react-native'
import React,{useState, useEffect} from 'react'
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import axios from 'axios';
import url from '../components/url';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  Header  from '../components/header';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addAddress } from '../../addressReducer';

const AddAddresses = () => {
  const dispatch = useDispatch();

const navigation = useNavigation();
    const [addressInput, setAddress] = useState({
        label: '',
        address: '',
        error_list: {},
      });
      
      const handleInput = (name, value) => {
        setAddress({ ...addressInput, [name]: value });
      };
      
      
      const addressSubmit = async () => {
          const token = await AsyncStorage.getItem('auth_token');
      
          const headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          };
      
          const data = {
            label: addressInput.label,
            address: addressInput.address,
          };
      
          const response = await axios.post(`${url.baseURL}/addaddresses`, data, { headers });
      
          if (response.data.status === 200) {
dispatch(addAddress(response.data.address));
            Toast.show({
              text1: 'Address Added successfully.',
              type: 'success',
              position: 'top',
              duration: 3000,
            });
            navigation.goBack();
          } else if (response.data.status === 400) {
            Toast.show({
              text1: 'Validation Failed.',
              type: 'error',
              position: 'top',
              duration: 3000,
            });
          } 
      };
      

      
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" backgroundColor='white' />
      <GestureHandlerRootView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
          className="space-y-6 pt-14">
          <Header />

<View>
<TextInput
        onChangeText={(text) => handleInput('label', text)}
        value={addressInput.label}
        style={styles.input}
        placeholder="Label"
      />
      <TextInput
        onChangeText={(text) => handleInput('address', text)}
        value={addressInput.address}
        style={styles.input}
        placeholder="Address"
      />
      <View className="flex flex-row justify-end m-4">
      <TouchableOpacity onPress={addressSubmit} className="bg-red-500 p-4 ">
                <Text className="text-white">Submit</Text>
            </TouchableOpacity>
      </View>
</View>


          </ScrollView>
          </GestureHandlerRootView>
          </View>
  )
}

export default AddAddresses

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        borderColor:'#dee2e6',
        padding: 10,
      },
})