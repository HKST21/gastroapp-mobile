import {StyleSheet, View, Text} from 'react-native';

export default function Objednat() {



    return(
        <View style={styles.mainContainer}>
            <Text>Objednat</Text>

        </View>
    )

}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    h1: {
        fontSize: 20,
    }
})