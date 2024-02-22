import { SafeAreaView, StyleSheet, Text, View , Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
const Account = () => {
    const navigation = useNavigation();

  return (
<SafeAreaView className="flex-1 bg-red-500">

    <View className="flex-1 flex justify-around my-4">
<Text className="text-white font-bold text-4xl text-center">
Let's Get Started!
</Text>

<View className="flex-row justify-center">
<Image source={require('../../assets/images/loginres.png')} 
style={{ width: 350 , height: 350}} />
</View>

<View className="space-y-4">
<TouchableOpacity onPress={()=>navigation.navigate('Register')}
className="py-3 bg-white mx-7">
<Text className="text-xl font-bold text-center text-gray-700">
    Sign Up
</Text>
</TouchableOpacity>
          <View className="flex-row justify-center">
                    <Text className="text-white font-semibold">Already have an account?</Text>
                    <TouchableOpacity onPress={()=> navigation.navigate('Login')}>
                        <Text className="font-semibold text-white"> Log In</Text>
                    </TouchableOpacity>
                </View>
</View>
    </View>
</SafeAreaView>
  )
}

export default Account

const styles = StyleSheet.create({})