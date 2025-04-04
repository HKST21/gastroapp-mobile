import {User} from "../models/interfaces";


export default class FeClass {

    constructor() {

    }

    ApiUrl = "https://mujserver.cz"

    async registerUser(user: User) {
    // PŘIPRAVENÁ FUNKCE NA POSTOVÁNÍ UŽIVATELE NA ENDPOINT
        try {
            const response = await fetch(this.ApiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({user})
            });
            if (!response.ok) {
                const responseText = await response.text();

                throw new Error(`Connected to Server, but received status ${response.status} and text: ${responseText}`);
                ;
            };

            return await response.json();
        }
        catch (error) {
            if (error instanceof TypeError) {
                // fetch failed we didn't even connect the server
                console.error(`Unable to connect server with this status ${error.message}`);
            } else {
                // caught error from if(!response.ok) or other coding error (mistake in json etc.)
                console.error(`Failed to connect server with this error: ${error}`);
            }

        }

    }
};

export const frontendClass = new FeClass();
