import { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Alert} from 'react-native'

import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import BadgerLogoutScreen from './screens/BadgerLogoutScreen';
import BadgerConversionScreen from './screens/BadgerConversionScreen';


const ChatDrawer = createDrawerNavigator();

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    fetch('https://cs571.org/api/s24/hw9/chatrooms', {
      method: 'GET',
      headers: {
        "X-CS571-ID": 'bid_67c09ec177d1952ae99856de7709b1ba5709d6ed2514a7385f0f91bf264fc278',
        'Content-Type': "application/json"
      }
    })
    .then(res => res.json())
    .then(data => {
      setChatrooms(data);
    })
  }, []);
  
  function handleLogin(username, password) {
    // hmm... maybe this is helpful!
    fetch('https://cs571.org/api/s24/hw9/login',{
      method:'POST',
      headers:{
        "X-CS571-ID": 'bid_67c09ec177d1952ae99856de7709b1ba5709d6ed2514a7385f0f91bf264fc278',
        'Content-Type':"application/json"
      },
      body:JSON.stringify({
        username: username,
        password: password
      })
    })
    .then(res => {
      if (res.status === 400) {
        Alert.alert("Error", "A request must contain a 'username' and 'password'")
        return;
      } else if (res.status === 401) {
        Alert.alert("Error","That username or password is incorrect!")
        return;
      }
      return res.json();
    })
    .then(data=>{
      if(data && data.token){
        Alert.alert("Success", "Successful login!");
        return SecureStore.setItemAsync("token", data.token)
        .then(() => {
          return SecureStore.setItemAsync("username", username);
        })
        .then(() =>{setIsLoggedIn(true);
        })
      }
    })
    .catch(error => {
      Alert.alert("Login Failed", error.message);
    });
  }

  function handleSignup(username, password) {
    fetch('https://cs571.org/api/s24/hw9/register',{
      method:'POST',
      headers:{
        "X-CS571-ID": 'bid_67c09ec177d1952ae99856de7709b1ba5709d6ed2514a7385f0f91bf264fc278',
        'Content-Type':"application/json",
      },
      body:JSON.stringify({
        username: username,
        password: password
      })
    })
    .then(res => {
      if (res.status === 400) {
          Alert.alert("There must contain a 'username' and 'password'");
          return;
      } else if (res.status === 409) {
          Alert.alert("The user already exists!");
          return;
      } else if (res.status === 413) {
          Alert.alert("username' must be 64 characters or fewer and 'password' must be 128 characters or fewer");
          return;
      }
      return res.json();
    })
    .then(data=>{
      if(data && data.token){
        return SecureStore.setItemAsync("token", data.token)
        .then(() => {
          return SecureStore.setItemAsync("username", username);
        })
        .then(() =>{
          if (setIsLoggedIn) {
            setIsLoggedIn(true);
            setIsGuest(false);
            Alert.alert("Success", "Successful login!");
          }
        })
      }
    })
    .catch(error => {
      Alert.alert("Signup Failed",error.message);
    });
  }

  const handleLogout = () => {
    // Navigate to the login screen after removed token
    SecureStore.deleteItemAsync("token").then(() => {
      setIsLoggedIn(false);
      setIsRegistering(false);
      setIsGuest(false);
    });
  };

  const handleGuestSignup= () =>{
    setIsLoggedIn(false);
    setIsRegistering(true);
  }

  if (isLoggedIn) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {
            chatrooms.map(chatroom => {
              return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => <BadgerChatroomScreen name={chatroom} />}
              </ChatDrawer.Screen>
            })
          }
          {isGuest ? (<ChatDrawer.Screen name="Signup">
            {(props) => <BadgerConversionScreen handleGuestSignup={handleGuestSignup} />}
          </ChatDrawer.Screen>):(<ChatDrawer.Screen name="Logout">
            {(props) => <BadgerLogoutScreen handleLogout={handleLogout} />}
          </ChatDrawer.Screen>)}
        </ChatDrawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
    );
  } else if (isRegistering) {
    return <BadgerRegisterScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering} />
  } else {
    return <BadgerLoginScreen handleLogin={handleLogin} setIsRegistering={setIsRegistering} setIsGuest={setIsGuest} setIsLoggedIn={setIsLoggedIn}/>
  }
}

