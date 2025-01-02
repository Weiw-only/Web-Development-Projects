import { Text, View, Switch, StyleSheet, ScrollView} from "react-native";
import React, { useState, useEffect, useContext } from 'react';
import { NewsPrefContext } from "./BadgerNewsPrefProvider";

function BadgerPreferencesScreen(props) {
    const { prefs, setPrefs } = useContext(NewsPrefContext);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        fetch('https://cs571.org/api/s24/hw8/articles', {
            headers: {
                "X-CS571-ID": `bid_67c09ec177d1952ae99856de7709b1ba5709d6ed2514a7385f0f91bf264fc278`,
            }
        }).then(res => res.json())
        .then(articles => {
            const extractedTags = articles.map(article => article.tags).flat() // Flatten the array of arrays into a single array
            .reduce((acc, tag) => {acc.add(tag); // Add each tag to the Set to ensure uniqueness
            return acc;
          }, new Set());

        setTags(Array.from(extractedTags)); // Convert the Set back into an array

        // Initialize preferences if not already set
        const initialPrefs = Array.from(extractedTags).reduce((acc, tag) => {
          if (!(tag in prefs)) {
            acc[tag] = true; // Set default preference to true (opted in)
          }
          return acc;
        }, {});

        setPrefs({ ...prefs, ...initialPrefs });
        });
    }, []);

    const togglePref = (tag) => {
        setPrefs(prevPref => ({
          ...prevPref,
          [tag]: !prevPref[tag],
        }));
      };
 
    return (
        <ScrollView style={styles.container}>
            {tags.map((tag) => (
                <View key={tag} style={styles.preferenceItem}>
                    <Text style={styles.preferenceText}>
                        Currently {prefs && prefs[tag] ? '' : 'NOT '}showing {tag} articles.
                    </Text>
                    <Switch
                        trackColor={{ false: "#D3D3D3", true: "#FFCDD2" }} // red when on, gray when off
                        thumbColor={prefs[tag] ? "#f44336" : "#999999"} // match with track color
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => togglePref(tag)}
                        value={prefs && prefs[tag]}
                    />
                </View>
            ))}
        </ScrollView>
    );
}

//online external tool
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    preferenceItem: {
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFF', 
        marginTop: 10,
        marginBottom: 10, 
        borderRadius: 10, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    preferenceText: {
        fontSize: 16,
    },
});

export default BadgerPreferencesScreen;

