import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions , ScrollView } from 'react-native';
import axios from 'axios';
import url from './url.jsx';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
var { width, height } = Dimensions.get('window');

const MostPopular = () => {
  const navigation = useNavigation();
  const [mostpopular, setMostPopular] = useState([]);

  async function getMostPopular() {
    const response = await axios.get(`${url.baseURL}/restaurant`);
    setMostPopular(response.data.restaurants);
  }

  useEffect(() => {
    getMostPopular();
  }, []);

  const handleImagePress = (index) => {
    const selectedRestaurant = mostpopular[index];
    navigation.navigate('RestaurantDetails', {
      restaurantId: selectedRestaurant.id,
      restaurantData: mostpopular,
    });
  };

  return (
    <View className="mb-8 space-y-4">
      <View className="mx-4 flex-row justify-between items-center">
        <Text className="font-semibold text-neutral-600 text-xl">Most Popular</Text>
        <TouchableOpacity onPress={()=>navigation.navigate('Restaurant')}>
          <Text className="text-l" style={{ color: 'red' }}>
            See All
          </Text>
        </TouchableOpacity>
      </View>

      <GestureHandlerRootView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {mostpopular.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleImagePress(index)}
              style={{ margin: 10 }} // Adjust spacing between items
            >
              <View className=" bg-black/5 p-[5px] ">
       
                <View className="bg-white p-[8px]">
                <View className="flex flex-row justify-end mb-2 ">
              </View>
                <View className="flex flex-row justify-end mt-4">

              </View>
                <Image
                  className="flex-row items-center p-[6px]"
                  source={{ uri: `${url.mediaURL}/${item.image}` }}
                  style={{ width: width * 0.39, height: height * 0.12 }} // Adjust item size
                />
                <Text className="ml-1 text-neutral-600 pt-4 font-bold capitalize" style={{ fontSize: hp(1.6) }}>
                  {item.name.length > 14 ? item.name.slice(0, 14) + '...' : item.name} Restaurant
                </Text>
                <Text className="ml-1 text-neutral-600 pt-2 font-semibold capitalize">{item.address}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </GestureHandlerRootView>
    </View>
  );
};

export default MostPopular;
