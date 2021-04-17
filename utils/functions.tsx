export function truncateTitleText(text: string) {
    return (text.length > 20 ? text.substring(0, 20) + "..." : text);
}
export function truncateLinkText(text: string) {
    return (text.length > 40 ? text.substring(0, 40) + "..." : text);
}
