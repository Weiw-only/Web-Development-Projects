import { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, Alert, Modal, Button, TouchableOpacity, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from "react-native";
import BadgerChatMessage from "../helper/BadgerChatMessage";
import { TextInput } from "react-native-gesture-handler";
import * as SecureStore from 'expo-secure-store';


function BadgerChatroomScreen(props) {

    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [postTitle, setPostTitle] = useState('');
    const [postBody, setPostBody] = useState('');
    const [postShown, setPostShown] = useState(false);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState('');

    const refresh = () => {
        setIsLoading(true);
        fetch(`https://cs571.org/api/s24/hw9/messages?chatroom=${props.name}`, {
            headers: {
                "X-CS571-ID": 'bid_67c09ec177d1952ae99856de7709b1ba5709d6ed2514a7385f0f91bf264fc278',
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setMessages(data.messages);
            setIsLoading(false);
        })
        .catch((error) => {
            console.error(error);
            setIsLoading(false);
        });
    };

    useEffect(() => {
        refresh();
      }, []);
    
    const handlePost = () => {
        SecureStore.getItemAsync("token").then(token => {
        if (token) {
            const userToken = token
          fetch(`https://cs571.org/api/s24/hw9/messages?chatroom=${props.name}`, {
                method: 'POST',
                headers: {
                    "X-CS571-ID": 'bid_67c09ec177d1952ae99856de7709b1ba5709d6ed2514a7385f0f91bf264fc278',
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    title: postTitle,
                    content: postBody
                })
            })
            .then(res => {
                if (res.status === 400) {
                    alert("A request must contain a 'title' and 'content'")
                } else if (res.status === 404){
                    alert("The specified chatroom does not exist. Chatroom names are case-sensitive.")
                }else if (res.status === 413){
                    alert("'title' must be 128 characters or fewer and 'content' must be 1024 characters or fewer")
                }
                return res.json(); // Proceed to parse the response
            })
            .then(data => {
                Alert.alert("Post created", "Successfully posted!");
                setPostTitle('');
                setPostBody('');
                setPostShown(false);
                refresh();
            })
            .catch(error => {
                Alert.alert("Error", "Failed to create the post.");
            });
        } else {
            Alert.alert("Error", "You must be logged in to post.");    
            return;
        }
      });
    }

    const handleDelete = (posterId) => {
        SecureStore.getItemAsync("token").then(token => {
        if (token) {
          fetch(`https://cs571.org/api/s24/hw9/messages?id=${posterId}`, {
                method: 'DELETE',
                headers: {
                    "X-CS571-ID": 'bid_67c09ec177d1952ae99856de7709b1ba5709d6ed2514a7385f0f91bf264fc278',
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            })
            .then(res => {
                if (res.status === 400) {
                    alert("Error 400")
                } else if (res.status === 401){
                    alert("You must be logged in to do that!") || alert("You may not delete another user's post!")
                } else if (res.status === 404){
                    alert("That message does not exist!")
                }
                Alert.alert("Alert", "Successfully deleted the post!");
                refresh();
            })
            .catch(error => {
                Alert.alert("Error", error);
            });
        } else {
            Alert.alert("Error", "Authentication token not found..");    
            return;
        }
      });
    }

    useEffect(() => {
        SecureStore.getItemAsync("username").then(user => {
            setCurrentUser(user);
        });
    }, []);

    const isValid = () =>{
        return postTitle.length > 0 && postBody.length > 0;
    }
    const onPostPress = () => {
        if(!isValid()){
            if(!postTitle && !postBody){
                Alert.alert("Error", "Please enter all fields for the post.");
                return;
            }else if (!postTitle) {
                Alert.alert("Error", "Please enter a title for the post.");
                return;
            }else if (!postBody) {
                Alert.alert("Error", "Please enter a body context for the post.");
                return;
            }
        }
        setError('');
        
        handlePost();
    };

    

    return <View style={{ flex: 1 }}>
        {/* <Text style={{margin: 100}}>This is a chatroom screen!</Text> */}
        <FlatList
            data={messages}
            renderItem={({ item }) => (
                <BadgerChatMessage 
                    {...item}
                    handleDelete={handleDelete}
                    currentUser={currentUser}
                />
            )}
            keyExtractor={item => item.id.toString()}
            refreshing={isLoading}
            onRefresh={refresh}
        />
        {!props.isGuest && (<TouchableOpacity style={styles.addButton} onPress={() => setPostShown(true)}>
            <Text style={styles.add}>add post</Text>
        </TouchableOpacity>)}
        <Modal animationType="slide" transparent={true} visible={postShown} onRequestClose={() => setPostShown(false)}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.modalView}>
                    <Text style={styles.title}>Create A Post</Text>
                    <Text style={{fontSize:20}}>Title</Text>
                    <TextInput
                        style={styles.titleInput}
                        value = {postTitle}
                        onChangeText={setPostTitle}
                        autoCapitalize="none"
                        multiline={true}
                        textAlignVertical='top'
                    />
                    <Text style={{fontSize:20}}>Body</Text>
                    <TextInput
                        style={styles.bodyInput}
                        value = {postBody}
                        onChangeText={setPostBody}
                        autoCapitalize="none"
                        multiline={true}
                        textAlignVertical='top'
                    />
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity style={[styles.createPostButton, !isValid() && styles.buttonDisabled]} onPress={onPostPress}>
                            <Text style={styles.createPost}>create post</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.cancelButton, !isValid() && styles.buttonDisabled]} onPress={()=>setPostShown(false)}>
                            <Text style={styles.cancel}>cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    </View>
}

// similar to style for register screen, used online external tool
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalView: {
        margin: 20,
        marginTop: 240,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        justifyContent: 'center',
        alignItems: "left",
        textAlign: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    title:{
        fontSize: 25,
        marginBottom: 20,
    },
    titleInput: {
        fontSize: 18,
        width: '100%',
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderColor: 'gray',
        paddingHorizontal: 10, // padding inside the text input
        paddingVertical: 10,
    },
    bodyInput:{
        fontSize: 18,
        width: '100%',
        padding: 10,
        margin: 10,
        minHeight: 100,
        maxHeight:150,
        borderWidth: 1,
        borderColor: 'gray',
        paddingHorizontal: 10, // padding inside the text input
        paddingVertical: 10,
    },
    addButton: {
        backgroundColor: '#8B0000', // Red background
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    add:{
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    createPostButton: {
        backgroundColor: '#8B0000',
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 2,
        margin: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3,
    },
    createPost:{
        color: 'white',
        textTransform: 'uppercase',
    },
    cancelButton: {
        backgroundColor: "grey",
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 2,
        margin: 15,
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
        textTransform: 'uppercase',
    },
    buttonDisabled: {
        backgroundColor: '#cccccc', // Greyed out color
    }
});

export default BadgerChatroomScreen;

