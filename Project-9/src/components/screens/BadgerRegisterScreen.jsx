import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, {useState} from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function BadgerRegisterScreen(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const isValid = () =>{
        return username.length > 0 && password.length > 0 && repeatPassword.length > 0  && password == repeatPassword;
    }
    const onSignupPress = () => {
        if(!isValid()){
            if (!password || !repeatPassword) {
                Alert.alert("Error", "Please enter a password.");
                return;
            }
            if (!username) {
                Alert.alert("Error", "Please enter a username.");
                return;
            }
            if (password !== repeatPassword) {
                Alert.alert("Error", "Passwords do not match.");
                return;
            }
        }
        props.handleSignup(username, password);
    };

    // lecture demo
    return <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
            <Text style={styles.title}>Join BadgerChat!</Text>
            {/* <Text>Hmmm... I should add inputs here!</Text>
            <Button color="crimson" title="Signup" onPress={() => Alert.alert("Hmmm...", "This should do something!")} /> */}
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
                secureTextEntry={true}
                autoCapitalize="none"
            />
            <Text>Confirm Password</Text>
            <TextInput
                style={styles.input}
                value={repeatPassword}
                onChangeText={setRepeatPassword}
                secureTextEntry={true}
                autoCapitalize="none"
            />
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity style={[styles.signupButton, !isValid() && styles.buttonDisabled]} onPress={onSignupPress}>
                    <Text style={styles.signup}>Signup</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => props.setIsRegistering(false)}>
                    <Text style={styles.cancel}>Nevermind!</Text>
                </TouchableOpacity>
            </View>
        </View>
    </GestureHandlerRootView>;
}

// referenced from online external tool
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
    input:{
        fontSize: 25,
        width: '80%',
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderColor: 'gray',
    },
    signupButton:{
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
    signup:{
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase', // Make the text uppercase
    },
    cancelButton:{
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
    cancel:{
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase', // Make the text uppercase
    },
    buttonDisabled: {
        backgroundColor: '#cccccc', // Greyed out color
    },
});

export default BadgerRegisterScreen;

