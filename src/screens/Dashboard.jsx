import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView  } from 'react-native';
import { GestureHandlerRootView} from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Card } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../authReducer'; 
const Dashboard = () => {
  const navigation = useNavigation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate('Account');
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate('Login'); 
    }
  }, [isAuthenticated, navigation]);

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <GestureHandlerRootView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
          className="space-y-6 pt-14"
        >
          {/* Your existing code */}
          <View className="mt-4">
            <View className="flex flex-row justify-between items-center mb-10">
              <Text className="mx-4 font-bold text-lg">Dashboard</Text>
              <TouchableOpacity onPress={handleLogout}>
                <Text className="mx-4 font-bold text-lg">Logout</Text>
              </TouchableOpacity>
            </View>

            <Card>
              <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
                <Text>My Order</Text>
              </TouchableOpacity>
            </Card>

            <Card>
              <TouchableOpacity onPress={() => navigation.navigate('MyAddress')}>
                <Text>My Addresses</Text>
              </TouchableOpacity>
            </Card>

            <Card>
              <TouchableOpacity onPress={() => navigation.navigate('Wishlist')}>
                <Text>My Favorite</Text>
              </TouchableOpacity>
            </Card>

            <Card>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Text>My Profile</Text>
              </TouchableOpacity>
            </Card>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({});
