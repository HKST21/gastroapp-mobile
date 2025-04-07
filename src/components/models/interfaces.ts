export interface User {
    id: string,              // Jedinečný identifikátor v tvé aplikaci
    providerId: string,      // ID od poskytovatele (Google/Apple)
    providerType: 'google' | 'apple',  // Typ poskytovatele
    email: string,           // E-mail uživatele
    name: string,            // Celé jméno
    firstName?: string,      // Křestní jméno (nemusí být vždy dostupné)
    lastName?: string,       // Příjmení (nemusí být vždy dostupné)
    profilePicture?: string, // URL profilového obrázku (nemusí být dostupné od Apple)
    // Vlastní data aplikace
    tokens: number, // Tokeny pro kolo štěstí
    vouchers?: UserVoucher[],//
    createdAt: Date,         // Datum vytvoření účtu
    lastLogin: Date,         // Datum posledního přihlášení
}

export interface Voucher {
    id: string;
    name: string;
    description: string;       // Popis voucheru (např. "Druhá pizza zdarma")
    tokenCost: number;         // Kolik tokenů stojí tento voucher
    expiryDate?: Date;         // Datum, do kdy je voucher platný
    imageUrl?: string;         // URL obrázku pro voucher
    isActive: boolean;         // Je voucher aktuálně v nabídce?
    code: string;              // Kód voucheru pro uplatnění v restauraci
}

export interface UserVoucher {
    id: string;
    userId: string;            // ID uživatele, kterému voucher patří
    voucher: Voucher;          // Celý voucher (nejen ID) pro snadnější práci v UI
    acquiredDate: Date;        // Kdy uživatel voucher získal
    isUsed: boolean;           // Byl už voucher použit?
    usedDate?: Date;           // Kdy byl voucher použit (pokud byl)
}

export interface Vouchers {
    vouchers: Voucher[]
}
export interface Item {
    key: number,
    title: string,
    text: string,
    image: string,
    backgroundColor: string,
}

