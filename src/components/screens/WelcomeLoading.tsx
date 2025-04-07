import { StyleSheet, View, Text, Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';

export default function WelcomeLoading() {
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(progress, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false,
            easing: Easing.linear,
        }).start();
    }, []);

    const widthInterpolated = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.text}>Načítám křupavou Pizzu</Text>
            <View style={styles.progressBarContainer}>
                <Animated.View style={[styles.progressBar, { width: widthInterpolated }]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center', // vertikální zarovnání
        alignItems: 'center',     // horizontální zarovnání
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    text: {
        marginBottom: 20,
        fontSize: 18,
        fontWeight: '600',
    },
    progressBarContainer: {
        width: '80%',
        height: 10,
        backgroundColor: '#eee',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#ff4d00',
    },
});
