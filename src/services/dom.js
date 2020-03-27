export const getPathTo = (element) => {
    if (element.id !== '') {
        return `id("${element.id}")`;
    }
    if (element === document.body) {
        return element.tagName;
    }

    let ix = 0;
    const siblings = element.parentNode.childNodes;
    for (let i = 0; i < siblings.length; i += 1) {
        const sibling = siblings[i];
        if (sibling === element) {
            return `${getPathTo(element.parentNode)}/${element.tagName}[${ix + 1}]`;
        }
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
            ix += 1;
        }
    }
    return null;
};

export const findElementByXPath = xpath => document.evaluate(
    xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null,
).singleNodeValue;

export default {
    findElementByXPath,
    getPathTo,
};
