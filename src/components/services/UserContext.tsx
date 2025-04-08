import React, {createContext, useState, useContext, useEffect, ReactNode} from "react";
import {addUserToStore, loadUserFromStore} from "./AuthStorage";
import {User} from "../models/interfaces";

/*JAK TOTO CELÉ FUNGUJE:
* JAK TOTO CELÉ FUNGUJE:

1) Vytvořím pomocí createContext objekt, který pojmenuju UserContext.
   - Tento objekt slouží jako IDENTIFIKÁTOR konkrétního kontextu.
   - Z tohoto objektu získáme komponentu UserContext.Provider.
   - Tento identifikátor později použijeme s useContext hookem.

2) Vytvořím Provider komponentu, která:
   - Přijímá children v props (vnořené komponenty)
   - Udržuje stavové proměnné (loggedUser) a setovací funkce
   - Synchronizuje tyto proměnné se SecureStore

3) V Provideru vytvořím objekt value obsahující data a funkce, které chci sdílet.
   Tento objekt pak předám do <UserContext.Provider value={value}>.
   React interně propojí tento objekt s identifikátorem UserContext.

4) Vytvořím hook useUser, který:
   - Volá useContext(UserContext) - tím předá Reactu identifikátor (ten samý objekt)
   - React najde nejbližší Provider s odpovídajícím identifikátorem
   - React vrátí value z tohoto Provideru
   - Výsledek je stejný objekt, který jsme předali do value prop v Provideru

5) V komponentách pak použijeme useUser() hook a získáme data a funkce z objektu
   value (díky destrukturalizaci můžeme získat přímo loggedUser a setLoggedUser).*/


// Typ pro kontext
type UserContextType = {
    loggedUser: User | null;
    setLoggedUser: (user: User) => Promise<boolean>;
};

// VYTVOŘÍME KONTEXT
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider komponenta, která poskytuje kontext celé aplikaci
type UserProviderProps = {
    children: ReactNode;
};
// VYTVOŘÍME PROVIDER KTERÝ UCHOVÁVÁ STAVY A SETOVACÍ FUNKCE VČETNĚ JEJICH NAČÍTÁNÍ
export const UserProvider = ({children}: UserProviderProps) => {
    const [loggedUser, setLoggedUser] = useState<User | null>(null);

    // Efekt pro načtení uživatele ze secure storu
    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await loadUserFromStore();
                if (user) {
                    setLoggedUser(user);
                }
            } catch (e) {
                console.error('Chyba při načítání uživatele ze secure store', e);
            }
        };
        loadUser();
    }, []);

    const updateLoggedUser = async (user: User): Promise<boolean> => {
        try {
            if (user) {
                await addUserToStore(user);
            }
            setLoggedUser(user);
            return true;
        } catch (e) {
            console.error('Chyba při updatování uživatele', e);
            return false;
        }
    };

    // VYTVOŘÍME VALUE, KTEROU PŘEDÁME DO JSX, TATO VALUE MÁ V SOBĚ STAVY A SETOVACÍ FUNKCE Z PROVIDERU
    const value: UserContextType = {
        loggedUser, // Uživatelova data
        setLoggedUser: updateLoggedUser // Funkce pro aktualizaci uživatele
    };

    return (
        // PŘI NAČTĚNÍ ELEMENTŮ SE ZÍSKÁ VALUE, která obsahuje aktuální stav z provideru
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>

    );
};

// HOOK PRO POUŽITÍ KONTEXTU, VOLÁME HO V KOMPONENTÁCH ABYCHOM ZÍSKALI DATA I SETOVACÍ FUNKCI
export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser musí být použit uvnitř UserProvider');
    }
    return context;
};

/*
* dobře takže když vytvořím createContext tak získám:
* {komponenta,
contextId}?
* a kdyz volam useContext(contextId) tak react hledá v provideru komponenta, ziská její value a vrátí jí ? tzn vrátí proměnné a setovací funkce prostě cokoliv co chciEditPřesně tak! Velmi dobře to popisuješ.
* Když použiješ createContext(), získáš objekt, který má dvě hlavní části:

Provider komponenta - dostupná jako vlastnost .Provider na vytvořeném objektu kontextu. Používáš ji k poskytování hodnot.
Identifikátor kontextu - samotný objekt kontextu slouží jako jedinečný identifikátor nebo "klíč", který React používá k nalezení správných hodnot.

Když potom voláš useContext(contextId), React provádí tyto kroky:

Používá poskytnutý identifikátor kontextu (contextId) k vyhledání nejbližšího Provideru tohoto kontextu v hierarchii komponent směrem nahoru.
Jakmile najde odpovídající Provider, získá jeho value prop (tedy ty hodnoty, které jsi do něj vložil).
Vrátí tuto hodnotu jako výsledek volání useContext().

Proto můžeš v libovolné komponentě uvnitř <UserContext.Provider> zavolat useContext(UserContext) a dostaneš přesně ty hodnoty, které jsi umístil do value prop toho Provideru.
Praktická stránka tohoto mechanismu je, že můžeš sdílet jakýkoli stav nebo funkce, které potřebuješ napříč komponentami, aniž bys je musel předávat přes props. Může to být jednoduché jako jméno uživatele nebo složité jako celý objekt s funkcemi pro správu stavu aplikace.*/