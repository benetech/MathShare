function initializeMathPalette() {
    $.getJSON( "../data/palettes.json", function(palettes) {
        $('#mathPalette').html(buildMathPalette(palettes));
        initializeKeyShortcuts(palettes);
    });
}

function buildMathPalette(palettes) {
    var result = "<h3 class=\"sr-only\">math input buttons</h3>";
    palettes.forEach(function(palette, order) {
        result += buildTitleForScreenReaders(palette.screenReadersTitle) + buildButtonsList(palette, order + 1);
    });
    return result;
}

function buildTitleForScreenReaders(title) {
    return "<h4 class=\"sr-only\">" + title + "</h4>";
}

function buildButtonsList(palette, order) {
    return buildButtonsListHeader(order) + buildButtonsListBody(palette.buttonsRows, palette.commonClass, palette.commonOnclick) + buildButtonsListFooter(palette.label);
}

function buildButtonsListHeader(order) {
    return "<div class=\"mathPalette order-" + order + "\" role=\"list\">";
}

function buildButtonsListBody(buttonsRows, commonClass, commonOnclick) {
    var result = "";
    buttonsRows.forEach(function(buttonsRow) {
        result += buildButtonsRow(buttonsRow, commonClass, commonOnclick) + "<br>";
    });
    return result;
}

function buildButtonsRow(buttonsRow, commonClass, commonOnclick) {
    var result = "";
    buttonsRow.forEach(function(button) {
        var buttonClass = concatAttribute(commonClass, button.additionalClass);
        var onClick = concatAttribute(commonOnclick, button.additionalOnclick);
        var title = buildButtonTitle(button.title, button.keys);
        result += "<span role=\"listitem\">"
            + "<button id=\"" + button.id + "\" "
            + "class=\"" + buttonClass + "\" data-toggle=\"tooltip\" "
            + "title=\"" + title + "\" "
            + "onclick=\"" + onClick + "\">"
            + button.value + "</button>"
            + "<span class=\"sr-only\">" + title + "</span></span> ";
    });
    return result;
}

function concatAttribute(firstPart, secondPart) {
    var result = firstPart ? firstPart + " " : "";
    result += secondPart ? secondPart : "";
    return result;
}

function buildButtonsListFooter(label) {
    return "<span role=\"listitem\">" + label + "</span></div>";
}

function buildButtonTitle(title, keys) {
    var keyShortcut = "";
    if (keys) {
        keyShortcut += " (⌨: ";
        keyShortcut += keys.join("+");
        keyShortcut += ")";
    }
    return title + keyShortcut;
}
