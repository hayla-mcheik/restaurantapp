import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import HomeScreen from '../screens/HomeScreen';
import WishlistScreen from '../screens/WishlistScreen';
import CartScreen from '../screens/CartScreen';
import Account from '../screens/Account';
import Dashboard from '../screens/Dashboard';
import Login from '../screens/Login';
import Register from '../screens/Register';
import RestaurantScreen from '../screens/RestaurantScreen';
import RestaurantDetails from '../components/RestaurantDetails';
import WelcomeScreen from '../screens/WelcomeScreen';
import OrderScreen from '../screens/OrderScreen';
import Orders from '../screens/Orders';
import OrderDetails from '../screens/OrderDetails';
import MyAddress from '../screens/MyAddress';
import AddAddresses from '../screens/AddAddresses';
import Thankyou from '../screens/Thankyou';
import Profile from '../screens/Profile';
import ForgetPassword from '../screens/ForgetPassword';
import PasswordUpdate from '../screens/PasswordUpdate';
import { useSelector } from 'react-redux';
import OrdersScreenWebView from '../screens/OrdersScreenWebView';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const HomeStack = () => (
  <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false , tabBarShowLabel: false}}>
  <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
    <Stack.Screen name="RestaurantDetails" component={RestaurantDetails} />
    <Stack.Screen name="OrderScreen" component={OrderScreen} />
    <Stack.Screen name="PasswordUpdate" component={PasswordUpdate} />
    <Stack.Screen name="Orders" component={Orders} />
    <Stack.Screen name="OrdersScreenWebView" component={OrdersScreenWebView} />
    <Stack.Screen name="OrderDetails" component={OrderDetails} />
    <Stack.Screen name="MyAddress" component={MyAddress} />
    <Stack.Screen name="AddAddresses" component={AddAddresses} />
    <Stack.Screen name="Thankyou" component={Thankyou} />
    <Stack.Screen name="Cart" component={CartScreen} />
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
    <Stack.Screen name="Dashboard" component={Dashboard} />
    <Stack.Screen name="Account" component={Account} />
    <Stack.Screen name="Wishlist" component={WishlistScreen} />
  </Stack.Navigator>
);


const AppNavigation = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <NavigationContainer >
  <Tab.Navigator
    initialRouteName="HomeStack"
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarLabel: '',
      tabBarVisible: route.name !== 'Welcome',
      tabBarStyle: styles.tabBarStyle,
      tabBarIcon: ({ color, size}) => {
        let iconName;
        if (route.name === 'HomeStack') {
          iconName = 'home';
        } else if (route.name === 'Restaurant') {
          iconName = 'food'; 
        } 
        else if (route.name === 'Wishlist') {
          iconName = 'heart'; 
        } else if (route.name === 'Account') {
          iconName = 'account';
        } else if (route.name === 'Dashboard') {
          iconName = 'account'; 
        }
        else if (route.name === 'Orders') {
          iconName = 'clipboard-list'; 
        }
        return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
      },
    })}
  >
    <Tab.Screen name="HomeStack" component={HomeStack} />
    <Tab.Screen name="Restaurant" component={RestaurantScreen} />
    {!isAuthenticated && <Tab.Screen name="Account" component={Account} />}
    {isAuthenticated && <Tab.Screen name="Dashboard" component={Dashboard} />}
  </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 80,
    borderWidth: 0,
    elevation: 0,
    borderTopColor: '#80808080',
  },
});

export default AppNavigation;