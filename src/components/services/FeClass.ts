import {User} from "../models/interfaces";


export default class FeClass {

    constructor() {

    }

    ApiUrl = "https://gastroapp-backend.onrender.com/api/pizzalab";


    async registerUser(user: User) {
        try {
            const response = await fetch(`${this.ApiUrl}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user)
            });

            // Získání a parsování response v jednom kroku
            const responseText = await response.text();
            console.log("➡️ Backend odpověděl:", response.status, responseText);

            if (!response.ok) {
                throw new Error(`Connected to Server, but received status ${response.status}`);
            }

            // Pokus parsovat text jako JSON
            try {
                return JSON.parse(responseText);
            } catch (e) {
                console.error("Nelze parsovat odpověď jako JSON:", e);
                throw new Error("Invalid JSON response from server");
            }
        } catch (error) {
            if (error instanceof TypeError) {
                console.error(`Unable to connect server with this status ${error.message}`);
            } else {
                console.error(`Failed to connect server with this error: ${error}`);
            }
            throw error; // Propagujeme chybu dál
        }
    }

    /**
     * Získá aktuální data uživatele z backendu
     * @param userId ID uživatele
     * @returns Aktualizovaný uživatelský objekt nebo null v případě chyby
     */
    async getUserById(userId: string): Promise<User | null> {
        try {
            const response = await fetch(`${this.ApiUrl}/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Chyba při načítání uživatele: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Chyba při získávání uživatele z backendu:', error);
            return null;
        }
    }

};

export const frontendClass = new FeClass();
