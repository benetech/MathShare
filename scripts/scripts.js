function readBlob(opt_startByte, opt_stopByte) {
    var files = $('#fileid').get(0).files;
    console.log('files:'+file);
    //var files = document.getElementById('files').files;
    if (!files.length) {
      alert('Please select a file!');
      return;
    }

    var file = files[0];
    console.log('file:'+file);
    var start = parseInt(opt_startByte) || 0;
    console.log('start:'+start);
    var stop = parseInt(opt_stopByte) || file.size - 1;
    console.log('stop:'+stop);

    var reader = new FileReader();

    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
        var uploadedString = evt.target.result;
		var parsedUploadedString = JSON.parse(uploadedString);
		console.log(parsedUploadedString);
		
		ReadFileFinish(parsedUploadedString);
      
      }
    };

    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
  }

function OpenFileUpload() {
  document.getElementById('fileid').click();
}

$(document).ready(function(){
    $('input[type="file"]').change(function(){
        var file = $('#fileid').get(0).files[0];
        readBlob();
    });
});



//***************************************************************************************************************************************************
// GLOBAL VARIABLES
	// Global var to share the representation used for crossouts
	CrossoutTeXString = "\\enclose{updiagonalstrike downdiagonalstrike}[2px solid red]";

//***************************************************************************************************************************************************
// RENDER ACTIVE MATH EDITOR
function RenderMathEditor() {
	TheActiveMathField = MathLive.makeMathField(
		document.getElementById('mathEditorActive'),
	  	{commandbarToggle: 'hidden',
		 overrideDefaultInlineShortcuts: false,
		 inlineShortcuts: { '>-': '>-',			// override builtin shortcut (\succ)
							'<-': '<-',			// override builtin shortcut (\leftarrow)
							'<=': '\\leq',		// use more familiar ≤
							'>=': '\\geq',		// use more familar ≥
							'$': '\\$',			// make it easy to type $
							'%': '\\%',			// make it easy to type %
							'?=': '\\overset{?}{=}'	// is equal to
						  }
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
function HTMLForRow(stepNumber, math, annotation, showTrash) {
	let html = '<div class="row mathStep" data-step="'+stepNumber+'" data-equation="'+math+'" data-annotation="'+annotation+'">';
	html += '<div class="col-md-6">';
	html +=   '<span role="heading" aria-level="3">';
	html +=     '<span class="SROnly">' + OrdinalSuffix(stepNumber) +' step</span>';
	html +=     '<span class="stepHeader" aria-hidden="true">Step '+stepNumber+':</span>';
	html +=   '</span>';
	html +=   '<span class="sr-only" role="heading" aria-level="4"> math: </span>';
	html +=      '<span class="staticMath" >$$'+math+'$$</span>';
	html += '</div>';
	html += '<div class="col-md-5">';
	html +=    '<span class="sr-only"  role="heading" aria-level="4">reason:</span>';
	html +=    '<span class="staticMath">'+annotation+'</span>';
	html += '</div>';
	if (showTrash) { 
		html +=  '<div class="col-md-1 trashButtonContainer" role="heading" aria-level="4" style="text-align: right; float:right;">'+
					'<button class="btn btn-default paletteButton" data-toggle="tooltip" title="Delete this Step" onclick="DeleteActiveMath()" style="margin-bottom: 5px;">' +
						'<i class="fa fa-trash-o" aria-hidden="true"></i>' +
						'<span class="SROnly">Delete ' + OrdinalSuffix(stepNumber) +' step</span>' +
			'</button></div>';
	}
	html += '</div>';
	return html;
}



// Read data file and build a section containing links to open the editor on them
// This is asynchronous, so the funcitonality is broken into two parts
function ReadFileInitiate(fileName) {
	//console.log("ReadFileInitiate: main");
	$.getJSON( fileName, function(data) {ReadFileFinish(data)} )
	.fail( function(data) {
		// fall back sample data -- useful for testing with local files which can't be read
		//console.log("ReadFileInitiate: always");
		ReadFileFinish({
			"metadata": { "title": "Fallback on read failure" },
			"problems": [
				{"metadata": {"title":"Local Prob 1","variableName":"problem01"},
				 "originalProblem": {"equation":"3(-\\frac{1}{6})(-\\frac{2}{5})","annotation":"LOCAL Find the product"},
				 "currentEditor": {"equation":"3(-\\frac{1}{6})(-\\frac{2}{5})","annotation":""},
				 "history": [{"equation":"3(-\\frac{1}{6})(-\\frac{2}{5})","annotation":"Find the product"}]},
				{"metadata": {"title":"Local Prob 2",    "variableName":"problem02"},		 
				 "originalProblem": {"equation":"-\\frac{2}{5}(-\\frac{1}{2})(-\\frac{5}{6})", "annotation":"LOCAL Find the product"},
				 "currentEditor": {"equation":"-\\frac{2}{5}(-\\frac{1}{2})(-\\frac{5}{6})",    "annotation":""},
				 "history": [{"equation":"-\\frac{2}{5}(-\\frac{1}{2})(-\\frac{5}{6})",    "annotation":"LOCAL Find the product"}]},
				{"metadata": {"title":"Local Prob 3",    "variableName":"problem03"},
				 "originalProblem": {"equation":"\\frac{55}{\\frac{1}{2}}",    "annotation":"LOCAL Find the quotient"},
				 "currentEditor": {"equation":"\\frac{55}{\\frac{1}{2}}",    "annotation":""},
				 "history": [{"equation":"\\frac{55}{\\frac{1}{2}}",    "annotation":"LOCAL Find the quotient"}]},
				{"metadata": {"title":"Local Prob 4",    "variableName":"problem04"},
				 "originalProblem": {"equation":"\\frac{3}{10}\\div (\\frac{5}{8})",    "annotation":"LOCAL Find the quotient"},
				 "currentEditor": {"equation":"\\frac{3}{10}\\div (\\frac{5}{8})",    "annotation":""},
				 "history": [{"equation":"\\frac{3}{10}\\div (\\frac{5}{8})",    "annotation":"LOCAL Find the quotient"}]},
				{"metadata": {"title":"Local Prob 5",    "variableName":"problem05"},
				 "originalProblem": {"equation":"",    "annotation":"LOCAL Sarah works at a coffee shop. Her weekly salary is $325 and she earns 11.5% commission on sales. How much does she make if she sells $2800 in merchandise?"},
				 "currentEditor": {"equation":"",    "annotation":""},
				 "history": [{"equation":"",    "annotation":"LOCAL Sarah works at a coffee shop. Her weekly salary is $325 and she earns 11.5% commission on sales. How much does she make if she sells $2800 in merchandise?"}]},
				{ "metadata": {"title":"Local Prob 6",    "variableName":"problem06"},
				 "originalProblem": {"equation":"7x-13=1",    "annotation":"LOCAL Solve for x"},
				 "currentEditor": {"equation":"7x-13=1",    "annotation":""},
				 "history": [{"equation":"7x-13=1",    "annotation":"LOCAL Solve for x"}]},
				{"metadata": {"title":"Local Prob 7",    "variableName":"problem07"},
				 "originalProblem": {"equation":"\\frac{b}{9}-34\\leq -36",    "annotation":"LOCAL Solve the inequality"},
				 "currentEditor": {"equation":"\\frac{b}{9}-34\\leq -36",    "annotation":""},
				 "history": [{"equation":"\\frac{b}{9}-34\\leq -36",    "annotation":"LOCAL Solve the inequality"}]},
				{"metadata": {"title":"LOCAL Try your own problem",    "variableName":"newEditor"},
				 "originalProblem": {"equation":"", "annotation":"LOCAL Try your own problem"},
				 "currentEditor": {},
				 "history": [{}]}
			]
		})
	});
}

// Finish reading the file now that the data is available
function ReadFileFinish(data) {
	//console.log("ReadFileFinish");
	document.getElementById("ContentWrapper").setAttribute(
			"data-galois-metadata",
			JSON.stringify(data.metadata)
		);
	$('#LeftNavigation').empty();
	$('#LeftNavigation').html(PopulateMainPage(data));
	
	MathLive.renderMathInDocument();
}

function ReadFileEmpty() {
	$('#something').empty();
}

// Create all the problems on the main page
// Data for each problem is stored into the argument of the 'onclick' function		
function PopulateMainPage(data) {
	let html = '<ul>';
	html += '<li onclick="SetAndOpenEditorModel(this, example01)">' +
				'<span class="problemAnnotation">Getting Started</span>' +
				'<span class="problemEquation">Click here to see an example problem and learn how to use the editor</span>' + 
			'</li>';
	let problemData = data.problems;
	for (let i=0; i< problemData.length; i++) {
		let problem = problemData[i].originalProblem;
		html += '<li onclick=\'SetAndOpenEditorModel(this, ' + JSON.stringify(problemData[i]) + ')\'>' +
					'<span class="problemAnnotation">' +(i+1) + '. ' + problem.annotation + '</span>' +
					'<span class="problemEquation staticMath">$$' + problem.equation + '$$</span>' + 
				'</li>';
	};
	html += '</ul>';	
	let node = document.createDocumentFragment();
	let child = document.createElement("div");
	child.innerHTML = html;
	node.appendChild(child); 
	return node;
}
		
function SetAndOpenEditorModel(buttonElement, dataObj) {
	PopulateEditorModal(buttonElement, dataObj);
	//MathLive.renderMathInDocument();
}	

// POPULATE EDITOR WINDOW
function PopulateEditorModal(buttonElement, dataObj) {
    //1 Clear existing info in modal
    	ClearEditorModal();
    //2 Get all variables from js objects
    	let originalProblemTitle = dataObj.metadata.title;
    	let originalProblemVariable = dataObj.metadata.variableName;
    	let originalProblemEquation = dataObj.originalProblem.equation;
    	
    	let originalProblemEquationHTML = '<span class="staticMath">$$'+dataObj.originalProblem.equation+'$$</span>';    	 
    	let originalProblemAnnotation = dataObj.originalProblem.annotation;    	 
    	let currentEditorEquation = dataObj.currentEditor.equation;    	 
    	let currentEditorAnnotation = dataObj.currentEditor.annotation;    	
    	let historyObj = dataObj.history;
    	
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
			
			let showTrash = false;
			if (i==historyObj.length-1 && historyObj.length>1) {
				showTrash = true;
			}
			htmlHistory += HTMLForRow(i+1, historyObj[i].equation, historyObj[i].annotation, showTrash);
	    }
    //3 BUILD HTML TITLE
    	let htmlTitle = originalProblemAnnotation;
		if (dataObj.originalProblem.equation)
			htmlTitle += ': '+ originalProblemEquationHTML;
    	if (originalProblemVariable=="newEditor") {
	    	htmlTitle = ''+originalProblemTitle+'';
	    }
	    	
    //4 POPULATE HTML
    	$('#ProblemTitle').html(htmlTitle);
    	$('#ProblemTitle').data('title', originalProblemTitle );
    	$('#ProblemTitle').data('equation', originalProblemEquation );
    	$('#ProblemTitle').data('annotation', originalProblemAnnotation );
    	
    	$('#MathHistory').html(htmlHistory);
    	$('#mathEditorActive').html(currentEditorEquation);
    	$('#mathAnnotation').val(currentEditorAnnotation);
    //5 SCROLL TO BOTTOM OF HISTORY
    	ScrollHistoryToBottom();
    	
    //5 RUN RENDER MATH
    	MathLive.renderMathInDocument();
    
    //6 RENDER MATH EDITOR
    	RenderMathEditor();
    	
    //7 Wire up SAVE btn & hide if newEditor
    $('#BtnSave').show();
    $('#BtnSave').click(function() {
	    SaveProblem(buttonElement);
    });
    
}

//***************************************************************************************************************************************************
// SCROLL HISTORY SECTION TO BOTTOM
function ScrollHistoryToBottom() {
	$('.historyWrapper').animate({ scrollTop: $('.historyWrapper')[0].scrollHeight}, 500);
}
//***************************************************************************************************************************************************
// CLEAR THE EDITOR MODAL
var UndoDeleteStack = [];			// objects on the stack have fields 'latex' and 'annotation'
function ClearEditorModal() {
	//1. Clear Title
	     $('#ProblemTitle').html('');
	     
	//2. Clear History
	     $('#MathHistory').html('');
	     
	//3. Clear Editor 
	     $('#mathEditorActive').html('');
	     
	//4. Clear Annotation
		 $('#mathAnnotation').val('');
	
	//5. Unwire Save Buttons
		$('#BtnSave').unbind('click');
		//$('#BtnCancel').unbind('click');
	
	//6. Hide Undo Button
		$('#undoDelete').hide();
		
	//7. Reset UndoDeleteStack
		UndoDeleteStack = [];
}

//***************************************************************************************************************************************************
// RECREATE PROBLEM OBJECT FROM DOM
function SaveProblem(buttonElement) {
	//1 Get Variable from DOM
	let originalProblemTitle = $('#ProblemTitle').data('title');
    let originalProblemEquation = $('#ProblemTitle').data('equation');
    let originalProblemAnnotation = $('#ProblemTitle').data('annotation');    	 
    let currentEditorEquation = TheActiveMathField.latex();   	 
    let currentEditorAnnotation = $('#mathAnnotation').val();
    
    let mathStep = $('.mathStep');
	let history_array = [];
	
	$.each(mathStep, function (index, item) {
	    history_array.push( {equation: $(item).data('equation'), annotation: $(item).data('annotation')} );  
	});
	problem = {
		"metadata": {"title": originalProblemTitle},
		"originalProblem": {"equation":originalProblemEquation, "annotation":originalProblemAnnotation},
		"currentEditor": {"equation":currentEditorEquation, "annotation":currentEditorAnnotation},
		"history": history_array
	};
	console.log(JSON.stringify(problem, null, '\t'));
	// warning: 'problem' uses ""s, so we need to use ''s below
	buttonElement.setAttribute('onclick', 'SetAndOpenEditorModel(this, ' + JSON.stringify(problem) +')');
	
	alert("Problem Saved!");

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

	let result = HTMLForRow(mathStepNewNumber, mathStepEquation, mathStepAnnotation, true)

	//remove previous trash button if necessary
		//get the current step
		//subtract 1 from the current step
		//select the previousStep 
	$('.mathStep:last .trashButtonContainer').empty();


	$('.mathHistory').append( result );
	ScrollHistoryToBottom();

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
	
	// read trash button to previous step
	$('.mathStep:last .trashButtonContainer').html('<div style="float:right;"><button class="btn btn-default paletteButton" data-toggle="tooltip" onclick="DeleteActiveMath()" style="margin-bottom: 5px;"><i class="fa fa-trash-o" aria-hidden="true"></i><span class="sr-only" id="deleteButton">delete xxx step</span></button></div>');
	
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
		return parseStack[parseStack.length-1];
	}
	
	function MatchAndReplace(topOfStack, str, i) {
		// For each pattern, see if the first arg in that pattern matches the TeX arg.
		//	 matches: do the replacement, remove that first arg (already matched)
		//   doesn't match: remove the pattern from the array (don't add to new array)
		// Because elements are removed and we don't want undefined elements, we build a new array
		let texArg = str.slice(topOfStack.iArgStart, i);
		let newPatterns = [];		// patterns that matched with their replacements
		topOfStack.patterns.forEach( function(pattern) {
			// if the reg exp is "", it matches anything, so we need to deal with that case
			let firstPattern = pattern.match[0];
			if ( (firstPattern.length===0 && texArg.length===0) ||
				 (firstPattern.length>0 && new RegExp(pattern.match[0]).test(texArg)) ) {
				newPatterns.push( {
					match: pattern.match.slice(1),
					replacement: pattern.replacement.replace(
									new RegExp('\\$'+topOfStack.iArg, 'g'),
									texArg)
				} );
			}
		} );
		topOfStack.patterns = newPatterns;
	}
	
	let braceCount = 0;								// changed when processing command args ({}s)
	let i = 0;
	let parseStack = [];
	let expectingOpen = false;						// parsing command args--next ch should be { or [
	
	// Loop through the string looking for {}s, []s, and \commands
	// If a command is found, info about the command and its location in the string are pushed on the stack
	// When arguments match the patterns inside of the brackets and all args processed,
	//   replace that part of the string with the filled-in replacement and pop the stack
	while( i<str.length ) {
		// FIX: if (expectingOpen) grab next non-whitespace char (mathlive always adds {}s???
		if ( parseStack.length===0 ) {
			// optimization...
			// not processing a TeX command, so no need to worry about {} or [] -- skip to command
			i = str.indexOf('\\', i);
			if ( i===-1) {
				i = str.length;							// no more commands, we're done
				break;
			}
		}
			
		// Note: we can only have {} and [] at this point if we are in a command
		switch (str.charAt(i)) {
		case '{': {
			// check to see if there should have been an optional arg and do replacement if so
			let top = stackTop(parseStack);
			if ( braceCount===top.nestingLevel && !top.args[top.iArg] ) {
				let defaultValue = top.defaultValues.shift() || "";
				// substitute in default value into replacement for each pattern/replacement
				top.patterns.forEach(
					function(pattern) {
						pattern.replacement = pattern.replacement.replace(
												new RegExp('\\$'+top.iArg, 'g'),
												defaultValue);
					} );
				top.iArg++;
			}
			if ( braceCount===top.nestingLevel )
				top.iArgStart = i+1;
			expectingOpen = false;
			braceCount++;
			break;
		}
		case '[': {
			// note: optional args can't be nested
			let top = stackTop(parseStack);
			if ( braceCount===top.nestingLevel )
				top.iArgStart = i+1;
			expectingOpen = false;
			break;
		}	
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
			
			MatchAndReplace(top, str, i);
			top.iArg++;
			if (top.iArg==top.args.length) {
				// processed all the args, done with command
				if ( top.patterns.length>0 ) {
					let replacement = top.patterns[0].replacement;
					str = str.substring(0, top.iCommandStart) + replacement + str.substring(i+1);
					i = top.iCommandStart + replacement.length - 1; 
				}
				// else if no match do nothing
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
						
			let actions = replacements[commandName];
			if (actions) {
				// found a command we care about -- push on stack so args get handled
				if ( typeof actions.patterns ==="undefined" || typeof actions.patterns==="string" ) {
					// simple case -> general case w/'match anything' for all args
					actions.patterns = [ {
						match: Array(commandArgs.length).fill('.*'),
						replacement: actions.patterns}];
				}
				parseStack.push( {args: commandArgs,
								  iCommandStart: iNameEnd-1-commandName.length,
								  iArg: 0,
								  nestingLevel: braceCount,
								  defaultValues: actions.defaults || [],
								  patterns: actions.patterns,
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
	
	return str;
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
		result = ReplaceTeXCommands( latexStr, { "enclose": {patterns: "$2"} } );		
	} else {									 // delete
		const replaceChar = '\uFFFD';			// temporary replacement char -- can't be in latexStr
		const notReplaceChar = '[^'+replaceChar+']+';
		result = ReplaceTeXCommands( latexStr,{ "enclose": {patterns: replaceChar} } );

		// if there are any cross out patterns that use sub/superscripts for replacements, fix them
		result = result.replace( new RegExp(replaceChar+'(\\^|_)?', 'g'), "" );
		
		// now do the same for underset, overset, and clean up fractions
		result = ReplaceTeXCommands( result,
						{
						  "underset": {patterns: [{match: [".*", replaceChar], replacement: "{$0}"}]},
						  "overset": {patterns: [{match: [".*", replaceChar], replacement: "{$0}"}]},
						  "frac": {patterns: [
									{match: ["", ""], replacement: "\\frac{1}{1}"},
									{match: ["", ".+"], replacement: "\\frac{1}{$1}"},
									{match: [".+", ""], replacement: "\\frac{$0}{1}"}
								  ] }
						} );
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
		expr = ReplaceTeXCommands( expr, { "frac": {patterns: "(($0)/($1))"},
										   "sqrt": {patterns: "(($1)**(1/($0)))" , defaults: ["2"]}
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
	if (event.shiftKey && (event.key==='Delete' || event.key==='Backspace')) {
		if ( TheActiveMathField.selectionIsCollapsed() ) {
			// if an insertion cursor, extend the selection unless we are at an edge
			if ( TheActiveMathField.selectionAtStart() && event.key==='Backspace' )
				return false;
			if ( TheActiveMathField.selectionAtEnd() && event.key==='Delete' )
				return false;
		
			TheActiveMathField.perform(event.key=="Delete" ? 'extendToNextChar' : 'extendToPreviousChar');
		}
		
		let selection = CleanUpCrossouts( TheActiveMathField.selectedText('latex'), {erase:true} );
		let insertionString = CrossoutTeXString + "{" + selection + "}";
		if (event.ctrlKey) // cross out and replace
			insertionString += '^{#?}';
		TheActiveMathField.perform(['insert', insertionString, 
								    {insertionMode: 'replaceSelection',
									 selectionMode: event.ctrlKey ? 'placeholder' : 'item'}]);
		TheActiveMathField.focus();
		return false;
	}
	
	if (event.shiftKey && event.key==='Enter') {
		NewRowOrRowsAfterCleanup(TheActiveMathField.latex());
		return false;
	}
	
	if (event.ctrlKey && event.key==='=' && !event.shiftKey) {
		CalculateAndReplace(TheActiveMathField);
		return false;
	}
}

function GoogleAnalytics(var1) {
	ga('send', {
	  hitType: 'event',
	  eventCategory: 'Editor',
	  eventAction: var1,
	  eventLabel: ''
	});
	console.log('GA Logged: '+var1);
}
