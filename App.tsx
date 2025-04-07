import AppNavigator from "./src/components/navigation/AppNavigator";
import {SafeAreaProvider} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function App() {

    return (
        <SafeAreaProvider>
            <AppNavigator/>
            <Toast />
        </SafeAreaProvider>
    );
}