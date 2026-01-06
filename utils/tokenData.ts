import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface TokenPayload {
    id: number;
    name: string;
    role: string;
}

export function getToken(): string | null {
    if (typeof window !== "undefined")
        return String(Cookies.get("auth-token-emp"));

    return null;
}

export function getUserName(): string | null {
    const token = getToken();

    if (!token)
        return null;

    try {
        const decoded = jwtDecode<TokenPayload>(token);

        return decoded.name;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export function isManager(): boolean {
    const token = getToken();

    if (!token)
        return false;

    try {
        const decoded = jwtDecode<TokenPayload>(token);

        return decoded.role === "MANAGER"

    } catch (error) {
        console.error(error);
        return false;
    }
}

export function getId(): number | null {
    const token = getToken();

    if (!token)
        return null;

    try {
        const decoded = jwtDecode<TokenPayload>(token);

        return decoded.id;

    } catch (error) {
        console.error(error);
        return null;
    }
}