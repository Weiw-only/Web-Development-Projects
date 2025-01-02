import React, { useState, useEffect, useRef } from "react";
import { Text,Image, ScrollView, Animated, StyleSheet, Linking} from "react-native";

function BadgerNewsItemInDetail ({route}){
    const [news, setNews] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const opVal = useRef(new Animated.Value(0));

    useEffect(() =>{
        const { fullArticleId } = route.params;
        fetch(`https://cs571.org/api/s24/hw8/article?id=${fullArticleId}`, {
        headers: {
            "X-CS571-ID": `bid_67c09ec177d1952ae99856de7709b1ba5709d6ed2514a7385f0f91bf264fc278`,
        }
        }).then(res => res.json())
        .then(data =>{ // lecture demo
            setNews(data);
            setIsLoading(false);
            Animated.timing(opVal.current,{
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            }).start();
        })
    },[route.params.fullArticleId])

    return(
        <ScrollView style={styles.container}>
            {isLoading ? (
                <Text style={{textAlign: 'center', fontSize: 20}}>The content is loading!</Text>
            ): (
                <Animated.View>
                    <Image source={{ uri: `https://raw.githubusercontent.com/CS571-S24/hw8-api-static-content/main/${news.img}`}} style={styles.articleImage} />
                    <Text style={styles.articleTitle}>{news.title}</Text>
                    <Text style={styles.articleAuthorDate}>By {news.author} on {news.posted}</Text>
                    <Text style={styles.textLink}onPress={() => Linking.openURL(news.url)}>Read full article here</Text>
                    {/* used online external tool for reference */}
                    {news.body.map((paragraph, index) => (<Text key={index} style={styles.articleParagraph}>{paragraph}</Text>))}
                </Animated.View>
            )}
        </ScrollView>
    );
}

// online external tool
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    articleImage: {
        width: '100%',
        height: 200,
    },
    articleTitle: {
        fontWeight: 'bold',
        fontSize: 22,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    articleAuthorDate: {
        fontStyle: 'italic',
        marginHorizontal: 16,
        marginBottom: 16,
    },
    textLink: {
        color: 'blue',
        marginHorizontal: 16,
        marginBottom: 16,
    },
    articleParagraph: {
        fontSize: 16,
        marginBottom: 10,
        marginHorizontal: 16,
    },
});
export default BadgerNewsItemInDetail;