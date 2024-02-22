
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView ,  Button , Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import axios from 'axios';
import url from '../components/url';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Categories from '../components/categories';
import  Header  from '../components/header';
import { useNavigation } from '@react-navigation/native';
import { CardField } from '@stripe/stripe-react-native';
import { useDispatch, useSelector } from "react-redux";
import { clearCart , setInitialCartCount} from "../../CartReducer";
import {useConfirmPayment } from "@stripe/stripe-react-native";
import { selectAddresses , setAddresses } from '../../addressReducer';

const OrderScreen = () => {
  const [cardDetails, setCardDetails] = useState();
  const { confirmPayment, loading } = useConfirmPayment();
  const cart = useSelector((state) => state.cart.cart);
  const reduxAddressesList = useSelector(selectAddresses);
  const dispatch = useDispatch();
const navigation = useNavigation();
const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Cash on Delivery');
const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

const [selectedaddress , setSelectedAddress] = useState(null);

const handleAddressClick = (address) => {
  setSelectedAddress(address);
};


const getaddress = async () => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) {
      Toast.show({
        text1: 'Please Login To show Addresses',
        type: 'error',
        position: 'top',
        duration: 3000,
      });
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    };
    const response = await axios.get(`${url.baseURL}/showaddresses`,{ headers });
    dispatch(setAddresses(response.data.addresses));
  } catch (error) {
    console.error('Error fetching addresses:', error);
  }
};

useEffect(() => {
  getaddress();
}, []);


const deleteCart = async () => {
  const token = await AsyncStorage.getItem('auth_token');
  if (!token) {
    Toast.show({
      text1: 'Please Login To delete cart',
      type: 'error',
      position: 'top',
      duration: 3000,
    });
    return;
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };

  // Use axios.delete for DELETE request
  const response = await axios.get(`${url.baseURL}/deletecartitems`, { headers });

  if (response.status === 200) {
    Toast.show({
      text1: 'Cart deleted successfully',
      type: 'success',
      position: 'top',
      duration: 3000,
    });
  } else {

    Toast.show({
      text1: 'Error deleting cart',
      type: 'error',
      position: 'top',
      duration: 3000,
    });
  }
};

async function getCartCount() {
  const token = await AsyncStorage.getItem('auth_token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token,
  };

  if (isAuthenticated) {
    const response = await axios.get(`${url.baseURL}/cartcount`, { headers });
    dispatch(setInitialCartCount(response.data.cartCount));
  }
}



const payondelivery = async () => {
  if (!selectedaddress) {
    Toast.show({
      text1: 'Please select an address before placing an order',
      type: 'error',
      position: 'top',
      duration: 3000,
    });
    return;
  }

  try {
    const token = await AsyncStorage.getItem('auth_token');
    if (!isAuthenticated) {
      Toast.show({
        text1: 'Please Login To Place Order',
        type: 'error',
        position: 'top',
        duration: 3000,
      });
      return;
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    };

    const address = selectedaddress; 


      paymentMode = 'Cash on Delivery';
    const requestData = {
      payment_mode: paymentMode,
      address: address,
    };

    const response = await axios.post(`${url.baseURL}/order/create`, requestData, { headers });
    await deleteCart();
    dispatch(clearCart());

    await getCartCount();
    if (response.status === 200) {     
      Toast.show({
        text1: 'Order created successfully.',
        type: 'success',
        position: 'top',
        duration: 3000,
      });
    
        navigation.navigate('Thankyou');
    } else if (response.status === 400) {
      Toast.show({
        text1: 'Cart is empty. Add items to your cart before placing an order',
        type: 'info',
        position: 'top',
        duration: 3000,
      });
    } else if (response.status === 401) {
      Toast.show({
        text1: 'Unauthorized to create order',
        type: 'error',
        position: 'top',
        duration: 3000,
      });
    }
  } catch (error) {
    console.error('Error in order:', error);

    Toast.show({
      text1: 'Error placing order. Please try again.',
      type: 'error',
      position: 'top',
      duration: 3000,
    });
  }
};

const fetchPaymentIntentClientSecret = async () => {
  if (!selectedaddress) {
    Toast.show({
      text1: 'Please select an address before placing an order',
      type: 'error',
      position: 'top',
      duration: 3000,
    });
    return;
  }
  const token = await AsyncStorage.getItem('auth_token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token,
  };
  const address = selectedaddress;
  const requestData = {
    payment_mode: 'stripe',
    address: address,
  };

  try {
    const response = await axios.post(`${url.baseURL}/order/create`, requestData, { headers });
    const { clientSecret, error } = response.data;
    await deleteCart();
    dispatch(clearCart());

    await getCartCount();
    if (response.status === 200) {
      Toast.show({
        text1: 'Order created successfully.',
        type: 'success',
        position: 'top',
        duration: 3000,
      });
      navigation.navigate('Thankyou');
 
      
    } else if (response.status === 400) {
      Toast.show({
        text1: 'Cart is empty. Add items to your cart before placing an order',
        type: 'info',
        position: 'top',
        duration: 3000,
      });
    } else if (response.status === 401) {
      Toast.show({
        text1: 'Unauthorized to create order',
        type: 'error',
        position: 'top',
        duration: 3000,
      });
    }

    return { clientSecret, error };

  } catch (error) {
    console.error("Error fetching payment intent:", error);
    return { error: "Unable to fetch payment intent" };
  }
};

const handlePayPress = async () => {
  //1.Gather the customer's billing information (e.g., email)
  if (!cardDetails?.complete) {
    Alert.alert("Please enter Complete card details and Email");
    return;
  }

  try {
    const { clientSecret, error } = await fetchPaymentIntentClientSecret();
    if (error) {
      console.log("Unable to process payment");
    } else {
      // Confirm the payment with the card details
      const {paymentIntent, error} = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });
      if (error) {
        alert(`Payment Confirmation Error ${error.message}`);
      } else if (paymentIntent) {
        alert("Payment Successful");
        console.log("Payment successful ", paymentIntent);
      }
    }
  } catch (e) {
    console.log(e);
  }
};


  return (
    <View className="flex-1 bg-white">
        <StatusBar style="dark" backgroundColor='white' />
        <GestureHandlerRootView>
        <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}
        className="space-y-6 pt-14">
<Header />
          {/* Header */}
          <Text className="mx-4 font-bold text-xl">Order Screen</Text>

          <View>
<Categories />
</View>
<View className="flex flex-row justify-between items-center ">
  <Text className="mx-4 font-bold text-lg mt-4">Addresses List</Text>
<TouchableOpacity onPress={()=>navigation.navigate('AddAddresses')}
className="bg-red-500 p-2 m-4 mt-10"
>
<Text className="text-white">Add Address</Text>
</TouchableOpacity>
</View>
<View className="flex  justify-between align-center">
  {reduxAddressesList && reduxAddressesList.length > 0 ? (
    reduxAddressesList.map((item, index) => (
      <View key={index} style={styles.col}>
        <TouchableOpacity
          onPress={() => handleAddressClick(item)}
          style={{
            borderColor: selectedaddress === item ? 'green' : 'black',
            borderWidth: selectedaddress === item ? 2 : 1,
          }}
        >
          <View style={styles.card}>
            <Text>{item.label}</Text>
            <Text>{item.address}</Text>
          </View>
        </TouchableOpacity>
      </View>
    ))
  ) : (
    <Text>No addresses available</Text>
  )}
</View>


          <View style={styles.tabPane} className="mx-4">
    <Text style={styles.tabTitle}>Cash</Text>
    <Text>Please keep exact change handy to help us serve you better</Text>
    <View style={styles.separator} />
 
    <TouchableOpacity
  className="bg-red-500 p-4 text-center items-center justify-center"
  title="Place Order"
  onPress={() => {
    setSelectedPaymentMethod('Cash on Delivery');
    payondelivery();
  }}
>
  <Text className="text-white"> Place Order</Text>
</TouchableOpacity>
  </View>
<Text className="flex flex-row justify-center items-center mx-0 text-center text-xl font-bold">Or</Text>
  <View style={styles.tabPane} className="mx-4">
  <View className="mb-5 pb-5">
  <CardField
        postalCodeEnabled={true}
        placeholder={{
          number: "4242 4242 4242 4242",
        }}
        cardStyle={styles.card}
        style={styles.cardContainer}
        onCardChange={cardDetails => {
          setCardDetails(cardDetails);
        }}
      />
      <Button onPress={handlePayPress} title="Pay" disabled={loading} />
    </View>
  </View>


<View className="mb-5 pb-5">
  <Text className ="mx-5">Go back to Restaurant</Text>
</View>

        </ScrollView>

   

      </GestureHandlerRootView>
    </View>
  );
};

// Stylesheet for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  col: {
    width: '100%',
    padding: 8,
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 50,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  buttonContainer: {
    marginVertical: 20,
  },

  paymentContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  paymentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  paymentSubtitle: {
    fontSize: 16,
    color: 'black',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
  },
  column1: {
    flex: 1,
    paddingRight: 8,
  },
  navPills: {
    flex: 1,
    flexDirection: 'column',
  },
  navLink: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  column2: {
    flex: 2,
    paddingLeft: 8,
  },
  tabContent: {
    flex: 1,
  },
  tabPane: {
    flex: 1,
    marginBottom: 16,
  },
  tabTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: 'gray',
    marginVertical: 8,
  },
  osahanCard: {
    fontWeight: 'bold',
    color: '#28a745',
  },
  card: {
    backgroundColor: "#efefefef",
  },
  cardContainer: {
    height: 50,
    marginVertical: 30,
  },

});

// Export the OrderScreen component
export default OrderScreen;
