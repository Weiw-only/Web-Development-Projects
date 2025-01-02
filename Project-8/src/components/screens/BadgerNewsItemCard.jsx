import React from 'react';
import { View, Text, Image, StyleSheet, Pressable} from 'react-native';
import { useNavigation } from "@react-navigation/native";



function BadgerNewsItemCard({ article }) {

    const navigation = useNavigation();

    function handlePress() {
        navigation.push('Article', article);
      }
    
    return (
        <Pressable onPress={handlePress}>
            <View style={styles.card}>
                <Image source={{ uri: `https://raw.githubusercontent.com/CS571-S24/hw8-api-static-content/main/${article.img}`}} style={styles.image} />
                <Text style={styles.title}>{article.title}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: { // lecture
        borderRadius: 10,
        backgroundColor: '#FFF',
        shadowOpacity: 0.15,
        shadowRadius: 5,
        shadowColor: '000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        marginVertical: 8,
        marginHorizontal: 16,
        padding: 10,
        elevation: 5,

    },
    image: {
        width: '100%',
        height: 200,
    },
    title: {
        fontSize: 18,
        margin: 10,
    },
});

export default BadgerNewsItemCard;
