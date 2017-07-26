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
function NewMathEditorRow(mathContent) {
	let oldActiveElement = TheActiveMathField.el();

	// find parent row so we can add a new row before it
	let activeRow = oldActiveElement.parentNode;
	while (activeRow.nodeName != 'TR') {
		activeRow = activeRow.parentNode;
	}
	
	// create new row	
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
	
	// crossout pattern makes the contents of the []s optional
	// FIX: this fails if the thing being crossed out has {}s.
	//   Regular exprs won't handle the nesting/counting
	let crossoutPattern = "\\\\enclose\\{updiagonalstrike downdiagonalstrike\\}(?:\\[2px solid red\\])*?(?:\\{)?[^}]+?(?:\\})";
	let scriptsRE = new RegExp(
		crossoutPattern + "(?:\\^|_)([^\\{]|[a-z]+|\\{.+?\\})",
		"g");
	latexStr = latexStr.replace(scriptsRE, "$1");
	let limitsRE = new RegExp(
		"\\\\(?:underset|overset)([^\\{]|[a-z]+|\\{.+?\\}){" + crossoutPattern + "}",
		"g");
	latexStr = latexStr.replace(limitsRE, "$1");
	let prescriptsRE = new RegExp(
		"\\\\,\\{\\}(?:\\^|_)([^\\{]|[a-z]+|\\{.+?\\})" + crossoutPattern,
		"g");
	prescriptsRE = new RegExp(
		"\\\\,\\{\\}(?:\\^|_)([^\\{]|[a-z]+|\\{.+?\\})" + crossoutPattern,
		"g");
	latexStr = latexStr.replace(prescriptsRE, "$1");
	return latexStr.replace(new RegExp(crossoutPattern, "g"), "");
}

function MathLivePasteFromButton(element) {
    let insertionString = MathLive.getOriginalContent(element).
		replace(/\$\$/g,'').
		replace('\\blacksquare','#0').
		replace('\\square','#?').
		trim();
	TheActiveMathField.perform(['insert', insertionString, 
				{insertionMode: 'replaceSelection',
				 selectionMode: 'placeholder'}]);
	TheActiveMathField.focus();
}

/*
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