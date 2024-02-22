import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity , ScrollView  } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView} from 'react-native-gesture-handler';
import Header from '../components/header';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import url from '../components/url';
import Toast from 'react-native-toast-message';

const ForgetPassword = () => {
  const navigation = useNavigation();
  const [code, setCode] = useState('');
  const [servercode, setServerCode] = useState('');
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const sendResetLink = async () => {
      if (!email) {
        Toast.show({
          text1: 'Please fill the email field!',
          type: 'error',
          position: 'top',
          duration: 3000,
        });
        return;
      }

      const data = {
        email: email,
      };
      const response = await axios.post(`${url.baseURL}/forgot-password`, data);

      if ('code' in response.data) {
        setCodeSent(true);
        setServerCode(response.data.code);
        Toast.show({
          text1: 'Password code sent successfully!',
          type: 'success',
          position: 'top',
          duration: 3000,
        });
      } else if ('message' in response.data) {
        Toast.show({
          text1: response.data.message,
          type: 'info',
          position: 'top',
          duration: 3000,
        });
      } else {
        Toast.show({
          text1: 'Unexpected response. Please try again.',
          type: 'error',
          position: 'top',
          duration: 3000,
        });
      }

  };
  
  const checkCodeAndNavigate = async () => {
  
      if (!email || (!codeSent && !code)) {
        Toast.show({
          text1: 'Email and code are required!',
          type: 'error',
          position: 'top',
          duration: 3000,
        });
        return;
      }
  
      const data = {
        email: email,
        code: code,
      };
  
      const response = await axios.post(`${url.baseURL}/check-password-code`, data);
      if (response.data.message === 'Code is correct') {
        navigation.navigate('PasswordUpdate', { email: email });
      } else {
        Toast.show({
          text1: response.data.message,
          type: 'error',
          position: 'top',
          duration: 3000,
        });
      }

  };
  

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" backgroundColor="white" />
      <GestureHandlerRootView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
          className="space-y-6 pt-14">
          <Header />

          <View className="form space-y-2">
            <Text className="text-gray-700 ml-4">
              {codeSent ? 'Enter Code*' : 'Email Address*'}
            </Text>

            {codeSent ? (
              <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                value={code}
                onChangeText={(text) => setCode(text)}
                placeholder="Enter Code"
              />
            ) : (
<TextInput
  className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
  value={email}
  onChangeText={(text) => setEmail(text)}
  placeholder="Enter Email"
/>

            )}

            {codeSent ? (
              <TouchableOpacity
                className="py-3 bg-red-400"
                onPress={checkCodeAndNavigate}
                >
                <Text className="font-xl font-bold text-center text-gray-700">
                  Change Password
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="py-3 bg-red-400"
                onPress={sendResetLink}>
                <Text className="font-xl font-bold text-center text-gray-700">
                  Send Reset Link
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </View>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({});
