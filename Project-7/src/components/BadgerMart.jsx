import { Text, View, Button, Alert } from "react-native";
import React,{ useEffect, useState } from "react";
import BadgerSaleItem from "./BadgerSaleItem";

export default function BadgerMart(props) {

    const [items, setItems] = useState([]);
    const [currentItem, setCurrentItem] = useState(0);
    const [quantity, setQuantity] = useState({});

    useEffect(() => {
        fetch('https://cs571.org/api/s24/hw7/items', {
          headers: {
            "X-CS571-ID": `bid_67c09ec177d1952ae99856de7709b1ba5709d6ed2514a7385f0f91bf264fc278`
          }
        }).then(res => res.json())
        .then(items=> {
          setItems(items);
          let initialItemQ = {};
          items.forEach(i => {
            initialItemQ[i.name] = 0;
          });
          setQuantity(initialItemQ);
        })
      }, []);

    const handlePrevious = () =>{
      if (currentItem > 0) {
        setCurrentItem(currentItem - 1);
      }
    }

    const handleNext = () =>{
      if (currentItem < items.length - 1) {
        setCurrentItem(currentItem + 1);
      }
    }

    //used online external tool for logic and debug
    const handleAddItems = (item) => {
      setQuantity(prevQuantities => ({
        ...prevQuantities, [item]: prevQuantities[item] + 1
      }));
    }
    const handleRemoveItems = (item) => {
      setQuantity(prevQuantities => ({
        ...prevQuantities, [item]: prevQuantities[item] > 0 ? prevQuantities[item] - 1 : 0
      }));
    }

    const handleTotalCosts = () => {
      return items.reduce((total, item) => {
        return total + (quantity[item.name] * item.price);
      }, 0);
    }

    const handleTotalItems = () => {
      return Object.values(quantity).reduce((t, q) => t + q, 0);
    }

    const handlePlaceOrder = () => {
      const numItems = handleTotalItems();
      const price = handleTotalCosts().toFixed(2);
      Alert.alert("Order Confirmed!", `Your order contains ${numItems} items and costs $${price}!`, 
      [
        { text: "OK", onPress: () => clearBasket() } //used online external tool
      ]);
    };
    //used online external tool
    const clearBasket = () => {
      setQuantity({});
      setCurrentItem(0);
      let resetQuantities = {};
      items.forEach(i => {
        resetQuantities[i.name] = 0;
      });
      setQuantity(resetQuantities);
    };
  

    return <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 28}}>Welcome to Badger Mart!</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
          <Button title="Previous" onPress={handlePrevious} disabled={currentItem === 0} />
          <Button title="Next" onPress={handleNext} disabled={currentItem === items.length - 1} />
        </View>
        {items.length > 0 && 
        <BadgerSaleItem 
          item ={items[currentItem]}
          quantity={quantity[items[currentItem].name]}
          onAdd={() => handleAddItems(items[currentItem].name)}
          onRemove={() => handleRemoveItems(items[currentItem].name)}
        />}
        <View>
            <Text style={{fontSize: 16, margin: 10 }}>You have {handleTotalItems()} item(s) costing ${handleTotalCosts().toFixed(2)} in your cart!</Text>
            <Button style={{fontSize: 16, margin: 10 }}title="PLACE ORDER" onPress={handlePlaceOrder} disabled={handleTotalItems() === 0} />
        </View>
    </View>
}

