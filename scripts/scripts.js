/**
 * The overall structure for the solution steps is a table with two columns
 * The first column is the math and the second column is the reason
 * The last row is the active math editing area.
 * Following the math editing area is another table for the palettes.
 *
 */
 
/**
 * 'Freeze' the current element by making it static math and add a new
 * new active editing row with the math content. 
 */
 
/*
 * Global var to share the representation used for crossouts
 */
CrossoutTeXString = "\\enclose{updiagonalstrike downdiagonalstrike}[2px solid red]";
"\enclose{updiagonalstrike downdiagonalstrike}[2px solid red]{2}"

// crossout pattern makes the contents of the []s optional
// FIX: this fails if the thing being crossed out has {}s.
//   Regular exprs won't handle the nesting/counting
CrossoutRegExpPattern = /\\enclose\{updiagonalstrike downdiagonalstrike\}(?:\[2px solid red\])*?(?:\{)?[^}]+?(?:\})/;

CrossoutFindRegExpPattern = /\\enclose\{updiagonalstrike downdiagonalstrike\}\[2px solid red\]/g;

function NewMathEditorRow(mathContent) {
	
	var mathStepEquation = TheActiveMathField.latex();
	var mathStepAnnotation = $('#mathAnnotation').val();
	var mathStepCurrent = $('.mathStep:last').data('step');
	var mathStepNew = mathStepCurrent+1;
	var mathStepTitle = "Step "+mathStepNew+":";
	
	var html =  '<div class="mathStep" data-step="'+mathStepNew+'">';
	html += '<div class="mathStepTitle">'+mathStepTitle+'</div>';
	html += '<div class="mathStepEquation staticMath">$$'+mathStepEquation+'$$</div>';
	html += '<div class="mathStepAnnotation">'+mathStepAnnotation+'</div>';
	html += '</div>';
	$( ".scroll" ).append(html);
	
	$('#mathAnnotation').val('');
	
	
	
	
	
	MathLive.renderMathInDocument();
	
	
}	

/*
function NewMathEditorRow(mathContent) {
	let oldActiveElement = TheActiveMathField.el();

	// find parent row so we can add a new row before it
	let activeRow = oldActiveElement.parentNode;
	while (activeRow.nodeName != 'TR') {
		activeRow = activeRow.parentNode;
	}
	
	// create new row	
	console.log(TheActiveMathField.latex());
	
	let newRow = document.createElement("tr");
	newRow.className = 'step';
	newRow.innerHTML = '<td><div class="staticMath"></div></td>' +
					   '<td><p></p></td>';
					   
	// take the contents of the active row and stuff it into the new row	
	let newFirstCol = newRow.firstChild.firstChild;
	newFirstCol.innerText = '$$' + TheActiveMathField.latex() + '$$';
	MathLive.renderMathInElement(newFirstCol);	
	
	// copy the editor's reason and then clear it
	let mathEditorReason = document.getElementById("mathEditorReason");
	newRow.lastChild.firstChild.innerText = mathEditorReason.value;
	mathEditorReason.value = '';
		
	// Reset active row
	TheActiveMathField.latex(mathContent);
	activeRow.parentNode.insertBefore(newRow,activeRow);
}
*/

/**
 * Remove all crossouts and if there are replacements associated with them,
 * put those in place of the crossouts.
 * @param {string} latexStr The LaTeX string to be matches
 * 
 * @return {string} The string with the crossouts removed and replacements done
 * 
 */
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

/**
 * Paste the button into the active math editor after substituting
 * for the black and white squares
 */
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

/**
 * Call paste function if someone hits enter over palette entry
 * Important for accessibility
 */
function MathLivePasteFromButtonKeyDown(event, element) {
	if (event.key == "Enter") {
		MathLivePasteFromButton(element);
		return false;
	} else
		return true;
}


/**
 * Delete the currently active row and make the previous row active
 */
function DeleteActiveMath() {
	let oldActiveElement = TheActiveMathField.el();

	// find parent row so we can delete it and make the row before it active
	let activeRow = oldActiveElement.parentNode;
	while (activeRow.nodeName != 'TR') {
		activeRow = activeRow.parentNode;
	}
	
	let previousRow = activeRow.previousElementSibling;
	if (!previousRow)
		return;
		
	// It's a bit simpler to replace the contents of the active row and delete
	// the previous row, so that's how we do it.
	// Also, this makes is similar to adding a new row
	
	// copy the editor's reason and then clear it
	let mathReason = previousRow.lastElementChild.innerText;
	document.getElementById("mathEditorReason").value = mathReason;
		
	// copy the math content
	let mathContent = MathLive.getOriginalContent(previousRow.firstElementChild.firstElementChild);
	TheActiveMathField.latex(mathContent);
	
	// all done with the previous row's content -- delete it
	activeRow.parentNode.removeChild(previousRow);
	
	TheActiveMathField.focus();
}

/**
 * Update the palette with the current selection for the active math editor
 * Reset the palette when the selection is just an insertion cursor
 * @param mathField -- the active math editor called on 'onSelectionDidChange'
 */
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
		let palettes =  document.getElementsByClassName('palette');
		for (let iPalette=0; iPalette<palettes.length; iPalette++) {
			let templates = palettes[iPalette].getElementsByClassName('template');
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
}

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
