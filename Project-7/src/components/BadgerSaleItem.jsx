import { Text, View, Image, Button} from "react-native";
import React from "react";

export default function BadgerSaleItem(props) {

    const {name, imgSrc, price, upperLimit} = props.item;
    const {onAdd, onRemove, quantity} = props;

    return <View style={{alignItems: 'center' }}>
        <Image style={{width: 250, height: 250}} source={{uri:imgSrc}}/>
        <Text style={{fontSize: 30, margin: 10 }}>{name}</Text>
        <Text style={{fontSize: 18, margin: 5 }}>${price} each</Text>
        <Text style={{fontSize: 16, margin: 5 }}>You can order up to {upperLimit} units!</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            <Button title="-" onPress={onRemove} disabled={quantity == 0} />
            <Text style={{ margin: 15, fontSize: 18 }}>{quantity}</Text>
            <Button title="+" onPress={onAdd} disabled={quantity >= upperLimit} />
        </View>
    </View>
}
