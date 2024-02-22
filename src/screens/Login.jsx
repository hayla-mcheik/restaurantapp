import React, { useEffect, useState} from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import url from '../components/url';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from "react-redux";
import { login} from "../../authReducer";
import { useContext } from 'react';
import { selectWishlist, setWishlist } from '../../wishlistReducer';
import {setCart , selectCart , setInitialCartCount} from "../../CartReducer.js";

const Login = (props) => {
  const reduxWishlistList = useSelector(selectWishlist);
  const reduxCartList = useSelector(selectCart);
  console.log('redux wishlist home details :' , reduxWishlistList);
  console.log('redux cart home details :' , reduxCartList);
const route = props.route;
  const navigation = useNavigation();
const { params } = route;
  const dispatch = useDispatch();
  const nextScreen = route&&route.params&&route.params.nextScreen?route.params.nextScreen:null;
  const goBack=route&&route.params&&route.params.goBack?route.params.goBack:false;
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [loginInput, setLogin] = useState({
    email: '',
    password: '',
    error_list: {},
  });

  const handleInput = (name, value) => {
    setLogin({ ...loginInput, [name]: value });
  };


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
      const token = await AsyncStorage.getItem('auth_token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      };  
        const response = await axios.get(`${url.baseURL}/cartcount`, { headers });
        dispatch(setCart(response.data.cartItems)); 
        dispatch(setInitialCartCount(response.data.cartCount));
        console.log('cart count in login:' , response.data.cartCount);
  }

  useEffect(() => {
    getCartCount();
    getWishlist();
  }, []);
  
  const loginSubmit = async () => {
    try {
      const data = {
        email: loginInput.email,
        password: loginInput.password,
      };
      const loginResponse = await axios.post(`${url.baseURL}/login`, data);
      if (!loginResponse.data) {

        Toast.show({
          text1: 'Login failed: Empty response data',
          type: 'error',
          position: 'top',
          duration: 3000,
        });
        return;
      }
  
      if (loginResponse.data.status === 200) {
        dispatch(login({ userData: loginResponse.data, token: loginResponse.data.token }));
        AsyncStorage.setItem('auth_token', loginResponse.data.token);
        getCartCount();
        if (goBack == true) {
          navigation.goBack();
        } else {
          navigation.navigate('Home');
        }
      } else if (loginResponse.data.status === 405) {
        Toast.show({
          text1: 'Your account is not yet active',
          text2: 'Please wait for admin approval',
          type: 'warning',
          position: 'top',
          duration: 3000,
        });
      } else if (loginResponse.data.status === 401) {
        Toast.show({
          text1: 'Warning',
          text2: loginResponse.data.message,
          type: 'warning',
          position: 'top',
          duration: 3000,
        });
      } else if (loginResponse.data.status === 422) {
        Toast.show({
          text1: 'Error',
          text2: `Login failed: ${loginResponse.data.errors}`,
          type: 'error',
          position: 'top',
          duration: 3000,
        });
      } else {
        Toast.show({
          text1: 'Login successful',
          text2: loginResponse.data.message,
          type: 'success',
          position: 'top',
          duration: 3000,
        });
      }
    } catch (error) {
      Toast.show({
        text1: error.response?.data.message || error.response?.data.errors?.email || error.response?.data.errors?.password || 'An error occurred',
        type: 'error',
        position: 'top',
        duration: 3000,
      });
    }
  };
  
  

  useEffect(() => {
    const nextScreen=route&&route.params&&route.params.nextScreen?route.params.nextScreen:null;
    
  }, []);

  return (
    <View className="flex-1 bg-white bg-red-500" >
      <SafeAreaView className="flex">
        <View className="flex-row justify-start">
        </View>

        <View className="flex-row justify-center">
          <Image source={require('../../assets/images/loginres.png')} style={{ width: 400, height: 200 }} />
        </View>
      </SafeAreaView>

      <View className="flex-1 bg-white px-8 pt-8">
        <View className="form space-y-2">
          <Text className="text-gray-700 ml-4">Email Address</Text>
          
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 mb-3"
            onChangeText={(text) => handleInput('email', text)}
            value={loginInput.email}
            placeholder="Enter Email"
            error={loginInput.error_list.email}
            errorText={loginInput.error_list.email}
          />

          <Text className="text-gray-700 ml-4">Password</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700"
            secureTextEntry
            onChangeText={(text) => handleInput('password', text)}
            value={loginInput.password}
            placeholder="Enter Password"
            error={loginInput.error_list.password}
            errorText={loginInput.error_list.password}
          />
          
          <TouchableOpacity className="flex items-end mb-5">
            <Text className="text-gray-700" onPress={() => navigation.navigate('ForgetPassword')}>Forget Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity className="py-3 bg-red-400 " onPress={loginSubmit}>
            <Text className="font-xl font-bold text-center text-gray-700">Login</Text>
          </TouchableOpacity>
        </View>


        <View className="flex-row justify-center mt-7">
          <Text className="text-gray-500 font-semibold">Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text className="font-semibold text-red-500"> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
