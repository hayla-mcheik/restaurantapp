import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import url from './url.jsx';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Icon from "react-native-feather";
const BestSeller = ({ item }) => {

  if (!item || !item.item || !item.item.image || !item.item.name || !item.item.price) {
    return null;
  }


  return (
    <View>

        <View
          className="flex-row items-center bg-white p-3 rounded-3xl shadow-2xl mb-3 mx-2">
<Image src={`${url.mediaURL}/${item.image}`}
className="rounded-3xl" style={{ height:100 , width: 100 }}
/>
<View className="flex flex-1 space-y-3">
    <View className="pl-3">
<Text className="text-xl">Burger</Text>
<Text className="text-gray-500">burger with no offer </Text>
</View>

<View className="flex-row justify-between pl-3 items-center">
    <Text className="text-gray-700 text-lg font-bold">
        $350
    </Text>
<View className="flex-row items-center">
    <TouchableOpacity 
    className="p-1 rounded-full bg-red-500">
        <Icon.Minus strokeWidth={2} height={20} width={20} stroke={'white'} />
    </TouchableOpacity>
    <Text className="px-3">2</Text>
    <TouchableOpacity 
    className="p-1 rounded-full bg-red-500">
        <Icon.Plus strokeWidth={2} height={20} width={20} stroke={'white'} />
    </TouchableOpacity>
    </View>

    </View>

        </View>
        </View>
    </View>
  );
};

export default BestSeller;

const styles = StyleSheet.create({});
