
const OPEN_TEXT_TAG = '\\text{';

export default function parseMathLive(text) {
    let result = OPEN_TEXT_TAG;
    const textParts = text.split('$$');
    textParts.forEach((part, i) => {
        if (i % 2) {
            result += `}${part}${OPEN_TEXT_TAG}`;
        } else {
            result += part;
        }
    });
    return result;
}
