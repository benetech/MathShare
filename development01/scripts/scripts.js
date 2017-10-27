//***************************************************************************************************************************************************
// GLOBAL VARIABLES
	// Global var to share the representation used for crossouts
	CrossoutTeXString = "\\enclose{updiagonalstrike downdiagonalstrike}[2px solid red]";


//***************************************************************************************************************************************************
// RESIZE MODAL SIZE BASED ON BROWSER HEIGHT
function ResizeModalEditorHeight() {
	let windowHeight = $(window).height();
	
	if (windowHeight < 600) {
		$('.mathHistory').css('height','175');
	} else {
		$('.mathHistory').css('height','300');
	}
}


//***************************************************************************************************************************************************
// RENDER ACTIVE MATH EDITOR
function RenderMathEditor() {
	TheActiveMathField = MathLive.makeMathField(
		document.getElementById('mathEditorActive'),
	  	{commandbarToggle: 'hidden',
		 overrideDefaultInlineShortcuts: false,
		 inlineShortcuts: { '>-': '>-',			// override builtin shortcut (\succ)
							'<-': '<-'},		// override builtin shortcut (\leftarrow)
         // onSelectionDidChange: UpdatePalette
		}
	);
	document.onkeydown = HandleKeyDown;
}

//***************************************************************************************************************************************************
/**
Convert number to ordinal -- checked with NVDA that 2nd will read as "second", etc.
From https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
The rules are as follows:
	st is used with numbers ending in 1 (e.g. 1st, pronounced first)
	nd is used with numbers ending in 2 (e.g. 92nd, pronounced ninety-second)
	rd is used with numbers ending in 3 (e.g. 33rd, pronounced thirty-third)
	As an exception to the above rules, all the "teen" numbers ending with 11, 12 or 13 use -th (e.g. 11th, pronounced eleventh, 112th, pronounced one hundred [and] twelfth)
	th is used for all other numbers (e.g. 9th, pronounced ninth).
**/
function OrdinalSuffix(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

// build a row of history
function HTMLForRow(stepNumber, math, annotation) {
	let result = '<div class="row mathStep" role="heading" aria-level="3" data-step="'+stepNumber+'" data-equation="'+math+'" data-annotation="'+annotation+'">';
	result += '<span class="SROnly">' + OrdinalSuffix(stepNumber) +' step</span>';
	result +=  '<div class="col-md-2" aria-hidden="true" >Step '+stepNumber+':</div>';
	result +=  '<div class="col-md-5 staticMath" role="heading" aria-level="4">$$'+math+'$$</div>';
	result +=  '<div class="col-md-5" role="heading" aria-level="4">'+annotation+'</div>';
	result += '</div>';
	return result;
}

// POPULATE EDITOR WINDOW
function PopulateEditorModal(dataObj) {
    //1 Clear existing info in modal
    	ClearEditorModal();
    //2 Get all variables from js objects
    	let originalProblemTitle = dataObj[0].metadata[0].title;
    	let originalProblemVariable = dataObj[0].metadata[0].variableName;
    	let originalProblemEquation = dataObj[1].originalProblem[0].equation;
    	
    	let originalProblemEquationHTML = '<span class="staticMath">$$'+dataObj[1].originalProblem[0].equation+'$$</span>';    	 
    	let originalProblemAnnotation = dataObj[1].originalProblem[0].annotation;    	 
    	let currentEditorEquation = dataObj[2].currentEditor[0].equation;    	 
    	let currentEditorAnnotation = dataObj[2].currentEditor[0].annotation;    	
    	let historyObj = dataObj[3].history;
    	
    	if (originalProblemVariable=="newEditor") {
	    	originalProblemEquation = "";
	    	originalProblemAnnotation = "";
	    	currentEditorEquation = "";
	    	currentEditorAnnotation = "";
	    	historyObj = "";
    	}
    	
    	
    //3 Build HTML HISTORY
    	let htmlHistory = '';
		for (let i = 0; i < historyObj.length; i++) {
			htmlHistory += HTMLForRow(i+1, historyObj[i].equation, historyObj[i].annotation);
	    }
    //3 BUILD HTML TITLE
    	let htmlTitle = 'Original Problem: '+originalProblemEquationHTML+ ', '+originalProblemAnnotation+'';
    	if (originalProblemVariable=="newEditor") {
	    	htmlTitle = ''+originalProblemTitle+'';
	    }
	    	
    //4 POPULATE HTML
    	$('#EditorModal .modal-title').html(htmlTitle);
    	$('#EditorModal .modal-title').data('title', originalProblemTitle );
    	$('#EditorModal .modal-title').data('equation', originalProblemEquation );
    	$('#EditorModal .modal-title').data('annotation', originalProblemAnnotation );
    	
    	$('#EditorModal .mathHistory').html(htmlHistory);
    	$('#mathEditorActive').html(currentEditorEquation);
    	$('#mathAnnotation').val(currentEditorAnnotation);
    //5 RUN RENDER MATH
    	MathLive.renderMathInDocument();
    
    //6 RENDER MATH EDITOR
    	RenderMathEditor();
    	
    //7 Wire up SAVE btn & hide if newEditor
    $('#BtnSave').show();
    $('#BtnSave').click(function() {
	    SaveProblem(CurrentProblem);
	    CloseEditorModal();
    });
    if (originalProblemVariable=="newEditor") {
	     $('#BtnSave').hide();
	}
    
    
    //8 Wire up cancel btn
    $('#BtnCancel').click(function() {
	    if (confirm("Any work on this problem will NOT be saved") == true) {
		    CloseEditorModal();
		}
    });
}
//***************************************************************************************************************************************************
// OPEN EDITOR MODAL
function OpenEditorModal() {
	$('#EditorModal').modal({
    	backdrop: 'static',
		keyboard: false
	});
}

//***************************************************************************************************************************************************
// CLOSE EDITOR MODAL
function CloseEditorModal() {
    $('#EditorModal').modal('hide');
    ClearEditorModal();
}

//***************************************************************************************************************************************************
// CLEAR THE EDITOR MODAL
function ClearEditorModal() {
	//1. Clear Title
	     $('#EditorModal .modal-title').html('');
	     
	//2. Clear History
	     $('#EditorModal .mathHistory').html('');
	     
	//3. Clear Editor 
	     $('#mathEditorActive').html('');
	     
	//4. Clear Annotation
		 $('#mathAnnotation').val('');
	
	//5. Unwire Save Buttons
		$('#BtnSave').unbind('click');
		$('#BtnCancel').unbind('click');
	
	//6. Hide Undo Button
		$('#undoDelete').hide();
}

//***************************************************************************************************************************************************
// RECREATE PROBLEM OBJECT FROM DOM
function SaveProblem(dataObj) {
	//1 Get Variable from DOM
	let originalProblemTitle = $('#EditorModal .modal-title').data('title');
    let originalProblemEquation = $('#EditorModal .modal-title').data('equation');
    let originalProblemAnnotation = $('#EditorModal .modal-title').data('annotation');    	 
    let currentEditorEquation = TheActiveMathField.latex();   	 
    let currentEditorAnnotation = $('#mathAnnotation').val();
    
    let mathStep = $('.mathStep');
	let history_array = [];
	
	$.each(mathStep, function (index, item) {
	    history_array.push( {equation: $(item).data('equation'), annotation: $(item).data('annotation')} );  
	});
	let tempObjName = CurrentProblem[0].metadata[0].variableName;
	window[tempObjName] = 	[{"metadata": [
								{
								"title": originalProblemTitle,
			    				"variableName":tempObjName
			    				}]
    			    		},
							{"originalProblem": [
									{
				    				"equation":originalProblemEquation,
				    				"annotation":originalProblemAnnotation
				    				}]
		    			    },
		    			    {"currentEditor": [
									{
				    				"equation":currentEditorEquation,
				    				"annotation":currentEditorAnnotation
				    				}]
			    			},
			    			{"history": history_array
			    			}];
}

//***************************************************************************************************************************************************
// SET CURRENT PROBLEM TO GLOBAL VARIABLE
var CurrentProblem;
var UndoDeleteStack = [];			// objects on the stack have fields 'latex' and 'annotation'
function SetCurrentProblem(dataObj) {
	CurrentProblem = dataObj;
	UndoDeleteStack = [];
	$('#undoDelete').show();
	//console.log('Current Problem is: '+CurrentProblem[1].metadata[0].title);
}


//***************************************************************************************************************************************************
// CREATE NEW HISTORY ROW FROM CURRENT CONTENT
// @param {mathContent} latex for new active area after being cleaned.
// @return {nothing} No return value
function NewMathEditorRow(mathContent) {
	// assemble the new static area from the current math/annotation
	let mathStepEquation = TheActiveMathField.latex();
	let mathStepAnnotation = $('#mathAnnotation').val();
	let mathStepNumber = $('.mathStep:last').data('step');
	let mathStepNewNumber = mathStepNumber ? mathStepNumber+1 : 1;	// worry about no steps yet

	let result = HTMLForRow(mathStepNewNumber, mathStepEquation, mathStepAnnotation)

	$('.mathHistory').append( result );
	$('.mathHistory').animate({ scrollTop: $('.mathHistory')[0].scrollHeight}, 500);

	MathLive.renderMathInElement( $('.mathStep:last') );
	
	// set the new active math and clear the annotation
	TheActiveMathField.latex(mathContent);
	$('#mathAnnotation').val('');
	
	MathLive.renderMathInDocument();
}
// Creates one or two rows (two if 'mathContent' contains cross outs)
// @param {mathContent} latex for new active area after being cleaned.
// @return {nothing} No return value
function NewRowOrRowsAfterCleanup(mathContent) {
	let cleanedUp = CleanUpCrossouts(mathContent);
	NewMathEditorRow(cleanedUp);
	if ( mathContent!=cleanedUp ) {
		NewMathEditorRow(cleanedUp);
	}
}

//***************************************************************************************************************************************************
// Delete the currently active area and make the last step active...
// Or, put another way...
// Copy the contents of the last step/row into the active area and delete that step/row
// @return {nothing} No return value
function DeleteActiveMath() {
	// nothing to do if there are no steps
	if (!$('.mathStep:last'))
		return;

	UndoDeleteStack.push(
		{ latex: TheActiveMathField.latex(),
		  annotation: $('#mathAnnotation').val()
		});
	$('#undoDelete').show();
	
	// get the contents of the last row/step
	let lastStep = $('.mathStep:last');

	// put the contents of the last row/step into the active/current line
	TheActiveMathField.latex( lastStep.data('equation') );
	$('#mathAnnotation').val( lastStep.data('annotation') );
	
	// ok to delete last row now...
	lastStep.detach();
	
	TheActiveMathField.focus();
}

function UndoDeleteStep() {
	stackEntry = UndoDeleteStack.pop();
	if (stackEntry===undefined)
		return;	// shouldn't happen because button is disabled
	
	if (UndoDeleteStack.length===0)
		$('#undoDelete').hide();
	
	NewMathEditorRow( stackEntry.latex )
	$('#mathAnnotation').val( stackEntry.annotation );
	
	TheActiveMathField.focus();
}

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

const TeXCommands = {
	"sqrt": [false, true],
	"frac": [true, true],
	"dfrac": [true, true],
	"tfrac": [true, true],
	"cfrac": [true, true],
	"binom": [true, true],
	"dbinom": [true, true],
	"tbinom": [true, true],
	"over": [true],
	"atop": [true],
	"choose": [true],
	"enclose": [true, false, true],
	"middle": [true],
	"bigl": [true],
	"Bigl": [true],
	"biggl": [true],
	"Biggl": [true],
	"bigr": [true],
	"Bigr": [true],
	"biggr": [true],
	"Biggr": [true],
	"bigm": [true],
	"Bigm": [true],
	"biggm": [true],
	"Biggm": [true],
	"big": [true],
	"Big": [true],
	"bigg": [true],
	"Bigg": [true],
	"acute": [true],
	"grave": [true],
	"ddot": [true],
	"tilde": [true],
	"bar": [true],
	"breve": [true],
	"check": [true],
	"hat": [true],
	"vec": [true],
	"dot": [true],
	"hspace": [true],
	"mathop": [true],
	"mathbin": [true],
	"mathrel": [true],
	"mathopen": [true],
	"mathclose": [true],
	"mathpunct": [true],
	"mathord": [true],
	"mathinner": [true],
	"operatorname": [true],
	"mathrm": [true],
	"mathit": [true],
	"mathbf": [true],
	"bf": [true],
	"it": [true],
	"mathbb": [true],
	"mathcal": [true],
	"mathfrak": [true],
	"mathscr": [true],
	"mathsf": [true],
	"mathtt": [true],
	"Bbb": [true],
	"bold": [true],
	"frak": [true],
	"boldsymbol": [true],
	"bm": [true],
	"mbox": [true],
	"text": [true],
	"textrm": [true],
	"textsf": [true],
	"texttt": [true],
	"textnormal": [true],
	"textbf": [true],
	"textit": [true],
	"emph": [true],
	"em": [true],
	"color": [true],
	"textcolor": [true],
	"overline": [true],
	"underline": [true],
	"overset": [true, true],
	"underset": [true, true],
	"stackrel": [true, true],
	"stackbin": [true, true],
	"rlap": [true],
	"llap": [true],
	"mathrlap": [true],
	"boxed": [true],
	"colorbox": [true, true],
	"fcolorbox": [true, true, true],
	"bbox": [false, true],
	"enclose": [true, false, true],
	"cancel": [true],
	"bcancel": [true],
	"xcancel": [true],
	"begin": [true],
	"end": [true],
};


// ReplaceTeXCommands is NOT a real TeX parser and it just does enough to grab 
// meaningful TeX substrings from a string 
// @param {string} string to search
// @param {int} the optional starting point to search (default: 0)
// @param {dictionary} {"command": {'pattern':"replace pattern", 'defaults': ["...", ...]}, ...}
//		'command': TeX command name (e.g., "frac")
//      'replace pattern': replacement as in a reg expr (e.g., "($1)/($2)", where the arg is substituted into '$1')
// 		'defaults': if one of the commands has optional args and no arg is given, what default should be used
//					(e.g, for \sqrt{2}, it is missing the index, a default could be "2")
//					There should one entry for each optional arg. If there are none, "" is used
//		If 'replace pattern' is empty, the command will be deleted.
// @return {string} a string where TeX commands in 'replacePattern' are replaced with the pattern
// @throws {string} if {}s or []s don't match
function ReplaceTeXCommands(str, replacePatterns) {
	function stackTop(parseStack) {
		return parseStack[parseStack.length-1];
	}
	
	let result = "";
	const  len = str.length;
	let braceCount = 0;								// changed when processing command args ({}s)
	let i = 0;
	let iReplaceStart = 0;
	let parseStack = [];
	let expectingOpen = false;						// parsing command args--next ch should be { or [
	while( i<len ) {
		// FIX: if (expectingOpen) grab next non-whitespace char (mathlive always adds {}s???
		if ( parseStack.length===0 ) {
			// not processing a TeX command, so no need to worry about {} or [] -- skip to command
			i = str.indexOf('\\', i);
			if ( i===-1) {
				i = len;							// no more commands, we're done
				break;
			}
		}
			
		// Note: we can only have {} and [] at this point if we are in a command
		switch (str.charAt(i)) {
		case '{': {
			// check to see if there should have been an optional arg and do replacement if so
			let top = stackTop(parseStack);
			if ( braceCount===top.nestingLevel && !top.args[top.iArg] ) {
				top.replacement = top.replacement.replace(
										new RegExp('\\$'+top.iArg, 'g'),
										top.defaultValues.shift() || "" );
				top.iArg++;
			}
			if ( braceCount===top.nestingLevel )
				stackTop(parseStack).iArgStart = i+1;
			expectingOpen = false;
			braceCount++;
			break;
		}
		case '[':
			// note: optional args can't be nested
			if ( braceCount===top.nestingLevel )
				stackTop(parseStack).iArgStart = i+1;
			expectingOpen = false;
			break;
			
		case '}':
			braceCount--;
		case ']': {
			let top = stackTop(parseStack);
			if ( braceCount>top.nestingLevel )
				break;
			if ( braceCount<top.nestingLevel )
				throw ("Bad TeX syntax: extra '}' found");
			
			// back to balanced -- do replacement
			if ( str.charAt(i)===']' ) {
				if ( top.args[top.iArg] )					// true if required arg ({...})
					throw ("Bad TeX syntax: expected '{arg}' but found '[arg]'");
			}
			top.replacement = top.replacement.replace(
									new RegExp('\\$'+top.iArg, 'g'),
									str.slice(top.iArgStart, i) );
			top.iArg++;
			if (top.iArg==top.args.length) {
				// processed all the args, done with command
				result += top.replacement;
				iReplaceStart = i+1;
				parseStack.pop();
			}
			break;
		}
		case '\\': {
			// get command name
			const iNameStart=i+1;
			let iNameEnd = iNameStart;
			for( let ch=str.charAt(iNameEnd); /[a-zA-Z]/.test(ch); iNameEnd++ ) // skip letters
				ch = str.charAt(iNameEnd);
			if ( iNameEnd>iNameStart )
				iNameEnd--;								// back up to end of name
			// note: loop might exit immediately for escaped chars, but the following still works
			const commandName = str.slice(iNameStart, iNameEnd);
			const commandArgs = TeXCommands[commandName];// see if it is a TeX command with args
			
			i = iNameEnd-1;
			if (!commandArgs)
				break;								// search some more
						
			replacePattern = replacePatterns[commandName];
			if (replacePattern) {
				// found a command we care about -- push on stack so args get handled
				if ( parseStack.length===0 ) {
					result += str.slice(iReplaceStart, iNameStart-1);	// add on stuff up to command
				}

				parseStack.push( {args: commandArgs,
								  iArg: 0,
								  nestingLevel: braceCount,
								  defaultValues: replacePattern.defaults || [],
								  replacement: replacePattern.pattern || "",
								  iArgStart: iNameEnd+1
								 } );
				expectingOpen = true;
			}
			break;
		}
		default:										// normal char
			break;
		}
		
		i++;
	}
	
	return result + str.slice(iReplaceStart, i);
}


//***************************************************************************************************************************************************
// Remove crossouts (without considering replacement) from a string
//    where crossout is \enclose{updiagonalstrike downdiagonalstrike}[..]{...}
// @param {string} The LaTeX string to be cleaned
// @param {object} [optional] {erase: boolean [false]} -- either delete the crossout or erase the crossout (leave contents)
// @return {string} The string with the crossouts removed
function CleanUpCrossouts(latexStr, options) {
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
	options = options || {erase:false};
	let result;
	if (options.erase) {
		result = ReplaceTeXCommands( latexStr, { "enclose": {pattern: "$2"} } );		
	} else {									 // delete
		const replaceChar = '\uFFFD';			// temporary replacement char -- can't be in latexStr
		result = ReplaceTeXCommands( latexStr,
										{ "enclose": {pattern: replaceChar},
										  "underset": {pattern: "{$0}"},
										  "overset": {pattern: "{$0}"}
										} );
		
		// if there are any cross out patterns that use sub/superscripts for replacements, fix them
		result = result.replace( new RegExp(replaceChar+'(\\^|_)?', 'g'), "" );
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

//***************************************************************************************************************************************************
// Grab the selection, remove any cross outs, and then do any binary arithmetic operations.
// If anything is done, cross out the selection and add the calculated result after it.
// Otherwise, alert that no calculations could be done.
// @param {element} element being operated on (currently ignored, uses 'TheActiveMathField' instead)
// @return {nothing} No return value

function CalculateAndReplace(element) {
	
	let doCalculation = function(latex) {
		// Return either the calculated result (as a string) or an empty string if can't calculate
		// Start by converting various character points into one set
		let expr = latex.replace(/\\times/g, '*')
					 .replace(/\\cdot/g, '*')
					 .replace(/\\div/g, '/')
					 .replace(/\^/g, '**');
		
		// now deal with the ones that are TeX commands
		expr = ReplaceTeXCommands( expr,
									{ "frac": {pattern: "(($0)/($1))"},
									  "sqrt": {pattern: "(($1)**(1/($0)))", defaults: ["2"]}
									} );
									
		// replace any {}s with ()s -- e.g, deals with 3^{4+5)					
		expr = expr.replace(/\{/g, '(').replace(/\}/g, ")");
		
		// handle implied multiplication -- two cases (...)(...) and number (...) are common
		// note that fractions and roots have been converted to have parens around them
		expr = expr.replace(/\)\(/g, ")*(").replace(/(\d)\(/g, "$1*(")
							
		// make sure there are numbers AND operators
		if ( !(/[\d.]/.test(expr) && /[+\-*/@]/.test(expr)) ) {
			return "";
		}
		// avoid security issues, etc., and rule out letters, etc, that can be part of JS program
		if ( /[a-zA-Z<=>]/.test(expr) ) {
			return "";
		}
		
		try {
			let result = eval(expr);
			let rounded = Math.round(result);
			return Math.abs(result-rounded)<1e-15 ? rounded : result;
		} catch(e) {
			return "";
		}
	}
	
	if ( TheActiveMathField.selectionIsCollapsed() ) {
		return alert( "You must select an arithmetic expression for calculation." );
	}
	
	let selection = TheActiveMathField.selectedText('latex');
	let result = doCalculation( CleanUpCrossouts(selection) );
	if (!result) {
		return alert( "Selection must contain only numbers and operators.");
	}
	
	// leave crossouts in selection so it is clearer what was the input to the calculation
	let insertionString = CrossoutTeXString + "{" + selection + "}" + result;

	TheActiveMathField.perform(['insert', insertionString, 
				{insertionMode: 'replaceSelection',
				 selectionMode: 'after'}]);
	TheActiveMathField.focus();
}

//***************************************************************************************************************************************************
// Paste the button into the active math editor after substituting
// for the black and white squares
// @param {element} element being operated on (currently ignored, uses 'TheActiveMathField' instead)
// @return {nothing} No return value
function MathLivePasteFromButton(element) {
	// Button contents as a string
    let insertionString = MathLive.getOriginalContent(element).
		replace(/\$\$/g,'').
		replace('\\blacksquare','#0').
		replace('\\square','#?').
		trim();

	if ( !TheActiveMathField.selectionIsCollapsed() ) {
		let erasedInsertionString = CleanUpCrossouts( insertionString, {erase:true} );
		if ( erasedInsertionString!==insertionString ) {
			// the insertionString contains a cross out, erase all crossout in the selection
			let selection = CleanUpCrossouts( TheActiveMathField.selectedText('latex'), {erase:true} );

		// stick the modified selection into the black square (#0) in the insertionString
			insertionString = insertionString.replace(/#0/, selection);
		}
	}

	TheActiveMathField.perform(['insert', insertionString, 
				{insertionMode: 'replaceSelection',
				 selectionMode: 'placeholder'}]);
	TheActiveMathField.focus();
}


//***************************************************************************************************************************************************
// Call paste function if someone hits enter over palette entry
// Important for accessibility
// @param {event} key event that triggered this function
// @return {bool} true if handled, otherwise false
function MathLivePasteFromButtonKeyDown(event, element) {
	if (event.key == "Enter") {
		MathLivePasteFromButton(element);
		return false;
	} else
		return true;
}

//***************************************************************************************************************************************************
// Update the palette with the current selection for the active math editor
// Reset the palette when the selection is just an insertion cursor
// @param mathField -- the active math editor called on 'onSelectionDidChange'
function UpdatePalette(mathField) {
	if (mathField.mathlist) {
		let origSelection = mathField.selectedText('latex')
		let cleanedSelection = CleanUpCrossouts( origSelection, {erase:true} );	// selection without crossouts (pre-compute)

		// probably only one palette, but future-proof and handle all
		// for every button in all the palettes...
		//   substitute in the latex for the black square and use that for the rendering
		// this could be more efficient by not making a change if the selection didn't change,
		//   but this seems efficient enough. It could be that mathlive already does this optimization
		// Note: the original value remains stored in a data attr and that value works
		//   regardless of the selection because the 'insert' command replaces the selection
		let templates = $('.paletteButton');
		for (let iTemplate=0; iTemplate<templates.length; iTemplate++) {
			let elem = templates[iTemplate];
			const mathstyle = elem.getAttribute('data-' + /*options.namespace +(*/ 'mathstyle') || 'displaystyle';
			try {
				let newContents = MathLive.getOriginalContent(elem);
				if (!newContents)
					continue;
				newContents = newContents.replace(/\$\$/g,'')	// remove $$'s
				
				if (origSelection) {
					// we have latex for the selection, so substitute it in
					// if both have cross outs, remove them from the selection
					// this matches the behavior on activation
					let selection = newContents.includes(CrossoutTeXString) ? cleanedSelection : origSelection;
					newContents = newContents.replace('\\blacksquare', selection);
				}							
				elem.innerHTML = MathLive.latexToMarkup(newContents, mathstyle);
			} catch (e) {
				console.error(
					"Could not parse'" + 
					MathLive.getOriginalContent(elem).
						replace(/\$\$/g,'').
						replace('\\blacksquare',selection) + "'"
				);
			}
		}			
	}
}

//***************************************************************************************************************************************************
function HandleKeyDown(event)
{
	if (event.shiftKey && (event.key=="Delete" || event.key=="Backspace")) {
		if ( TheActiveMathField.selectionIsCollapsed() ) {
			// if an insertion cursor, extend the selection unless we are at an edge
			if ( TheActiveMathField.selectionAtStart() && event.key=="Backspace" )
				return false;
			if ( TheActiveMathField.selectionAtEnd() && event.key=="Delete" )
				return false;
		
			TheActiveMathField.perform(event.key=="Delete" ? 'extendToNextChar' : 'extendToPreviousChar');
		}
		
		let selection = CleanUpCrossouts( TheActiveMathField.selectedText('latex'), {erase:true} );
		let insertionString = CrossoutTeXString + "{" + selection + "}";
		TheActiveMathField.perform(['insert', insertionString, 
								    {insertionMode: 'replaceSelection',
									 selectionMode: 'item'}]);
		TheActiveMathField.focus();
		return false;
	}
	return true;
}
