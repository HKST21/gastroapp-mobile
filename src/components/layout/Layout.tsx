import {StyleSheet, View, Text} from 'react-native';
import React from "react";
import Header from './Header';


interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({children}: LayoutProps) {

    return(
        <View style={styles.container}>
            <Header/>
            <View style={styles.content}>
                {children}
            </View>

        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    }
});