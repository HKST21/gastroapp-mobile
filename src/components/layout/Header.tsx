// src/components/layout/Header.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Header() {
    return (
        <View style={styles.header}>
            <Text style={styles.headerText}>🍕 PIZZA.LAB</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 100,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingTop: 30,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#d32f2f',
    },
});