import * as Google from 'expo-auth-session/providers/google'; // fce pro implementaci google loginu
import * as AppleAuthentication from 'expo-apple-authentication'; // fce pro implementaci apple loginu
import * as WebBrowser from 'expo-web-browser'; // pooužívá s k oath, otevře se browser pro ověření
import {Platform} from 'react-native'; // modul který detekuje na jaké platformě je uživatel
import {User, UserVoucher} from "../models/interfaces";
import {frontendClass} from "./FeClass";


WebBrowser.maybeCompleteAuthSession()

//Inicializace konfigurace
// Client ID získané z Google Cloud Console pro přihlášení přes OAuth
// Tyto ID reprezentují TVOU aplikaci – ne uživatele!
const GOOGLE_ANDROID_CLIENT_ID = "Tvoje client ID pro Android (standalone build)";
const GOOGLE_IOS_CLIENT_ID = "Tvoje client ID pro iOS";
const GOOGLE_EXPO_CLIENT_ID = "Client ID pro vývoj v Expo prostředí";

/**
 * Přihlášení pomocí Google účtu
 * Vrací uživatele pokud přihlášení proběhlo úspěšně, jinak null
 */

export async function signInWithGoogle(): Promise<User | null> {

    try {
        // SPOJUJEME SE S GOOGLE AUTH ABY GOOGLE IDENTIFIKOVAL  NAŠÍ APLIKACI
        // destrukturalizuju pole, protože useAuthRequest google hook vrací právě request objekt obsahující konfiguraci autentizačního
        // požadavku. response objekt pokud odpověď proběhla. promptAsync funkce, kterou voláme pro zahájení authentizačního procesu
        const clientId = Platform.select({
            ios: GOOGLE_IOS_CLIENT_ID,
            android: GOOGLE_ANDROID_CLIENT_ID,
            default: GOOGLE_EXPO_CLIENT_ID // použije se ve vývoji (Expo Go)
        });

        const [request, response, promptAsync] = Google.useAuthRequest({
            clientId,
            scopes: ['profile', 'email']
        });
        // ZÍSKÁVÁME TOKEN K PŘIHLÁŠENÍ - DŮLEŽITÉ ZDE UŽIVATEL JE VYZVÁN PO ZAVOLÁNÍ promptAsync() k tomu aby se přihlásil nebo vybral účet,
        // kterým se chce přihlísit, pokud se přihlásí získáme TOKEN, který už obsahuje uživatelova DATA!!
        const result = await promptAsync(); // zde voláme přihlášení a vrací se nám objekt result, který má vlastnosti type
        // tedy jestli byl 'success', 'cancel' atd. a vlastnost authentication, tzn pokud je type 'access' obsahuje accessToken, který použijeme
        // pro přístup k  k API google jako identifikátor uživatele

        // POKUD ZÍSKÁME TOKEN, VOLÁME FETCHEM POŽADAVEK NA DATA O UŽIVATELI, IDENTIFIKACE UŽIVATELE JE V TOKENU
        if (result.type === "success" && result.authentication) { //
            const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: {Authorization: `Bearer ${result.authentication.accessToken}`}
            });
            const googleUser = await userInfoResponse.json(); // převádíme data o uživateli na json()

            const user: User = { // transformujeme data do objektu, který očekává náš backend
                id: '', // ID bude přiřazeno na serveru
                providerId: googleUser.id,
                providerType: 'google',
                email: googleUser.email,
                name: googleUser.name,
                firstName: googleUser.given_name,
                lastName: googleUser.family_name,
                profilePicture: googleUser.picture,
                tokens: 0,
                vouchers: [],
                createdAt: new Date(),
                lastLogin: new Date()
            };
            // voláme feclassu, aby předala uživatele na endpoint
            const registeredUser = await frontendClass.registerUser(user);

            return registeredUser; // vracíme registrovaného uživatele již s naším id
        }

        return null // vracíme null pokud nedojde k přihlášení
    } catch (error) {
        console.error('Chyba při přihlašování přes Google:', error);
        return null;
    }

}




