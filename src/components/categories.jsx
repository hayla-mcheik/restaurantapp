import { StyleSheet, Text, View, TouchableOpacity, Image , ScrollView } from 'react-native';
import React , {useState , useEffect} from 'react'
import axios from "axios";
import url from "./url.jsx";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const categories = () => {
    const [categories, setCategories] = useState([]);
    async function getcategories()
    {
        const response= await axios.get(`${url.baseURL}/categories`);
        setCategories(response.data.restaurantcategories);
    }
  
  useEffect(() => {
    getcategories();
  }, [])

  return (
<View>
<GestureHandlerRootView>
    <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    className="space-x-4"
    contentContainerStyle={{paddingHorizontal: 15}}
    >
{categories.map((cat,index)=>{
    return (
        <TouchableOpacity
        key={index} 
        className="flex items-center space-y-1"
        >
            <View className="rounded=full p-[6px]">
                <Image 
                src={`${url.mediaURL}/${cat.image}`}
                style={{width: hp(6) , height: hp(6)}} 
                className="rounded-full"
                />
            </View>

        </TouchableOpacity>
    )
})}
    </ScrollView>
    </GestureHandlerRootView>
</View>
  )
}

export default categories

const styles = StyleSheet.create({})