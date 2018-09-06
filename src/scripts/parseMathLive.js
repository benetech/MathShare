
const OPEN_TEXT_TAG = "\\text{";

export default function parseMathLive(text) {
    var result = OPEN_TEXT_TAG;
    var textParts = text.split("$$");
    textParts.forEach(function (part, i) {
        if (i % 2) {
            result += "}" + part + OPEN_TEXT_TAG;
        } else {
            result += part;
        }
    })
    return result;
}
