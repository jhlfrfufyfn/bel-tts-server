const defaultText = "Рытмічныя камбінацыі аднародных геаметрычных фігур, ліній і колеру ствараюць ілюзію руху. Разнастайныя дэкаратыўныя элементы выкарыстоўваюцца таксама ў прыкладным мастацтве, прамысловай графіцы, плакаце.";
const allowedCharacters = "АБВГДЕЁЖЗІЙКЛМНОПРСТУЎФХЦЧШЫЬЭЮЯабвгдеёжзійклмнопрстуўфхцчшыьэюя!'(),-.:;? –";

export function processText(text) {
    if (text.length > 400) {
        return { error: true, text: "too long" };
    }
    if (text.length === 0) {
        return { error: false, text: defaultText };
    }
    text = text.replaceAll('и', 'і');
    text = text.replaceAll('И', 'І');

    let badCharacters = "";
    for (const symbol of text) {
        if (allowedCharacters.search(`\\${symbol}`) === -1) {
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