import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity , ScrollView  } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Header from '../components/header';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import url from '../components/url';
import Toast from 'react-native-toast-message';
const PasswordUpdate = () => {
  const route = useRoute();
  const { email  } = route.params;

  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
      const data = {
        email: email,
        password: password,
      };

      const response = await axios.post(`${url.baseURL}/password/change`, data);
      if (response.status === 200) {
        Toast.show({
          text1: 'Password changed successfully!',
          type: 'success',
          position: 'top',
          duration: 3000,
        });
        navigation.navigate('Login'); 
      } else {
        setError('Invalid password');
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
            <Text className="text-gray-700 ml-4">New Password*</Text>
            <TextInput
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholder="Enter Password"
              secureTextEntry={true}
            />

    
            <TouchableOpacity className="py-3 bg-red-400" onPress={handleSubmit}>
              <Text className="font-xl font-bold text-center text-gray-700">
                Update Password
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </View>
  );
};

export default PasswordUpdate;

const styles = StyleSheet.create({});
