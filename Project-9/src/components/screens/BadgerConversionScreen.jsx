import { Alert, Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";

function BadgerConversionScreen(props) {

    return <View style={styles.container}>
        <Text style={{fontSize: 24, marginTop: -100}}>Ready to signup?</Text>
        <Text>Join BadgerChat to be able to make posts!</Text>
        <Text/>
        {/* <Button title="Signup!" color="darkred" onPress={() => Alert.alert("Hmmm...", "This should do something!")}/> */}
        <TouchableOpacity style={styles.beGuestButton} onPress={() => props.handleGuestSignup()}>
            <Text style={styles.beGuest}>Signup!</Text>
        </TouchableOpacity>

    </View>
}

// similar to log out page
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    beGuestButton:{
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
    beGuest:{
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase', // Make the text uppercase
    }
});

export default BadgerConversionScreen;