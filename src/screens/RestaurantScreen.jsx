import { SafeAreaView,StyleSheet, Text, View , ScrollView } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import  Header  from '../components/header'
import Categories from '../components/categories';
import CategoriesFilter from '../components/categoriesFilter';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const RestaurantScreen = () => {
  return (
    <View className="flex-1 bg-white">
        <StatusBar style="dark" />
        <GestureHandlerRootView>
        <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}
        className="space-y-6 pt-14">
<Header />

<View>
<Categories />
</View>

<SafeAreaView style={{ flex: 1  , margin: 10}}>
<View>
    <Text className="mx-4 font-semibold text-lg">Filter by Categories:</Text>
<CategoriesFilter />
</View>
</SafeAreaView>
</ScrollView>
</GestureHandlerRootView>
</View>

  )
}

export default RestaurantScreen

const styles = StyleSheet.create({})