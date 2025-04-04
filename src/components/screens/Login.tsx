import {StyleSheet, View, Text} from 'react-native';

export default function Login() {



    return(
        <View style={styles.mainContainer}>
            <Text>LOGIN</Text>

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