import React, { useState, useEffect, useContext } from 'react';
import { Text, ScrollView } from "react-native";
import BadgerNewsItemCard from './BadgerNewsItemCard';
import { NewsPrefContext } from './BadgerNewsPrefProvider';

function BadgerNewsScreen(props) {
    const [articles, setArticles] = useState([]);
    const { prefs } = useContext(NewsPrefContext);
    

    useEffect(() => {
        fetch('https://cs571.org/api/s24/hw8/articles', {
        headers: {
            "X-CS571-ID": `bid_67c09ec177d1952ae99856de7709b1ba5709d6ed2514a7385f0f91bf264fc278`,
        }
        }).then(res => res.json())
        .then(data =>{
            setArticles(data);
        } )
    }, []);

    //used online external tool for logic
    const filteredArticles = articles.filter(article => 
        article.tags.every(tag => prefs[tag] !== false)
    );

    return (
        <ScrollView>
            {filteredArticles.length > 0 ? (
                filteredArticles.map(article => (
                    <BadgerNewsItemCard key={article.id} article={article} />
                ))
            ) : (
                <Text style={{textAlign: 'center', fontSize: 20}}>There are no articles that fit your preferences!</Text>
            )}
        </ScrollView>
    );
}

export default BadgerNewsScreen;
