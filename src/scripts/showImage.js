import Locales from '../strings';

export default function showImage(content) {
    var w = window.open("", "_blank");
    w.document.write("<img src=\"" + content + "\">");
    w.document.title = Locales.strings.problem_image;
}
