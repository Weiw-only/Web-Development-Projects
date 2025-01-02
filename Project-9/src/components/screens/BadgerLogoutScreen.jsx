import { Alert, Button, StyleSheet, Text, View, TouchableOpacity} from "react-native";


function BadgerLogoutScreen(props) {

    return <View style={styles.container}>
        <Text style={{fontSize: 24, marginTop: -100}}>Are you sure you're done?</Text>
        <Text>Come back soon!</Text>
        <Text/>
        {/* <Button title="Logout" color="darkred" onPress={() => Alert.alert("Hmmm...", "This should do something!")}/> */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => props.handleLogout()}>
            <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>

    </View>
}

// similar to log in page
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        width: "50%",
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    logoutButton:{
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
    logout:{
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase', // Make the text uppercase
    }
});

export default BadgerLogoutScreen;

