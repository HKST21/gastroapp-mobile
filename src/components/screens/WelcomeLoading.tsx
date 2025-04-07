import {StyleSheet, View, Text} from 'react-native';

export default function WelcomeLoading() {



    return(
        <View style={styles.mainContainer}>
            <Text>ZDE SE LOADUJI</Text>

        </View>
    )

}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center', // vertikalní zarovnání
        alignItems: 'center', // hori
    },
    h1: {
        fontSize: 20,
    }
})