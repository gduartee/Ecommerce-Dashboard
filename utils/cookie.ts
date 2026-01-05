export function getCookieClient(name: string): string | null {
    // 1. Segurança para Next.js: Verifica se está rodando no navegador
    if (typeof document === "undefined") {
        return null;
    }

    // 2. Busca o cookie usando Regex
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));

    if (match) {
        // 3. Decodifica o valor (importante se houver espaços ou caracteres especiais)
        return decodeURIComponent(match[2]);
    }

    return null;
}