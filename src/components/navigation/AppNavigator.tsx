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
import IntroSlider from "../screens/IntroSlider";
import {useUser} from "../services/UserContext";


export default function AppNavigator() {

    const [isLoading, setIsLoading] = useState<1|2|3>(1);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const {loggedUser, setLoggedUser } = useUser();

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(2)
        }, 3000);
        setTimeout(() => {
            setIsLoading(3)
        }, 15000);
    }, []);

    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                {isLoading === 1 ? <Stack.Screen name={"WelcomeLoading"} component={WelcomeLoading}/> :
                    isLoading === 2 && !loggedUser ? <Stack.Screen name={"IntroSlider"} component={IntroSlider}/>
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