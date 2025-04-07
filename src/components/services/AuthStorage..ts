import * as SecureStore from 'expo-secure-store';
import {User} from "../models/interfaces";

const USER_KEY = 'loggedInUser';

// tato funkce uloží uživatele do zabezpečeného úložiště
export const addUserToStore = async (user: User) => {

    try {
        const jsonUser = JSON.stringify(user);
        await SecureStore.setItemAsync(USER_KEY, jsonUser);
        console.log('stored user');
        return true
    }
    catch (error) {
        console.error('failed to store user' + error);
        return false;
    }

}

export const loadUserFromStore = async () => {
    try {
        const jsonUser = await SecureStore.getItemAsync(USER_KEY);
        if (!jsonUser) {
            return null;
        }
        return JSON.parse(jsonUser);
    }
    catch (error) {
        console.error('failed to load user' + error);
        return null;
    }
}