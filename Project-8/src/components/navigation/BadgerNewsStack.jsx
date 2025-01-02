import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BadgerNewsScreen from '../screens/BadgerNewsScreen';
import BadgerNewsItemInDetail from "../screens/BadgerNewsItemInDetail";

const newsStack = createNativeStackNavigator();

// lecture demo
function BadgerNewsStack() {
    return (
        <newsStack.Navigator>
            <newsStack.Screen name = 'Articles' component={BadgerNewsScreen}/>
            <newsStack.Screen name = 'Article' component={BadgerNewsItemInDetail}/>
        </newsStack.Navigator>
)
}

export default BadgerNewsStack;