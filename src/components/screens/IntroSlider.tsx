import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

type Slide = {
    key: number;
    title: string;
    text: string;
    image: string;
    backgroundColor: string;
};

export default function IntroSlider() {
    // Stav pro sledování aktuálního slidu
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);

    // Reference na slider komponentu
    const sliderRef = useRef<AppIntroSlider>(null);

    const slides: Slide[] = [
        {
            key: 1,
            title: 'Ochutnejte kousek Itálie!',
            text: "Ponořte se do světa autentických neapolských chutí a využijte naše exkluzivní kupony! Ojevte nabídku 1+1 ZDARMA – dvě pizzy za cenu jedné pouze pro členy aplikace!",
            image: "https://images.vexels.com/media/users/3/139919/isolated/preview/7c8bba2a6e3ab9e5678128cd1c50aede-cheese-pizza-cartoon.png",
            backgroundColor: "transparent",
        },
        {
            key: 2,
            title: "Staňte se VIP gurmánem",
            text: "Každá návštěva se počítá! Sbírejte body loajality automaticky přes aplikaci a proměňte je v luxusní večeři zdarma, nebo jedinečné nabídky dostupné pouze pro členy.",
            image: "https://images.vexels.com/media/users/3/139919/isolated/preview/7c8bba2a6e3ab9e5678128cd1c50aede-cheese-pizza-cartoon.png",
            backgroundColor: "transparent",
        },
        {
            key: 3,
            title: "Pizza až ke dveřím za restaurační ceny!",
            text: "Dopřejte si kulinářský zážitek v pohodlí domova! Naši kurýři vám doručí horkou, čerstvě upečenou pizzu každý den od 11:00 do 23:00 – a to bez navýšení cen!",
            image: "https://images.vexels.com/media/users/3/139919/isolated/preview/7c8bba2a6e3ab9e5678128cd1c50aede-cheese-pizza-cartoon.png",
            backgroundColor: "transparent",
        }
    ];

    // Hook pro automatické přehrávání slidů
    useEffect(() => {
        // Vytvoříme časovač, který bude měnit slidy každé 4 sekundy
        const interval = setInterval(() => {
            // Pokud jsme na posledním slidu, vrátíme se na první
            if (activeSlideIndex === slides.length - 1) {
                if (sliderRef.current) {
                    sliderRef.current.goToSlide(0);
                    setActiveSlideIndex(0);
                }
            } else {
                // Jinak přejdeme na další slide
                if (sliderRef.current) {
                    sliderRef.current.goToSlide(activeSlideIndex + 1);
                    setActiveSlideIndex(activeSlideIndex + 1);
                }
            }
        }, 4000); // 4000 ms = 4 sekundy

        // Zrušíme časovač při unmount komponenty nebo při změně activeSlideIndex
        return () => clearInterval(interval);
    }, [activeSlideIndex]);

    const renderItem = ({item}: { item: Slide }) => {
        return(
            <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
                <Text style={styles.title}>{item.title}</Text>
                <Image source={{uri: item.image}} style={styles.image} />
                <Text style={styles.text}>{item.text}</Text>
            </View>
        );
    };

    return (
        <AppIntroSlider
            ref={sliderRef} // Připojíme referenci na slider
            renderItem={renderItem}
            data={slides}
            onSlideChange={(index) => setActiveSlideIndex(index)} // Aktualizuje stav při manuální změně slidu
        />
    );
}

const styles = StyleSheet.create({
    // Styly zůstávají stejné...
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        marginBottom: 30,
    },
    text: {
        fontSize: 16,
        color: 'black',
        textAlign: 'center',
        marginTop: 20,
        paddingHorizontal: 25,
    },
    image: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
    },
});