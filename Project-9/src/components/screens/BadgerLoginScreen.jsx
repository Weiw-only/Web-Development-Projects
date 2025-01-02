import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, {useState} from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";


function BadgerLoginScreen(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const onLoginPress = () => {
        if (!username || !password) {
            Alert.alert("Error", "Incorrect login, please try again.");
            return;
        }
        props.handleLogin(username, password);
    };

    const onGuestLogin = () => {
        props.setIsLoggedIn(true);
        props.setIsGuest(true)
      };

    // lecture demo
    return <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
            <Text style={styles.title}>BadgerChat Login</Text>
            {/* <Text>Hmmm... I should add inputs here!</Text> */}
            {/* <Button color="crimson" title="Login" onPress={() => {
                Alert.alert("Hmmm...", "I should check the user's credentials!");
                props.handleLogin("myusername", "mypassword")
            }} /> */}
            <Text>Username</Text>
            <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                />
            <Text>Password</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                secureTextEntry={true}
                />
            <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
                <Text style={styles.login}>Login</Text>
            </TouchableOpacity>
            <Text>New Here?</Text>
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity style={styles.signupButton} onPress={() => props.setIsRegistering(true)}>
                    <Text style={styles.signup}>Signup</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.signupButton} onPress={onGuestLogin}>
                    <Text style={styles.signup}>Continue as guest</Text>
                </TouchableOpacity>
            </View>
        </View>
    </GestureHandlerRootView>;
}

//used online external tool
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title:{
        fontSize: 36,
        marginBottom: 20,
    },
    input: {
        fontSize: 25,
        width: '80%',
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderColor: 'gray',
    },
    loginButton:{
        backgroundColor: '#8B0000',
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 2,
        margin: 15, // Add some margin between the buttons
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3,
    },
    login:{
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase', // Make the text uppercase
    },
    signupButton:{
        backgroundColor: "grey",
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 2,
        margin: 15, // Add some margin between the buttons
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3,
    },
    signup:{
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase', // Make the text uppercase
    }
});

export default BadgerLoginScreen;

