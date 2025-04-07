import {StyleSheet, View, Text, Pressable} from 'react-native';
import {useState, useEffect} from "react";
import {User} from "../models/interfaces";
import {frontendClass} from "../services/FeClass";
import Toast from "react-native-toast-message";
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';
import {Platform} from 'react-native';
import {addUserToStore, loadUserFromStore} from "../services/AuthStorage.";
import {Vibration} from "react-native";

// Inicializace WebBrowser pro OAuth
WebBrowser.maybeCompleteAuthSession();

// Client ID získané z Google Cloud Console pro přihlášení přes OAuth
const GOOGLE_ANDROID_CLIENT_ID = "Tvoje client ID pro Android (standalone build)";
const GOOGLE_IOS_CLIENT_ID = "Tvoje client ID pro iOS";
const GOOGLE_EXPO_CLIENT_ID = "Client ID pro vývoj v Expo prostředí";

export default function Login() {
    const [isSigned, setIsSigned] = useState(false);
    const [loggedUser, setLoggedUser] = useState<User | null>(null);

    // Hook pro Google přihlášení - musí být na nejvyšší úrovni komponenty
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: Platform.select({
            ios: GOOGLE_IOS_CLIENT_ID,
            android: GOOGLE_ANDROID_CLIENT_ID,
            default: GOOGLE_EXPO_CLIENT_ID
        }),
        scopes: ['profile', 'email']
    });

    // potřebujeme zjistit jestli je uživatel už přihlášený
    useEffect(() => {
        checkLoginStatus()
        Vibration.vibrate()
    },[])

    const checkLoginStatus = async () => {

        try {
            const storedUser = await loadUserFromStore();

            if (storedUser) {
                setLoggedUser(storedUser);
                setIsSigned(true);
            } else {
                console.log("Žádný uživatel v úložišti, je třeba se přihlásit");
            }
        } catch (error) {
            console.error("Chyba při kontrole přihlášení:", error);
        }
    }

    /**
     * Funkce pro přihlášení přes Google
     */
    const handleGoogleSignIn = async () => {
        try {
            // Zahájení přihlašovacího procesu
            const result = await promptAsync();

            // Zpracování odpovědi z Google Auth
            if (result.type === "success" && result.authentication) {
                // Získání informací o uživateli pomocí access tokenu
                const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                    headers: {Authorization: `Bearer ${result.authentication.accessToken}`}
                });
                const googleUser = await userInfoResponse.json();

                // Vytvoření objektu uživatele pro backend
                const user: User = {
                    id: '', // ID bude přiřazeno na serveru
                    providerId: googleUser.id,
                    providerType: 'google',
                    email: googleUser.email,
                    name: googleUser.name,
                    firstName: googleUser.given_name,
                    lastName: googleUser.family_name,
                    profilePicture: googleUser.picture,
                    tokens: 100,
                    vouchers: [],
                    createdAt: new Date(),
                    lastLogin: new Date()
                };

                // Odeslání uživatele na server
                const registeredUser = await frontendClass.registerUser(user);
                if (!registeredUser) {
                    throw new Error("User not found");
                }

                // Aktualizace stavu aplikace
                setLoggedUser(registeredUser);
                setIsSigned(true);
                // přidáme uživatele do store, aby byl neustále přihlášen
                await addUserToStore(registeredUser);

                // Zobrazení notifikace o úspěšném přihlášení
                Toast.show({
                    type: 'success',
                    text1: 'Přihlášení úspěšné',
                    text2: `Vítej zpět, ${registeredUser.firstName}!`,
                });
            } else {
                throw new Error("Google sign-in was cancelled or failed");
            }
        } catch (e) {
            Toast.show({
                type: 'error',
                text1: 'Chyba při přihlášení',
                text2: 'Google login selhal. Zkuste to znovu.',
            });
            console.error(e);
        }
    }

    /**
     * Funkce pro přihlášení přes Apple
     */
    const handleAppleSignIn = async () => {
        try {
            // Kontrola dostupnosti Apple Sign In
            const isAvailable = await AppleAuthentication.isAvailableAsync();

            if (!isAvailable) {
                console.log('Apple Sign In není na tomto zařízení dostupný');
                Toast.show({
                    type: 'error',
                    text1: 'Nepodporovaná platforma',
                    text2: 'Apple Sign In není na tomto zařízení dostupný.',
                });
                return;
            }

            // Spuštění přihlášení přes Apple
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            // Sestavení jména (Apple může poskytnout pouze části)
            const firstName = credential.fullName?.givenName || `AppleFn${credential.user.substring(0, 5)}`;
            const lastName = credential.fullName?.familyName || `AppleLn${credential.user.substring(0, 5)}`;

            // Vytvoření objektu uživatele pro backend
            const user: User = {
                id: '', // ID bude přiřazeno na serveru
                providerId: credential.user,
                providerType: 'apple',
                email: credential.email || `user-${credential.user.substring(0, 10)}@example.com`, // Apple může skrýt email
                name: `${firstName} ${lastName}`, // Správná mezera mezi jménem a příjmením
                firstName,
                lastName,
                profilePicture: undefined, // Apple neposkytuje profilový obrázek
                tokens: 100,
                vouchers: [],
                createdAt: new Date(),
                lastLogin: new Date()
            };

            console.log("➡️ Výsledek Apple přihlášení:", user);

            // Odeslání uživatele na server
            const registeredUser = await frontendClass.registerUser(user);
            if (!registeredUser) {
                throw new Error("User not found");
            }

            // Aktualizace stavu aplikace
            setLoggedUser(registeredUser);
            setIsSigned(true);
            // přidáme uživatele do storu, aby byl neustále přihlášen
            await addUserToStore(registeredUser);

            // Zobrazení notifikace o úspěšném přihlášení
            Toast.show({
                type: 'success',
                text1: 'Přihlášení úspěšné',
                text2: `Vítej zpět, ${registeredUser.firstName}!`,
            });
        } catch (e) {
            Toast.show({
                type: 'error',
                text1: 'Chyba při přihlášení',
                text2: 'Apple sign-in selhal. Zkuste to znovu.',
            });
            console.error(e);
        }
    }

    return (
        <View style={styles.mainContainer}>
            {loggedUser ? <Text>Ahoj {loggedUser.firstName} rádi tě u nás vidíme :)</Text> :
                <View>
                    <View>
                        <Pressable onPress={handleGoogleSignIn}>
                            <Text>
                                login with google
                            </Text>
                        </Pressable>
                    </View>

                    <View>
                        <Pressable onPress={handleAppleSignIn}>
                            <Text>
                                login with apple
                            </Text>
                        </Pressable>
                    </View>
                </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column', // elementy se budou řadit pod sebe
        justifyContent: 'center', // vertikální zarovnání
        alignItems: 'center', // horizntální zarovnání
    },
    h1: {
        fontSize: 20,
    }
});