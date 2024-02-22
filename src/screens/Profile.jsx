import { StyleSheet, Text, TouchableOpacity, View, ScrollView  } from 'react-native'
import React,{useState, useEffect} from 'react'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView,TextInput } from 'react-native-gesture-handler'
import  Header  from '../components/header';
import axios from 'axios';
import url from '../components/url';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import { useSelector } from 'react-redux';

const Profile = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [user, setUser] = useState({});
const navigation = useNavigation();
  const getProfile = async () => {
      const token = await AsyncStorage.getItem('auth_token');
      if (!isAuthenticated) {
        Toast.show({
          text1: 'Please Login To Show Profile',
          type: 'error',
          position: 'top',
          duration: 3000,
        });
        return;
      }
  
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      };
  
      const response = await axios.get(`${url.baseURL}/profile`, { headers });
      setUser(response.data.user); // Update the state with user information
  };

  useEffect(() => {
    getProfile();
  }, []);


  return (
    <View className="flex-1 bg-white">
        <StatusBar style="dark" backgroundColor='white' />
        <GestureHandlerRootView>
        <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}
        className="space-y-6 pt-14">
<Header />


<View>

<TouchableOpacity
onPress={()=>navigation.navigate('Dashboard')}
className="absolute left-4 bg-gray-100 p-2 rounded-full shadow ">
<ArrowLeftIcon  strokeWidth={3} color="black" />
</TouchableOpacity>
  <Text className="mx-4 text-neural-700 font-bold text-lg mb-4 mt-10">My Profile</Text>


<TextInput
  onChangeText={(text) => handleInput('email', text)}
  value={user.email}
  style={styles.input}
  placeholder="Email"
/>
<TextInput
  onChangeText={(text) => handleInput('phone', text)}
  value={user.phone}
  style={styles.input}
  placeholder="Phone"
/>
{user.role_as === 2 && (
<TextInput
  onChangeText={(text) => handleInput('description', text)}
  value={user.description}
  style={styles.input}
  placeholder="description"
/>
     )}


</View>


</ScrollView>
</GestureHandlerRootView>
</View>
  )
}

export default Profile

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor:'#dee2e6',
    padding: 10,
  },
})