import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import axios from 'axios';
import url from './url.jsx';
import { SliderBox } from 'react-native-image-slider-box';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
const Restaurant = () => {

  const [restaurants, setRestaurants] = useState([]);
  const processedImages = restaurants.map(item => `${url.mediaURL}/${item.image}`);
  const navigation = useNavigation();

  async function getRestaurants() {
      const response= await axios.get(`${url.baseURL}/restaurant`);
      setRestaurants(response.data.restaurants); 
  }

  useEffect(() => {
    getRestaurants();
  }, []);

  const handleImagePress = (index) => {
    const selectedRestaurant = restaurants[index];
    navigation.navigate('RestaurantDetails', {
      restaurantId: selectedRestaurant.id,
      restaurantData: restaurants,
    });
    
  };
  


  return (
    <View className="mx-4 space-y-3">
      <Text style={{ fontSize: hp(3) }} className="font-semibold text-neutral-600">
        Restaurant
      </Text>
      <View className="flex-1 items-center">
        <SliderBox
        
          images={processedImages}
          sliderBoxHeight={200}
          ImageComponentStyle={{ width: '95%', marginTop: 15 }}
          onCurrentImagePressed={(index) => handleImagePress(index)}
          dotColor="#ff3008"
          inactiveDotColor="#90A4AE"
          dotStyle={{
            width: 15,
            height: 15,
            marginHorizontal: 10,
            padding: 0,
            margin: 0,
          }}
        />
      </View>
    </View>
  );
};

export default Restaurant;

const styles = StyleSheet.create({});
