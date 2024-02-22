import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import * as Icon from "react-native-feather";
const CartIcon = () => {
  const navigation = useNavigation();
  return (
    <View className="absolute bottom-5 w-full z-50">
 <TouchableOpacity 
 onPress={()=> navigation.navigate('Cart')}
 className="bg-red-500 flex-row justify-between items-center mx-5 rounded-full p-4 py-3 shadow-lg">
<View className="p-2 px-4 rounded-full bg-gray-500">
<Text className="font-extrabold text-white text-lg">
30
</Text>
</View>

<Text className="flex-1 text-center font-extrabold text-white text-lg">
View Cart
</Text>
<Text className="font-extrabold text-white text-lg">
$40
</Text>
 </TouchableOpacity>
    </View>
  )
}

export default CartIcon

const styles = StyleSheet.create({})