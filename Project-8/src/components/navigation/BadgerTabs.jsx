import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import BadgerPreferencesScreen from '../screens/BadgerPreferencesScreen';
import BadgerNewsStack from "./BadgerNewsStack";

const Tabs = createBottomTabNavigator();

// lecture demo
function BadgerTabs() {
    return (
        <Tabs.Navigator>
            <Tabs.Screen name = 'News' component={BadgerNewsStack} options={{headerShown: false}}/>
            <Tabs.Screen name = 'Preferences' component={BadgerPreferencesScreen}/>
        </Tabs.Navigator>
)
}

export default BadgerTabs;