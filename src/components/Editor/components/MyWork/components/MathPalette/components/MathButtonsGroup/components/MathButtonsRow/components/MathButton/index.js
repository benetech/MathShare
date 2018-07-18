import React, { Component } from "react";
import Button from '../../.././../../../../../../../../Button';
import classNames from "classnames";
import mathButton from './styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import teXCommands from './teXCommands.json'
import {NotificationManager} from 'react-notifications';

//***************************************************************************************************************************************************
// TeX commands
// The following list is taken from http://mathlive.io/sprint15/reference.html?frequency=0
//   that will likely change, so this probably will need to be updated.
// A TeX command has the rough syntax
//    \name {required arg} [optional arg]
// where there can be any number of required or optional args in any order.
// Note:  required args are single
// To accomodate this, we use the a the global TeXCommands which is a dictionary with the following
// structure:
//    name: string
//    args: array of true(required)/false(optional) for the arguments
// By default, if a name is not listed, it is assumed to have no arguments (e.g., \pi).
// Example: \sqrt[3]{10} (cube root of 10) :  "sqrt" args: [false, true]}

export default class MathButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // Global var to share the representation used for crossouts
            // The crossout style properties are defined in CSS styles file
            CrossoutTeXString: "\\enclose{updiagonalstrike downdiagonalstrike}[2px solid blue]",
            UpdateMathFieldMode: false
        }
    }


    getFunctionsById(ids) {
        return function () {
            if (ids.includes("MathLivePasteFromButton")) {
                this.MathLivePasteFromButton();
            }
            if (ids.includes("GoogleAnalytics")) {
                GoogleAnalytics(this.props.button.title)
            }
            if (ids.includes("CalculateAndReplace")) {
                this.CalculateAndReplace();
            }
        }
    }

    buildButtonTitle() {
        var title = this.props.button.title;
        var keys = this.props.button.keys;
        var keyShortcut = "";
        if (keys) {
            keyShortcut += " (⌨: ";
            keyShortcut += keys.join("+");
            keyShortcut += ")";
        }
        return title + keyShortcut;
    }

    buildClassNames() {
        var commonClasses = this.props.palette.commonClass;
        var additionalClasses = this.props.button.additionalClass;
        if (!commonClasses) {
            commonClasses = "";
        }
        if (!additionalClasses) {
            additionalClasses = "";
        }
        var classes = commonClasses.split(" ").concat(additionalClasses.split(" "));
        var result = [];
        classes.forEach(function (clazz) {
            result.push(mathButton[clazz]);
        });
        return classNames(bootstrap.btn, result);
    }

    render() {
        const title = this.buildButtonTitle();
        var functionIds = []
        if (this.props.palette.commonOnclick) {
            functionIds = functionIds.concat(this.props.palette.commonOnclick);
        }
        if (this.props.button.additionalOnclick) {
            functionIds = functionIds.concat(this.props.button.additionalOnclick);
        }
        const functions = this.getFunctionsById(functionIds, null, null);

        return (
            <span role="listitem">
                <Button
                    id={this.props.id}
                    className={this.buildClassNames()}
                    data-toggle="tooltip"
                    title={title}
                    content={this.props.button.value}
                    onClick={functions.bind(this)}
                />
                <span className="sr-only">{title}</span>
            </span>
        );
    }

    //***************************************************************************************************************************************************
    // Paste the button into the active math editor after substituting
    // for the black and white squares
    // @param {element} element being operated on (currently ignored, uses 'TheActiveMathField' instead)
    // @return {nothing} No return value
    MathLivePasteFromButton() {
        var theActiveMathField = this.props.theActiveMathField;
        // Button contents as a string
        let insertionString = this.props.button.value.
            replace(/\$\$/g, '').
            replace('\\blacksquare', '#0').
            replace('\\square', '#?').
            trim();

        if (!theActiveMathField.selectionIsCollapsed()) {
            let erasedInsertionString = this.constructor.CleanUpCrossouts(insertionString, { erase: true });
            if (erasedInsertionString !== insertionString) {
                // the insertionString contains a cross out, erase all crossout in the selection
                let selection = this.constructor.CleanUpCrossouts(theActiveMathField.selectedText('latex'), { erase: true });

                // stick the modified selection into the black square (#0) in the insertionString
                insertionString = insertionString.replace(/#0/, selection);
            }
        }

        theActiveMathField.perform(['insert', insertionString,
            {
                insertionMode: 'replaceSelection',
                selectionMode: 'placeholder'
            }]);
        $("#mathAnnotationHeader").focus();
        $('#mathEditorActive').height(theActiveMathField.element.scrollHeight);
        $('#mathAnnotation').height(theActiveMathField.element.scrollHeight);
        theActiveMathField.focus();
    }

    CalculateAndReplace() {
        var theActiveMathField = this.props.theActiveMathField;
        let doCalculation = function (latex) {
            // Return either the calculated result (as a string) or an empty string if can't calculate
            // Start by converting various character points into one set
            let expr = latex.replace(/\\times/g, '*')
                .replace(/\\cdot/g, '*')
                .replace(/\\div/g, '/')
                .replace(/\^/g, '**');

            // now deal with the ones that are TeX commands
            expr = ReplaceTeXCommands(expr, {
                "frac": { patterns: "(($0)/($1))" },
                "sqrt": { patterns: "(($1)**(1/($0)))", defaults: ["2"] }
            });

            // replace any {}s with ()s -- e.g, deals with 3^{4+5)
            expr = expr.replace(/\{/g, '(').replace(/\}/g, ")");

            // handle implied multiplication -- two cases (...)(...) and number (...) are common
            // note that fractions and roots have been converted to have parens around them
            expr = expr.replace(/\)\(/g, ")*(").replace(/(\d)\(/g, "$1*(")

            // make sure there are numbers AND operators
            if (!(/[\d.]/.test(expr) && /[+\-*/@]/.test(expr))) {
                return "";
            }
            // avoid security issues, etc., and rule out letters, etc, that can be part of JS program
            if (/[a-zA-Z<=>]/.test(expr)) {
                return "";
            }

            try {
                let result = eval(expr);
                let rounded = Math.round(result);
                return Math.abs(result - rounded) < 1e-15 ? rounded : result;
            } catch (e) {
                return "";
            }
        }

        if (theActiveMathField.selectionIsCollapsed()) {
            NotificationManager.warning('You must select an arithmetic expression for calculation', 'Warning');
            return;
        }

        let selection = theActiveMathField.selectedText('latex');
        let result = DoCalculation(this.constructor.CleanUpCrossouts(selection));
        if (result === "") {
            NotificationManager.warning('Selection must contain only numbers and operators', 'Warning');
            return;
        }

        // leave crossouts in selection so it is clearer what was the input to the calculation
        let insertionString = this.state.CrossoutTeXString + "{" + selection + "}" + result;

        theActiveMathField.perform(['insert', insertionString,
            {
                insertionMode: 'replaceSelection',
                selectionMode: 'after'
            }]);
        theActiveMathField.focus();
    }

    //***************************************************************************************************************************************************
    // Remove crossouts (without considering replacement) from a string
    //    where crossout is \enclose{updiagonalstrike downdiagonalstrike}[..]{...}
    // @param {string} The LaTeX string to be cleaned
    // @param {object} [optional] {erase: boolean [false]} -- either delete the crossout or erase the crossout (leave contents)
    // @return {string} The string with the crossouts removed
    static CleanUpCrossouts(latexStr, options) {
        // FIX: a proper "compass adornment" feature for MathLive doesn't exist yet.
        // Right now, code looks for:
        //   crossout^replacement
        //   crossout_replacement
        //   \overset{replacement}{crossout}
        //   \underset{replacement}{crossout}
        // where crossout is \enclose{updiagonalstrike downdiagonalstrike}[..]{...}
        // This is missing compass points NW, W, SW, E
        // If a replacement pattern isn't found, the crossout is removed
        // FIX: this would be easier/less error prone if we use MathML (not yet implemented)
        // FIX: there are  places where whitespace is legal but not checked (eg, around optional '^')
        options = options || { erase: false };
        let result;
        if (options.erase) {
            result = ReplaceTeXCommands(latexStr, { "enclose": { patterns: "$2" } });
        } else { // delete
            const replaceChar = '\uFFFD'; // temporary replacement char -- can't be in latexStr
            const notReplaceChar = '[^' + replaceChar + ']+';
            result = ReplaceTeXCommands(latexStr, { "enclose": { patterns: replaceChar } });

            // if there are any cross out patterns that use sub/superscripts for replacements, fix them
            result = result.replace(new RegExp(replaceChar + '(\\^|_)?', 'g'), "");

            // elmininate extra level of '{}'s which messes up other matches -- comes from {replaceChar} -> {}
            result = result.replace(new RegExp('{{}}', 'g'), "{}");


            // now do the same for underset, overset, and clean up fractions
            result = ReplaceTeXCommands(result,
                {
                    "underset": {
                        patterns: [
                            { match: [".*", replaceChar], replacement: "{$0}" }
                        ]
                    },
                    "overset": { patterns: [{ match: [".*", replaceChar], replacement: "{$0}" }] },
                    "frac": {
                        patterns: [
                            { match: ["", ""], replacement: "\\frac{1}{1}" },
                            { match: ["", ".+"], replacement: "\\frac{1}{$1}" },
                            { match: [".+", ""], replacement: "\\frac{$0}{1}" }
                        ]
                    },
                    // used for "stacks"
                    "begin": {
                        patterns: [
                            { match: ["array", "r", /*"^(\\+|-)?\\d*\\.?\\d* \\\\\\\\ (\\+|-)?\\d*\\.?\\d*$"*/".*"], replacement: "`$2`" }
                        ]
                    },
                    "end": { patterns: [{ match: ["array"], replacement: "" }] }
                });
        }

        return result;

        /** FIX: Not handling these yet
            let prescriptsRE = new RegExp(
                "\\\\,\\{\\}(?:\\^|_)([^\\{]|[a-z]+|\\{.+?\\})" + CrossoutRegExpPattern,
                "g");
            prescriptsRE = new RegExp(
                "\\\\,\\{\\}(?:\\^|_)([^\\{]|[a-z]+|\\{.+?\\})" + CrossoutRegExpPattern,
                "g");
            latexStr = latexStr.replace(prescriptsRE, "$1");
            return latexStr.replace(new RegExp(CrossoutRegExpPattern, "g"), "");
        **/
    }
}

function GoogleAnalytics(action) {
    //TODO: Google Analitics - probably should be available to other components
    /*ga('send', {
        hitType: 'event',
        eventCategory: 'Editor',
        eventAction: action,
        eventLabel: ''
    });*/
}

//***************************************************************************************************************************************************
// Grab the selection, remove any cross outs, and then do any binary arithmetic operations.
// If anything is done, cross out the selection and add the calculated result after it.
// Otherwise, alert that no calculations could be done.
// @param {element} element being operated on (currently ignored, uses 'TheActiveMathField' instead)
// @return {nothing} No return value

function DoCalculation(latex) {
    // Return either the calculated result (as a string) or an empty string if can't calculate
    // Start by converting various character points into one set
    let expr = latex.replace(/\\times/g, '*')
        .replace(/\\cdot/g, '*')
        .replace(/\\div/g, '/')
        .replace(/−/g, '-') // U2212 -> ASCII minus
        .replace(/\^/g, '**');

    // now deal with the ones that are TeX commands
    expr = ReplaceTeXCommands(expr, {
        "frac": { patterns: "(($0)/($1))" },
        "sqrt": { patterns: "(($1)**(1/($0)))", defaults: ["2"] }
    });

    // replace any {}s with ()s -- e.g, deals with 3^{4+5)
    expr = expr.replace(/\{/g, '(').replace(/\}/g, ")");

    // handle implied multiplication -- two cases (...)(...) and number (...) are common
    // note that fractions and roots have been converted to have parens around them
    expr = expr.replace(/\)\(/g, ")*(").replace(/(\d)\(/g, "$1*(")

    // stacked exprs are separated with '\\' -- consider that as addition
    expr = expr.replace(/\\\\/g, " + ");

    // make sure there are numbers AND operators
    if (!(/[\d.]/.test(expr) && /[+\-*/@]/.test(expr))) {
        return "";
    }
    // avoid security issues, etc., and rule out letters, etc, that can be part of JS program
    if (/[a-zA-Z<=>]/.test(expr)) {
        return "";
    }

    try {
        let result = eval(expr);
        let rounded = Math.round(result);
        return Math.abs(result - rounded) < 1e-15 ? rounded : result;
    } catch (e) {
        return "";
    }
}

// ReplaceTeXCommands is NOT a real TeX parser and it just does enough to grab
// meaningful TeX substrings from a string
// @param {string} string to search
// @param {int} the optional starting point to search (default: 0)
// @param {dictionary} commands to match and what to replace them with. The form of the dictionary is:
//		{"command": {'patterns':[match/replacement, match/replacement, ...],
//					 'defaults': ["...", ...]},   ...}
//		'command': TeX command name (e.g., "frac")
//		'patterns' An array of {match, replacement} -- the first match found uses the replacement
//			As a shorthand, if 'patterns' is a string, it is the same as
//				[{matches: ".*", replacement: string}]
//			'match' -- an array (one per required/default argument) of reg exp match patterns
//					  (default: match any)
//			'replacement' - a reg exp pattern describing what to do with the arguments
//						    if replacement starts and ends with `'s (e.g., `$0+$1`), it is evaluated
//			Note: because regular expressions can't handle nested {}s (etc),
//				{}s should be avoided in the matches
// 		'defaults': if one of the commands has optional args and no arg is given, what default should be used
//					(e.g, for \sqrt{2}, it is missing the index, a default could be "2")
//					There should one entry for each optional arg. If there are none, "" is used
//		If 'replace pattern' is empty or no pattern matches, the command and its args will be deleted.
// @return {string} a string where TeX commands in 'replacements' dict are replaced
//					with 'replacement' if the 'match' is true
// @throws {string} if {}s or []s don't match
function ReplaceTeXCommands(str, replacements) {
    function stackTop(parseStack) {
        return parseStack[parseStack.length - 1];
    }

    function MatchAndReplace(topOfStack, str, i) {
        // For each pattern, see if the first arg in that pattern matches the TeX arg.
        //	 matches: do the replacement, remove that first arg (already matched)
        //   doesn't match: remove the pattern from the array (don't add to new array)
        // Because elements are removed and we don't want undefined elements, we build a new array
        let texArg = str.slice(topOfStack.iArgStart, i);
        let newPatterns = [];		// patterns that matched with their replacements
        topOfStack.patterns.forEach(function (pattern) {
            // if the reg exp is "", it matches anything, so we need to deal with that case
            let firstPattern = pattern.match[0];
            if ((firstPattern.length === 0 && texArg.length === 0) ||
                (firstPattern.length > 0 && new RegExp(pattern.match[0]).test(texArg))) {
                newPatterns.push({
                    match: pattern.match.slice(1),
                    replacement: pattern.replacement.replace(
                        new RegExp('\\$' + topOfStack.iArg, 'g'),
                        texArg)
                });
            }
        });
        topOfStack.patterns = newPatterns;
    }

    function ReplaceInStr(top, str, i) {
        if (top.patterns.length > 0) {
            let replacement = top.patterns[0].replacement;
            if (replacement[0] === '`' && replacement[replacement.length - 1] === '`') {
                // if eval fails, don't want `` in replacement
                replacement = replacement.slice(1, -1);
                // evaluate the contents
                let evalResult = DoCalculation(replacement);
                if (evalResult !== "") {
                    replacement = evalResult == 0 ? "" : evalResult;	// don't show '0'
                }
            }
            str = str.substring(0, top.iCommandStart) + replacement + str.substring(i + 1);
            i = top.iCommandStart + replacement.length - 1;
        }
        return [str, i]
    }

    let braceCount = 0;	// changed when processing command args ({}s)
    let i = 0;
    let parseStack = [];
    let expectingOpen = false; // parsing command args--next ch should be { or [

    // Loop through the string looking for {}s, []s, and \commands
    // If a command is found, info about the command and its location in the string are pushed on the stack
    // When arguments match the patterns inside of the brackets and all args processed,
    //   replace that part of the string with the filled-in replacement and pop the stack
    while (i < str.length) {
        // FIX: if (expectingOpen) grab next non-whitespace char (mathlive always adds {}s???
        if (parseStack.length === 0) {
            // optimization...
            // not processing a TeX command, so no need to worry about {} or [] -- skip to command
            let iBackSlash = str.indexOf('\\', i);
            if (iBackSlash === -1) {
                i = str.length; // no more commands, we're done
                break;
            }
            if (iBackSlash + 1 < str.length && str[iBackSlash + 1] !== '\\') { // avoid escaped '\'
                i = iBackSlash;
            } else {
                i = iBackSlash + 2;	// after escaped '\'
            }
        }

        // Note: we can only have {} and [] at this point if we are in a command
        switch (str.charAt(i)) {
            case '{': {
                // check to see if there should have been an optional arg and do replacement if so
                let top = stackTop(parseStack);
                if (braceCount === top.nestingLevel && !top.args[top.iArg]) {
                    let defaultValue = top.defaultValues.shift() || "";
                    // substitute in default value into replacement for each pattern/replacement
                    top.patterns.forEach(
                        function (pattern) {
                            pattern.replacement = pattern.replacement.replace(
                                new RegExp('\\$' + top.iArg, 'g'),
                                defaultValue);
                        });
                    top.iArg++;
                }
                if (braceCount === top.nestingLevel)
                    top.iArgStart = i + 1;
                expectingOpen = false;
                braceCount++;
                break;
            }
            case '[': {
                // note: optional args can't be nested
                let top = stackTop(parseStack);
                if (braceCount === top.nestingLevel)
                    top.iArgStart = i + 1;
                expectingOpen = false;
                break;
            }
            case '}':
                braceCount--;
            case ']': {
                let top = stackTop(parseStack);
                if (braceCount > top.nestingLevel)
                    break;
                if (braceCount < top.nestingLevel)
                    throw ("Bad TeX syntax: extra '}' found");

                // back to balanced -- do replacement
                if (str.charAt(i) === ']') {
                    if (top.args[top.iArg])					// true if required arg ({...})
                        throw ("Bad TeX syntax: expected '{arg}' but found '[arg]'");
                }

                MatchAndReplace(top, str, i);
                top.iArg++;
                if (top.iArg == top.args.length) {
                    // processed all the args, done with command
                    [str, i] = ReplaceInStr(top, str, i);
                    // else if no match do nothing
                    parseStack.pop();
                } else if (top.isBegin && top.iArg + 1 === top.args.length) {
                    top.iArgStart = i + 1;
                }
                break;
            }
            case '\\': {
                // get command name
                let iNameStart = i + 1;
                if (str.charAt(iNameStart) === '\\') {
                    i++;
                    break;	// escaped '\'
                }
                let iNameEnd = iNameStart;
                for (let ch = str.charAt(iNameEnd); /[a-zA-Z]/.test(ch); iNameEnd++) // skip letters
                    ch = str.charAt(iNameEnd);
                if (iNameEnd > iNameStart)
                    iNameEnd--;								// back up to end of name
                // note: loop might exit immediately for escaped chars, but the following still works
                let commandName = str.slice(iNameStart, iNameEnd);
                const commandArgs = teXCommands[commandName];// see if it is a TeX command with args

                if (commandName == "end" && parseStack.length > 0) {
                    // matching begin/end pair (hopefully) -- process contents of \begin as if it were an arg
                    let top = stackTop(parseStack);
                    if (!top.isBegin) {
                        throw ("Bad TeX syntax: \\end found without matching \\begin");
                    }
                    MatchAndReplace(top, str, i);

                    let iEndOfEnd = str.indexOf('}', i + 1); // wipe out all of \begin...\end{arg}
                    [str, i] = ReplaceInStr(top, str, iEndOfEnd);
                    parseStack.pop();
                    commandName = ''; // processed \end
                } else {
                    i = iNameEnd - 1;
                }
                if (!commandArgs)
                    break; // search some more


                let actions = replacements[commandName];
                if (actions) {
                    // found a command we care about -- push on stack so args get handled
                    if (typeof actions.patterns === "undefined" || typeof actions.patterns === "string") {
                        // simple case -> general case w/'match anything' for all args
                        actions.patterns = [{
                            match: Array(commandArgs.length).fill('.*'),
                            replacement: actions.patterns
                        }];
                    }
                    parseStack.push({
                        args: commandArgs,
                        iCommandStart: iNameEnd - 1 - commandName.length,
                        iArg: 0,
                        nestingLevel: braceCount,
                        defaultValues: actions.defaults || [],
                        patterns: actions.patterns,
                        iArgStart: iNameEnd + 1,
                        isBegin: commandName === "begin"
                    });
                    expectingOpen = true;
                }
                break;
            }
            default: // normal char
                break;
        }

        i++;
    }

    return str;
}
