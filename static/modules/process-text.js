const defaultText = "Прывітанне! Увядзіце свой тэкст, каб агучыць яго, і клікніце на кнопку, ці проста клікніце на кнопку ніжэй.";
const allowedCharacters = "АБВГДЕЁЖЗІЙКЛМНОПРСТУЎФХЦЧШЫЬЭЮЯабвгдеёжзійклмнопрстуўфхцчшыьэюя!'(),-.:;? ";

export function processText(text) {
    if (text.length > 1500) {
        return { error: true, text: "too long" };
    }
    if (text.length === 0) {
        return { error: false, text: defaultText };
    }
    text = text.replaceAll('и', 'і');
    text = text.replaceAll('И', 'І');

    let badCharacters = "";
    for (const symbol of text) {
        if (allowedCharacters.search(symbol) === -1) {
            badCharacters += symbol;
        }
    }
    
    if (badCharacters.length >= text.length / 2) {
        return {error: true, text: "занадта шмат сімвалаў не на беларускай мове."}
    }

    for (const badCharacter of badCharacters) {
        text = text.replaceAll(badCharacter, '');
    }

    if (badCharacters.length !== 0) {
        return { error: false, text: text, badCharacters: badCharacters };
    }

    return {error: false, text: text};
    
}