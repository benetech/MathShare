//***************************************************************************************************************************************************
// GLOBAL VARIABLES
	// Global var to share the representation used for crossouts

	CrossoutTeXString = "\\enclose{updiagonalstrike downdiagonalstrike}[2px solid red]";
	"\enclose{updiagonalstrike downdiagonalstrike}[2px solid red]{2}"
		
	// crossout pattern makes the contents of the []s optional
	// FIX: this fails if the thing being crossed out has {}s.
	//   Regular exprs won't handle the nesting/counting
	CrossoutRegExpPattern = /\\enclose\{updiagonalstrike downdiagonalstrike\}(?:\[2px solid red\])*?(?:\{)?[^}]+?(?:\})/;
		
	CrossoutFindRegExpPattern = /\\enclose\{updiagonalstrike downdiagonalstrike\}\[2px solid red\]/g;

//***************************************************************************************************************************************************
// RENDER ACTIVE MATH EDITOR
function RenderMathEditor() {
	TheActiveMathField = MathLive.makeMathField(
		document.getElementById('mathEditorActive'),
	  	{commandbarToggle: 'hidden',
		 overrideDefaultInlineShortcuts: false,
         //onSelectionDidChange: UpdatePalette
		}
	);
}

//***************************************************************************************************************************************************
// POPULATE EDITOR WINDOW
function PopulateEditorModal(dataObj) {
    //1 Clear existing info in modal
    	ClearEditorModal();
    //2 Get all variables from js objects
    	let originalProblemTitle = dataObj[0].metadata[0].title;
    	let originalProblemVariable = dataObj[0].metadata[0].variableName;
    	let originalProblemEquation = dataObj[1].originalProblem[0].equation;    	 
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
			let tempStepNumber = i+1;	      
	        htmlHistory += '<div class="row mathStep" data-step="'+tempStepNumber+'" data-equation="'+historyObj[i].equation+'" data-annotation="'+historyObj[i].annotation+'">';
		    htmlHistory +=  '<div class="col-md-2">Step '+tempStepNumber+':</div>';
	        htmlHistory +=  '<div class="col-md-5 staticMath">$$'+historyObj[i].equation+'$$</div>';
	        htmlHistory +=  '<div class="col-md-5">'+historyObj[i].annotation+'</div>';
	        htmlHistory += '</div>';
	    }
    //3 BUILD HTML TITLE
    	let htmlTitle = 'Original Problem: '+originalProblemEquation+ ', '+originalProblemAnnotation+'';
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
    	TheActiveMathField = MathLive.makeMathField(
			document.getElementById('mathEditorActive'),
		  	{commandbarToggle: 'hidden',
			 overrideDefaultInlineShortcuts: false,
	         //onSelectionDidChange: UpdatePalette
			}
		);
    	
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
		 $('#mathAnnotation').text('');
	
	//5. Unwire Save Buttons
		$('#BtnSave').unbind('click');
		$('#BtnCancel').unbind('click');
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
function SetCurrentProblem(dataObj) {
	CurrentProblem = dataObj;
	//console.log('Current Problem is: '+CurrentProblem[1].metadata[0].title);
}


//***************************************************************************************************************************************************
// CREATE NEW HISTORY ROW FROM CURRENT CONTENT
function NewMathEditorRow(mathContent) {
	// assemble the new static area from the current math/annotation
	let mathStepEquation = TheActiveMathField.latex();
	let mathStepAnnotation = $('#mathAnnotation').val();
	let mathStepNumber = $('.mathStep:last').data('step');
	let mathStepNewNumber = mathStepNumber ? mathStepNumber+1 : 1;	// worry about no steps yet
	let mathStepTitle = "Step "+mathStepNewNumber+":";

	let html = '<div class="row mathStep" data-step="'+mathStepNewNumber+'" data-equation="'+mathStepEquation+'" data-annotation="'+mathStepAnnotation+'">';
	html +=  '<div class="col-md-2">'+mathStepTitle+'</div>';
	html +=  '<div class="col-md-5 staticMath">$$'+mathStepEquation+'$$</div>';
	html +=  '<div class="col-md-5">'+mathStepAnnotation+'</div>';
	html += '</div>';

	$( ".mathHistory" ).append(html);
	MathLive.renderMathInElement( $('.mathStep:last') );
	
	// set the new active math and clear the annotation
	TheActiveMathField.latex(mathContent);
	$('#mathAnnotation').val('');
	
	MathLive.renderMathInDocument();
}	

//***************************************************************************************************************************************************
// Delete the currently active area and make the last step active...
// Or, put another way...
// Copy the contents of the last step/row into the active area and delete that step/row
function DeleteActiveMath() {
	// nothing to do if there are no steps
	if (!$('.mathStep:last'))
		return;

	let oldActiveElement = TheActiveMathField.el();

	// get the contents of the last row/step
	let lastStep = $('.mathStep:last');
	// TODO: add active/current latex and annotation to undo stack

	// put the contents of the last row/step into the active/current line
	TheActiveMathField.latex( lastStep.find('.mathStepEquation').text() );
	$('#mathAnnotation').val( lastStep.find('.mathStepAnnotation').text() );
	
	// ok to delete last row now...
	lastStep.detach();
	
	TheActiveMathField.focus();
}

//***************************************************************************************************************************************************
// Remove all crossouts and if there are replacements associated with them,
// put those in place of the crossouts.
// @param {string} latexStr The LaTeX string to be matches
// @return {string} The string with the crossouts removed and replacements done
function CleanUpCrossouts(latexStr) {
	// FIX: a proper "compass adornment" feature for MathLive doesn't exist yet.
	// Right now, code looks for:
	//   crossout^replacement
	//   crossout_replacement
	//   \overset{replacement}{crossout}
	//   \underset{replacement}{crossout}
	// where crossout is \enclose{updiagonalstrike downdiagonalstrike}[..]{...}
	// This is missing compass points NW, W, SW, E
	// If a replacement pattern isn't found, the crossout is removed
	// FIX: this looks for very specific uses of crossout and needs to change
	//   if the crossout pattern changes
	// FIX: this would be easier/less error prone if we use MathML (not yet implemented)
	
	let scriptsRE = new RegExp(
		CrossoutRegExpPattern + "(?:\\^|_)([^\\{]|[a-z]+|\\{.+?\\})",
		"g");
	latexStr = latexStr.replace(scriptsRE, "$1");
	let limitsRE = new RegExp(
		"\\\\(?:underset|overset)([^\\{]|[a-z]+|\\{.+?\\}){" + CrossoutRegExpPattern + "}",
		"g");
	latexStr = latexStr.replace(limitsRE, "$1");
	let prescriptsRE = new RegExp(
		"\\\\,\\{\\}(?:\\^|_)([^\\{]|[a-z]+|\\{.+?\\})" + CrossoutRegExpPattern,
		"g");
	prescriptsRE = new RegExp(
		"\\\\,\\{\\}(?:\\^|_)([^\\{]|[a-z]+|\\{.+?\\})" + CrossoutRegExpPattern,
		"g");
	latexStr = latexStr.replace(prescriptsRE, "$1");
	return latexStr.replace(new RegExp(CrossoutRegExpPattern, "g"), "");
}

//***************************************************************************************************************************************************
// Paste the button into the active math editor after substituting
// for the black and white squares
function MathLivePasteFromButton(element) {
	// Button contents as a string
    let insertionString = MathLive.getOriginalContent(element).
		replace(/\$\$/g,'').
		replace('\\blacksquare','#0').
		replace('\\square','#?').
		trim();

	if ( !TheActiveMathField.selectionIsCollapsed() &&
		 CrossoutFindRegExpPattern.test(insertionString) ) {
		// if the insertionString contains a cross out, remove all crossout in the selection
		let selection = TheActiveMathField.selectedText('latex')
							.replace(CrossoutFindRegExpPattern, "");
	
		// stick the modified selection into the black square (#0) in the insertionString
		insertionString = insertionString.replace(/#0/, selection);
	}

	TheActiveMathField.perform(['insert', insertionString, 
				{insertionMode: 'replaceSelection',
				 selectionMode: 'placeholder'}]);
	TheActiveMathField.focus();
}

//***************************************************************************************************************************************************
// Call paste function if someone hits enter over palette entry
// Important for accessibility
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
		let cleanedSelection = origSelection;	// selection without crossouts (pre-compute)
		if ( CrossoutFindRegExpPattern.test(origSelection) )
			cleanedSelection = origSelection.replace(CrossoutFindRegExpPattern, "");

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
				if (origSelection) {
					// we have latex for the selection, so substitute it in
					// if both have cross outs, remove them from the selection
					// this matches the behavior on activation
					let selection = ( CrossoutFindRegExpPattern.test(newContents) ) ? cleanedSelection : origSelection;
					CrossoutFindRegExpPattern.lastIndex = 0; // past match if not reset

					 newContents = newContents.
						replace(/\$\$/g,'').
						replace('\\blacksquare', selection);
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
	if (event.ctrlKey && (event.key=="Delete" || event.key=="Backspace")) {
		if ( TheActiveMathField.selectionIsCollapsed() ) {
			// if an insertion cursor, extend the selection unless we are at an edge
			if ( TheActiveMathField.selectionAtStart() && event.key=="Backspace" )
				return false;
			if ( TheActiveMathField.selectionAtEnd() && event.key=="Delete" )
				return false;
		
			TheActiveMathField.perform(event.key=="Delete" ? 'extendToNextChar' : 'extendToPreviousChar');
		}
		
		let selection = TheActiveMathField.selectedText('latex').replace(CrossoutFindRegExpPattern, "");
		
		let insertionString = CrossoutTeXString + "{" + selection + "}";
		TheActiveMathField.perform(['insert', insertionString, 
								    {insertionMode: 'replaceSelection',
									 selectionMode: 'item'}]);
		TheActiveMathField.focus();
		return false;
	}
	return true;
}










		
		







