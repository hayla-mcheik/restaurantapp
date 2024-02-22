import React, { useState, useEffect } from 'react';
import {  StyleSheet, Text, View,Pressable, Image , ScrollView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from "axios";
import url from "./url.jsx";
import Toast from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const CategoriesFilter = () => {
  const [categories, setCategories] = useState([]);
  const [restaurantList, setRestaurantList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getCategories = async () => {
      const response = await axios.get(`${url.baseURL}/categories`);
      setCategories(response.data.restaurantcategories);
  getCategoriesRestaurant();
  };
  
  const getCategoriesRestaurant = async (categoryId = null) => {
    try {
      const response = await axios.get(`${url.baseURL}/listing/${categoryId || ''}`);
      setRestaurantList(response.data.restaurants);
    } catch (error) {
      Toast.show({
        text1: 'Error fetching restaurants:',
        type: 'error',
        position: 'top',
        duration: 3000,
      });
    }
  };
  

  useEffect(() => {
    getCategories();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    getCategoriesRestaurant(category.id);
  };

  const handleShowAllRestaurants = () => {
    setSelectedCategory(null); 
    getCategoriesRestaurant(); 
  };

  const processedImages = restaurantList.map(item => `${url.mediaURL}/${item.image}`);
  const navigation = useNavigation();

  const handleImagePress = (item) => {
    navigation.navigate('RestaurantDetails', {
      restaurantId: item.id,
      restaurantData: restaurantList,
    });
  };
  
  
  return (
    <View>
      <GestureHandlerRootView>
        {/* Category FlatList for horizontal scrolling */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <Pressable
            key="all"
            onPress={handleShowAllRestaurants}
            style={{
              backgroundColor: !selectedCategory ? 'red' : 'whitesmoke',
              color: 'black',
              marginRight: 36,
              borderRadius: 2,
              paddingHorizontal: 16,
              paddingVertical: 18,
              marginVertical: 16,
            }}
          >
            <Text className="capitalize font-bold" style={{ color: !selectedCategory && 'black' }}>
              All restaurants
            </Text>
          </Pressable>
          {categories.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => handleCategoryClick(category)}
              style={{
                backgroundColor: selectedCategory && selectedCategory.id === category.id ? 'red' : 'whitesmoke',
                color: 'black',
                marginRight: 36,
                borderRadius: 2,
                paddingHorizontal: 16,
                paddingVertical: 18,
                marginVertical: 16,
              }}
            >
              <Text className="capitalize font-bold" style={{ color: selectedCategory && selectedCategory.id === category.id && 'black' }}>
                {category.name} restaurant
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </GestureHandlerRootView>

      {/* Restaurant ScrollView for vertical scrolling */}
      <ScrollView
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {restaurantList.map(item => (
          <Pressable
            className="bg-black/5 p-[5px]"
            onPress={() => handleImagePress(item)}
            style={{
              shadowOpacity: 0.1,
              marginVertical: 16,
              alignItems: "center",
              width: '48%', 
            }}
            key={item.id}
          >
            <View className="bg-white p-[10px] ">
              <View className="flex flex-row justify-end mb-2 ">
                <MaterialCommunityIcons className="mb-2" name="heart" color="red" background="transparent" size={20} />
              </View>
              <Image
                source={{ uri: `${url.mediaURL}/${item.image}` }}
                style={{ width: 150, height: 150, resizeMode: "center" }}
              />
              <Text className="font-bold text-neutral-700 capitalize" style={{ fontSize: hp(1.6) }}>{item.name} Restaurant</Text>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text className="capitalize" style={{ fontSize: hp(1.3) }}>{item.address}</Text>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoriesFilter;

const styles = StyleSheet.create({});
