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
    	let originalProblemEquation = dataObj[1].originalProblem[0].equation;    	 
    	let originalProblemAnnotation = dataObj[1].originalProblem[0].annotation;    	 
    	let currentEditorEquation = dataObj[2].currentEditor[0].equation;    	 
    	let currentEditorAnnotation = dataObj[2].currentEditor[0].annotation;    	
    	let historyObj = dataObj[3].history;
    //3 Build HTML HISTORY
    	let htmlHistory = '';
		for (let i = 0; i < historyObj.length; i++) {			      
	        htmlHistory += '<div class="row mathStep" data-step="'+i+'" data-equation="'+historyObj[i].equation+'" data-annotation="'+historyObj[i].annotation+'">';
		    htmlHistory +=  '<div class="col-md-2">Step '+i+':</div>';
	        htmlHistory +=  '<div class="col-md-5 staticMath">$$'+historyObj[i].equation+'$$</div>';
	        htmlHistory +=  '<div class="col-md-5">'+historyObj[i].annotation+'</div>';
	        htmlHistory += '</div>';
	    }
    //3 BUILD HTML TITLE
    	let htmlTitle = ''+originalProblemTitle+': '+originalProblemEquation+ ', '+originalProblemAnnotation+'';
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
    	
    //7 Wire up SAVE FOR LATER btn
    $('#BtnSaveForLater').click(function() {
	    SaveProblem(CurrentProblem);
	    CloseEditorModal();
    });
    
    //8 Wire up Mark Completed
    $('#BtnMarkCompleted').click(function() {
	    SaveProblem(CurrentProblem);
	    CloseEditorModal();
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
		$('#BtnSaveForLater').unbind('click');
		$('#BtnMarkCompleted').unbind('click');
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
			
	
	

	
	//console.log('AFTER SAVE: ');
	//console.log(problem01);
	//console.log(problem01[0].metadata[0].variableName);
	
	
	//CurrentProblem[0].originalProblem[0].title = 'something';
	//console.log('111'+CurrentProblem[0].originalProblem[0].title);
	//console.log('222'+problem01[0].originalProblem[0].title);
	//2 rewrite object with original name
}

//***************************************************************************************************************************************************
// SET CURRENT PROBLEM TO GLOBAL VARIABLE
var CurrentProblem;
function SetCurrentProblem(dataObj) {
	CurrentProblem = dataObj;
	//console.log('Current Problem is: '+CurrentProblem[1].metadata[0].title);
}











