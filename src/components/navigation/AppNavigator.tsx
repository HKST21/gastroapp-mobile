import React from "react";
import {useState, useEffect} from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Layout from "../layout/Layout";
import Home from "../screens/Home";
import Kupony from "../screens/Kupony";
import Novinky from "../screens/Novinky";
import Objednat from "../screens/Objednat";
import WelcomeLoading from "../screens/WelcomeLoading";
import Login from "../screens/Login";


export default function AppNavigator() {

    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 3000)
    }, [])

    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                {isLoading ? <Stack.Screen name={"WelcomeLoading"} component={WelcomeLoading}/>
                    : !isLoggedIn ?
                        <Stack.Screen name={"Login"} component={Login}/> :
                        <Stack.Screen name="MainApp" component={MainTabNavigator}/>
                }
            </Stack.Navigator>
        </NavigationContainer>

    )
};

export function MainTabNavigator() {

    const Tab = createBottomTabNavigator();

    return (
            <Tab.Navigator screenOptions={{headerShown: false}}>
                <Tab.Screen name="Home">
                    {() => (
                        <Layout>
                            <Home/>
                        </Layout>
                    )}
                </Tab.Screen>

                <Tab.Screen name={"Kupony"}>
                    {() => (
                        <Layout>
                            <Kupony/>
                        </Layout>
                    )}
                </Tab.Screen>

                <Tab.Screen name="Novinky">
                    {() => (
                        <Layout>
                            <Novinky/>
                        </Layout>
                    )}
                </Tab.Screen>

                <Tab.Screen name={"Objednat"}>

                    {() => (
                        <Layout>
                            <Objednat/>
                        </Layout>
                    )}
                </Tab.Screen>
            </Tab.Navigator>
    )
}