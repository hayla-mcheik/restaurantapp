import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput , ScrollView } from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import url from '../components/url';
import axios from 'axios';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';

const FirstRoute = () => {
  const [registerInput, setRegister] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role_as: 'user',
    error_list: {},
  });

  const [registerResponse, setRegisterResponse] = useState(null);

  const navigation = useNavigation();

  const handleInput = (name, value) => {
    setRegister((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };


  
  const signup = async () => {
   
    try {
     
      if (!registerInput.name || !registerInput.email || !registerInput.password || !registerInput.phone || !registerInput.role_as) {
        Toast.show({
          text1: 'Please fill in all the required fields!',
          type: 'error',
          position: 'top',
          duration: 3000,
        });
        return; 
      }
    

      const data = {
        name: registerInput.name,
        email: registerInput.email,
        password: registerInput.password,
        phone: registerInput.phone,
        role_as: registerInput.role_as,
      };

   
      const registerResponse = await axios.post(`${url.baseURL}/register`, data);
      Toast.show({
        text1: 'Registration successful!',
        text2: 'Please verify your email to login.',
        type: 'success',
        position: 'top',
        duration: 3000,
      });
      setRegister({
        name: '',
        email: '',
        password: '',
        phone: '',
        role_as: '',
      });
  
      navigation.navigate('Login');
      if (registerResponse.data.status === 200) {
        Toast.show({
          text1: 'Registration successful!',
          text2: 'Please verify your email to login.',
          type: 'success',
          position: 'top',
          duration: 3000,
        });
 
      } else if (registerResponse.status === 422) {
        setRegister({
          ...registerInput,
          error_list: registerResponse.data.errors,
        });
        Toast.show({
          text1: registerResponse.data.errors,
          type: 'error',
          position: 'top',
          duration: 3000,
        });
  
   
  
        // Validation error
        setRegister({
          ...registerInput,
          error_list: registerResponse.data.errors,
        });
      } else if (registerResponse.data.status === 421) {
        Toast.show({
          text1: 'Email address already taken!',
          type: 'error',
          position: 'top',
          duration: 3000,
        });
        // Validation error
        setRegister({
          ...registerInput,
          error_list: registerResponse.data.errors,
        });
      } else {
        // Other errors
        setRegister({
          ...registerInput,
          error_list: registerResponse.data.errors,
        });
      }
    }  catch (error) {
      Toast.show({
        text1: 'Registration failed:', error,
        type: 'error',
        position: 'top',
        duration: 3000,
      });
    
      // Display a generic error message to the user
      Toast.show({
        text1: error.response.data.errors.name || error.response.data.errors.email || error.response.data.errors.password || error.response.data.errors.phone,
        type: 'error',
        position: 'top',
        duration: 3000,
      });
    }
    
  };
  
  return (
    <View className="flex-1 bg-white  bg-red-500" >
      <SafeAreaView className="flex">
        <View className="flex-row justify-start">
        </View>
        <View className="flex-row justify-center">
          <Image source={require('../../assets/images/loginres.png')}  style={{ width: 400, height: 200 }} />
        </View>
      </SafeAreaView>
      <ScrollView>
        <View className="flex-1 bg-white px-8 pt-8">
          <View className="form space-y-2">

         <Text className="text-gray-700 ml-4">Full Name*</Text>
            <TextInput
              className="p-4 bg-gray-100 text-gray-700 mb-3"
              onChangeText={(text) => handleInput('name', text)}
              value={registerInput.name}
              placeholder="Enter Name"
            />


<Text className="text-gray-700 ml-4">Email Address*</Text>
            <TextInput
              className="p-4 bg-gray-100 text-gray-700 mb-3"
              onChangeText={(text) => handleInput('email', text)}
              value={registerInput.email}
              placeholder="Enter Email"
            />
               <Text className="text-gray-700 ml-4">Password*(Password must be at least 8 characters)</Text>
            <TextInput
              className="p-4 bg-gray-100 text-gray-700 mb-7"
              secureTextEntry
              onChangeText={(text) => handleInput('password', text)}
              value={registerInput.password}
              placeholder="Enter Password"
            />
               <Text className="text-gray-700 ml-4">Phone*(Phone field must be at least 8 numbers)</Text>
            <TextInput
              className="p-4 bg-gray-100 text-gray-700 mb-7"
              placeholder="Enter your Phone"
              onChangeText={(text) => handleInput('phone', text)}
              value={registerInput.phone}
            />

            <TouchableOpacity onPress={signup} className="py-3 bg-red-400">
              <Text className="font-xl font-bold text-center text-gray-700">Sign Up</Text>
            </TouchableOpacity>
  
          </View>
          <Text className="text-xl text-gray-700 font-bold text-center py-5">Or</Text>
          <View className="flex-row justify-center space-x-12">
            <TouchableOpacity className="p-2 bg-gray-100">
              <Image source={require('../../assets/images/google.png')} className="w-10 h-10" />
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center mt-7">
            <Text className="text-gray-500 font-semibold">Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="font-semibold text-red-500"> Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const SecondRoute = () => {
  const [registerInput, setRegister] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    description: '',
    role_as: 'manager',
    error_list: {},
  });

  const navigation = useNavigation();

  const handleInput = (name, value) => {
    setRegister((prevInput) => ({ ...prevInput, [name]: value }));
  };

  const signupmanager = async () => {
    try {
      // Check if any required field is empty
      if (!registerInput.name || !registerInput.email || !registerInput.password || !registerInput.phone || !registerInput.description) {
        Toast.show({
          text1: 'Please fill in all required fields!',
          type: 'error',
          position: 'top',
          duration: 3000,
        });
        return;
      }

      const data = {
        name: registerInput.name,
        email: registerInput.email,
        password: registerInput.password,
        phone: registerInput.phone,
        role_as: 'manager', // Change role_as to 'manager' for manager registration
      };

      const registerResponse = await axios.post(`${url.baseURL}/register`, data);
      Toast.show({
        text1: 'Registration successful!',
        text2: 'Your account is not yet active. Please wait for admin approval.',
        type: 'success',
        position: 'top',
        duration: 3000,
      });
      setRegister({
        name: '',
        email: '',
        password: '',
        phone: '',
        role_as: '',
      });
  
      navigation.navigate('Login');
      if (registerResponse.data.status === 200) {
        Toast.show({
          text1: 'Registration successful!',
          type: 'success',
          position: 'top',
          duration: 3000,
        });
      } else if (registerResponse.data.status === 422) {
        Toast.show({
          text1: 'Registration failed!',
          text2: registerResponse.data.errors[0].name,
          type: 'error',
          position: 'top',
          duration: 3000,
        });

        // Validation error
        setRegister({
          ...registerInput,
          error_list: registerResponse.data.errors,
        });
      }
    } catch (error) {
      console.error('Registration failed:', error.response);
      Toast.show({
        text1: error.response.data.errors.name || error.response.data.errors.email || error.response.data.errors.password || error.response.data.errors.phone,
        type: 'error',
        position: 'top',
        duration: 3000,
      });
    }
  };

  return (
    
    <View className="flex-1 bg-white bg-red-500">
      <SafeAreaView className="flex">
        <View className="flex-row justify-start">

        </View>
        <View className="flex-row justify-center">
          <Image source={require('../../assets/images/loginres.png')}  style={{ width: 400, height: 200 }} />
        </View>
      </SafeAreaView>
      <ScrollView>
        <View className="flex-1 bg-white px-8 pt-8">
          <View className="form space-y-2">
            <Text className="text-gray-700 ml-4">Full Name*</Text>
            <TextInput
              className="p-4 bg-gray-100 text-gray-700 mb-3"
              onChangeText={(text) => handleInput('name', text)}
              value={registerInput.name}
              placeholder="Enter Name"
            />

            <Text className="text-gray-700 ml-4">Email Address*</Text>
            <TextInput
              className="p-4 bg-gray-100 text-gray-700 mb-3"
              onChangeText={(text) => handleInput('email', text)}
              value={registerInput.email}
              placeholder="Enter Email"
            />

<Text className="text-gray-700 ml-4">Password*(Password must be at least 8 characters)</Text>
            <TextInput
              className="p-4 bg-gray-100 text-gray-700 mb-7"
              secureTextEntry
              onChangeText={(text) => handleInput('password', text)}
              value={registerInput.password}
              placeholder="Enter Password"
            />
               <Text className="text-gray-700 ml-4">Phone*(must be at least 8 numbers)</Text>
            <TextInput
              className="p-4 bg-gray-100 text-gray-700 mb-7"
              onChangeText={(text) => handleInput('phone', text)}
              value={registerInput.phone}
              placeholder="Enter your Phone"
            />

            <Text className="text-gray-700 ml-4">Description*</Text>
            <TextInput
              className="p-4 bg-gray-100 text-gray-700 mb-7"
              onChangeText={(text) => handleInput('description', text)}
              value={registerInput.description}
              placeholder="Enter Description about your business"
            />

            <TouchableOpacity onPress={signupmanager} className="py-3 bg-red-400">
              <Text className="font-xl font-bold text-center text-gray-700">Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-7">
            <Text className="text-gray-500 font-semibold">Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="font-semibold text-red-500"> Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default function Register() {
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();

  const _handleIndexChange = (newIndex) => setIndex(newIndex);

  const _renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'white' }}
    className=" bg-red-500"
    />
  );
  

  return (
    <View className="flex-1 bg-white">
    <StatusBar style="dark" backgroundColor='white' />
    <TabView 
        renderTabBar={renderTabBar}
      navigationState={{ index, routes: [{ key: 'first', title: 'User' }, { key: 'second', title: 'Manager' }] }}
      renderScene={({ route }) => {
        switch (route.key) {
          case 'first':
            return <FirstRoute />;
          case 'second':
            return <SecondRoute />;
          default:
            return null;
        }
      }}
      onIndexChange={_handleIndexChange} className="mt-20"
    />

    </View>

  );
}
