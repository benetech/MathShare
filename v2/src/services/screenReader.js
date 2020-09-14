export const getScreenReaderText = (parent, className = 'sROnly') => {
    const elementsContainingClass = [];

    const findElementsContainingClass = (element) => {
        if (element.classList && element.classList.contains(className)) {
            elementsContainingClass.push(element);
        }

        if (element.childNodes) {
            for (let i = 0; i < element.childNodes.length; i += 1) {
                findElementsContainingClass(element.childNodes[i]);
            }
        }
    };

    findElementsContainingClass(parent);

    return elementsContainingClass.map(element => element.innerText).join('\n');
};

export default {
    getScreenReaderText,
};
