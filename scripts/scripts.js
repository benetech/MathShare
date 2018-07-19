function readBlob(opt_startByte, opt_stopByte) {
        var files = $('#fileid').get(0).files;
        console.log('files:'+file);
        //var files = document.getElementById('files').files;
        if (!files.length) {
            DisplayMessage(WARNING_MESSAGE, 'Warning:', 'Please select a file.');
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
    //InitScratchPad();
    ShowWorkArea(false);

    $('#undoDelete').hide();   
    $('[data-toggle="tooltip"]').on('click', function () {
        $(this).tooltip('hide');
    }) 
});

function ClearScrachPad() {
    ScratchPadPainterro.clearBackground();
    ScratchPadPainterro.worklog.current = null;
    // it is because Painterro displays a modal if we want to replace an existing ScratchPad content
    ScratchPadPainterro.worklog.clean = true;
}

function GetNumberOfSteps() {
    return $('.mathStep').length;
}

function MoveEditorBelowSpecificStep(stepNumber) {
    var index = stepNumber - 1;
    var mathStep = $('.mathStep:eq('+ index +')');
    var workArea = $('.myWorkArea');
    workArea.detach();
    mathStep.after(workArea);
}

function MoveEditorToItsContainer() {
    var workArea = $('.myWorkArea');
    workArea.detach();
    $('#MainWorkArea').append(workArea);
}

//***************************************************************************************************************************************************
// GLOBAL VARIABLES
    // Global var to share the representation used for crossouts
    // The crossout style properties are defined in CSS styles file
    CrossoutTeXString = "\\enclose{updiagonalstrike downdiagonalstrike}[2px solid blue]";
    UpdateMathFieldMode = false;

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
                            '*': '\\times',		// what most people want
                            '?=': '\\overset{?}{=}'	// is equal to
                            },
         onMoveOutOf:	function(mathField, dir) { return false; },	// don't wrap around
         onKeystroke:	function(key, event) {
                // Esc key moves to the next field
                if (key !== 'Esc') {
                    return true;
                }
                $("#mathAnnotationHeader").focus();
                $('#mathEditorActive').find('span[aria-live]')[0].textContent = "after application";
                return false;
            }
                 // onSelectionDidChange: UpdatePalette
        }
    );
    document.onkeydown = HandleKeyDown;
}

// build a row of history
function HTMLForRow(stepNumber, math, annotation, showTrash, showEdit, cleanup) {
    let html = '<div class="row mathStep" data-step="'+stepNumber+'" data-equation="'+math+'" data-annotation="'+annotation+'">';
    html += '<div class="col-md-1">';
    html +=   '<span role="heading" aria-level="3">';
    if (cleanup) {
        html += '<span class="SROnly">' + OrdinalSuffix(stepNumber) +' step, after cleanup</span>';
    } else {
        html += '<span class="SROnly">' + OrdinalSuffix(stepNumber) +' step</span>';
        html += '<span class="stepHeader" aria-hidden="true">Step '+stepNumber+':</span>';
    }
    html +=   '</span>';
    html += '</div>';
    html += '<div class="col-md-5">';
    html +=   '<span class="sr-only"> math: </span>';
    html +=   '<span class="staticMath" >$$'+math+'$$</span>';
    html += '</div>';
    html += '<div class="col-md-5">';
    html +=    '<span class="sr-only"  role="heading" aria-level="4">reason:</span>';
    // for screen readers, we want some content for empty annotations so they know they are on the field
    html +=    '<span class="' +
                    (annotation == '(cleanup)' ? 'grayedOutCleanup' : 'staticMath') + '">' +annotation + '</span>';
    html += '</div>';
    html +=  '<div class="col-md-1 rowControlButtonsContainer" style="text-align: right; float:right;">';
    if (showEdit) {
        html +=  '<button class="btn btn-edit btn-background paletteButton" data-toggle="tooltip" title="Edit this Step" onclick="EditMathStep('+ stepNumber + ')" style="margin-bottom: 5px;">' +
                        '<span class="SROnly">Edit ' + OrdinalSuffix(stepNumber) +' step</span>' +
            '</button>';
    }
    if (showTrash) {
        html +=  '<button class="btn btn-delete btn-background paletteButton" data-toggle="tooltip" title="Delete this Step" onclick="DeleteActiveMath()" style="margin-bottom: 5px;">' +
                        '<span class="SROnly">Delete ' + OrdinalSuffix(stepNumber) +' step</span>' +
            '</button>';
    }
    html += '</div></div>';
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
        ReadFileFinish()
    });
}

// Finish reading the file now that the data is available
function ReadFileFinish(data) {
    document.getElementById("ContentWrapper").setAttribute(
            "data-galois-metadata",
            JSON.stringify(data.metadata)
        );
    $('#ProblemList').empty();
    $('#ProblemList').html(PopulateMainPage(data));

    initializeMathPalettes();
    MathLive.renderMathInDocument();
}

function ReadFileEmpty() {
    $('#something').empty();
}

function SetAndOpenEditorModel(buttonElement, dataObj) {
    PopulateEditorModal(buttonElement, dataObj);
    //MathLive.renderMathInDocument();
}

// POPULATE EDITOR WINDOW
function PopulateEditorModal(buttonElement, dataObj) {
    $(".leftNavigation li").removeClass("leftNavigationBackgroundActive");

        //6 SCROLL TO BOTTOM OF HISTORY
            ScrollHistoryToBottom();

        //9 Wire up DISCARD & SAVE btns
    $('#BtnDiscard').click(function() {
        if (ProblemIsUnchanged(buttonElement)) {
            ShowWorkArea(false);
            return true;
        }
        // Problem changed -- ask for confirmation before discarding
        if (confirm("Any work on this problem will NOT be saved")) {
            ShowWorkArea(false);
            ClearScrachPad();
            return true;
        }
        return false;
    });
        $('#BtnSave').click(function() {
            SaveProblem(buttonElement);
            ClearScrachPad();
        });

    //10 Hide/show parts of page
    ShowWorkArea(true);
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

    //5. Unwire Discard & Save Buttons
        $('#BtnDiscard').unbind('click');
        $('#BtnSave').unbind('click');

    //6. Hide Undo Button
        $('#undoDelete').hide();

    //7. Reset UndoDeleteStack
        UndoDeleteStack = [];
}

function SaveProblem(buttonElement) {
    // warning: 'problem' uses ""s, so we need to use ''s below
    buttonElement.setAttribute('onclick', 'SetAndOpenEditorModel(this, ' + JSON.stringify(GetProblemData(buttonElement)) +')');

    DisplayMessage(SUCCESS_MESSAGE, 'Success:', 'Problem saved.');
    ShowWorkArea(false);
}

function ProblemIsUnchanged(buttonElement) {
    let currentState = JSON.stringify(GetProblemData(buttonElement));
    let previousState = buttonElement.getAttribute('onclick');
    return previousState.includes(currentState);
}

//***************************************************************************************************************************************************
// CREATE NEW HISTORY ROW FROM CURRENT CONTENT
// @param {mathContent} latex for new active area after being cleaned.
// @return {nothing} No return value
function NewMathEditorRow(mathContent, cleanup) {
    // assemble the new static area from the current math/annotation
    let mathStepEquation = TheActiveMathField.latex();
    let mathStepAnnotation = cleanup ? '(cleanup)' : $('#mathAnnotation').val();
    let mathStepNumber = $('.mathStep:last').data('step');
    let mathStepNewNumber = mathStepNumber ? mathStepNumber+1 : 1;	// worry about no steps yet

    let result = HTMLForRow(mathStepNewNumber, mathStepEquation, mathStepAnnotation, true, true, cleanup)

    //remove previous trash button if necessary
        //get the current step
        //subtract 1 from the current step
        //select the previousStep
    $('.mathStep:last .btn-delete').hide();


    $('.mathHistory').append( result );
    ScrollHistoryToBottom();

    MathLive.renderMathInElement( $('.mathStep:last')[0] );

    // set the new active math and clear the annotation
    TheActiveMathField.latex(mathContent);
    $('#mathAnnotation').val('');

    SetScratchPadContentData(mathStepNewNumber, ScratchPadPainterro.imageSaver.asDataURL())
    ClearScrachPad();
    MoveEditorBelowSpecificStep(mathStepNewNumber);
    //MathLive.renderMathInDocument();
}

function UpdateMathEditorRow(mathContent, mathStepNumber, cleanup) {

    index = mathStepNumber - 1;
    annotation = cleanup ? '(cleanup)' : $('#mathAnnotation').val();

    let mathStep = $('.mathStep:eq('+ index +')');
    mathStep.data('equation', TheActiveMathField.latex());
    mathStep.data('annotation', annotation);
    mathStep.attr('data-equation', TheActiveMathField.latex());
    mathStep.attr('data-annotation', annotation);
    SetScratchPadContentData(mathStepNumber, ScratchPadPainterro.imageSaver.asDataURL())

    mathStepFields = $('.staticMath', '.mathStep:eq('+ index +')');
    mathStepFields.first()[0].textContent = '$$' + TheActiveMathField.latex() + '$$';
    mathStepFields.last()[0].textContent = cleanup ? '(cleanup)' : $('#mathAnnotation').val();
    MathLive.renderMathInElement(mathStep[0]);

    // set the new active math and clear the annotation
    TheActiveMathField.latex(mathContent);
    $('#mathAnnotation').val('');
}

function SetScratchPadContentData(stepNumber, newContent) {
    let mathStep = $('.mathStep:eq('+ (stepNumber - 1) +')');
    mathStep.data('scratch-pad', newContent);
}

function GetScratchPadContentData(stepNumber) {
    let mathStep = $('.mathStep:eq('+ (stepNumber - 1) +')');
    return mathStep.data('scratch-pad');
}

function ApplyScratchPadContent(content) {
    ClearScrachPad();
    ScratchPadPainterro.show(content);
}

function ExitUpdate() {
    $('#addStep').show();
    $('#updateControls').hide();
    let editor = $('.myWorkArea');
    editor.detach();
    mathHistory = $('#MathHistory');
    mathHistory.append(editor);

    let latestMathStepData = $("#latestMathStepData");
    TheActiveMathField.latex(latestMathStepData.data('equation'));
    $('#mathAnnotation').val(latestMathStepData.data('annotation'));
    ApplyScratchPadContent(latestMathStepData.data('scratch-pad'));
    latestMathStepData.detach();

    TheActiveMathField.focus();
    $('#control-buttons').show();
    UpdateMathFieldMode = false;
}
// Creates one or two rows (two if 'mathContent' contains cross outs)
// @param {mathContent} latex for new active area after being cleaned.
// @return {nothing} No return value
function NewRowOrRowsAfterCleanup(mathContent) {
    let cleanedUp = CleanUpCrossouts(mathContent);
    if (mathContent !== cleanedUp) {
        NewMathEditorRow(cleanedUp, false);
        NewMathEditorRow(cleanedUp, true);
    } else {
        NewMathEditorRow(cleanedUp, false);
    }

    let mathStepNumber = $('.mathStep:last').data('step');
    $('#mathEditorActive').find('span[aria-live]')[0].textContent = "added step " + mathStepNumber;
}

function UpdateRowAfterCleanup(mathContent, mathStepNumber) {
    let cleanedUp = CleanUpCrossouts(mathContent);
    if (mathContent !== cleanedUp) {
        UpdateMathEditorRow(cleanedUp, mathStepNumber, false);
        //UpdateMathEditorRow(cleanedUp, mathStepNumber + 1, true); TODO: add cleanup update support
    } else {
        UpdateMathEditorRow(cleanedUp, mathStepNumber, false);
    }
}

function AddStep() {
    if (!$('#mathAnnotation').val()) {
        DisplayMessage(WARNING_MESSAGE, 'Warning:', 'Please provide a description of your work.');
        $('#mathAnnotation').focus();
        return;
    }
    NewRowOrRowsAfterCleanup(TheActiveMathField.latex());
    TheActiveMathField.focus();
}

function UpdateStep(stepNumber) {
    if (!$('#mathAnnotation').val()) {
        DisplayMessage(WARNING_MESSAGE, 'Warning:', 'Please provide a description of your work.');
        $('#mathAnnotation').focus();
        return;
    }
    UpdateRowAfterCleanup(TheActiveMathField.latex(), stepNumber);
    ExitUpdate();
    DisplayMessage(SUCCESS_MESSAGE, 'Success:', 'The step has been updated.');
}

//***************************************************************************************************************************************************
// Delete the currently active area and make the last step active...
// Or, put another way...
// Copy the contents of the last step/row into the active area and delete that step/row
// @param {clearAll} informs if delete is a part of clearing all steps process
// @return {nothing} No return value
function DeleteActiveMath(clearAll) {
    // nothing to do if there are no steps
    if (!$('.mathStep:last'))
        return;

    UndoDeleteStack.push(
        { latex: TheActiveMathField.latex(),
            annotation: $('#mathAnnotation').val(),
            clearAll: clearAll
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
    if ($('.mathStep').length > 1) {
        $('.mathStep:last .btn-delete').show();
    }

    TheActiveMathField.focus();
    if (lastStep.data('annotation') == "(cleanup)") {
        DeleteActiveMath();
    }
    $('.mathStep:last .btn-edit').show();
    $('#addStep').show();
    $('#updateControls').hide();
}

function EditMathStep(stepNumber) {
    // nothing to do if there are no steps
    let index = stepNumber - 1;
    let mathStep = $('.mathStep:eq('+ index +')');

    if (UpdateMathFieldMode === false) {
        let latestMathStepData = $('<div/>', {
            id: "latestMathStepData",
        }).hide().appendTo('#MathHistory');
        latestMathStepData.data('equation', TheActiveMathField.latex());
        latestMathStepData.data('annotation', $('#mathAnnotation').val());
        latestMathStepData.data('scratch-pad', ScratchPadPainterro.imageSaver.asDataURL());
    }

    TheActiveMathField.latex(mathStep.data('equation'));
    $('#mathAnnotation').val(mathStep.data('annotation'));
    $('#updateControls').removeAttr('hidden');
    $('#updateStep').unbind();
    $('#updateStep').click(function(){
        UpdateStep(stepNumber);
    });
    $('#addStep').hide();
    $('#updateControls').show();

    MoveEditorBelowSpecificStep(stepNumber);
    $('#control-buttons').hide();

    var content = GetScratchPadContentData(stepNumber);
    if (content) {
        ApplyScratchPadContent(content);
    } else {
        ClearScrachPad();
    }
    UpdateMathFieldMode = true;
}

function UndoDeleteStep() {
    stackEntry = UndoDeleteStack.pop();
    if (stackEntry===undefined)
        return;	// shouldn't happen because button is disabled

    if (UndoDeleteStack.length===0)
        $('#undoDelete').hide();

    var cleanup = $('#mathAnnotation').val() == '(cleanup)';
    NewMathEditorRow( stackEntry.latex , cleanup)
    $('#mathAnnotation').val( stackEntry.annotation );

    TheActiveMathField.focus();

    if (UndoDeleteStack.length > 0 && (stackEntry.annotation == '(cleanup)' || stackEntry.clearAll)) {
        UndoDeleteStep();
    }
}

function clearAllSteps() {
    if ($('.mathStep').length > 1) {
        DeleteActiveMath();
    }
    while ($('.mathStep').length > 1) {
        DeleteActiveMath(true);
    }
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

function initializeKeyShortcuts(palettes) {
    var keyShortcuts = new Map();
    palettes.forEach(function(palette) {
        palette.buttonsRows.forEach(function(buttonsRow) {
            buttonsRow.forEach(function(button) {
                if (button.keys) {
                    keyShortcuts.set(buildMapKey(button.keys), button.id);
                }
            });
        });
    });
    sessionStorage.keyShortcuts = JSON.stringify(Array.from(keyShortcuts.entries()));
}

function buildMapKey(keys) {
    keys.sort();
    return mapKey = keys.join('');
}

//***************************************************************************************************************************************************
function HandleKeyDown(event)
{
    var keyShortcuts = new Map(JSON.parse(sessionStorage.keyShortcuts));
    if (event.shiftKey && TheActiveMathField.selectionIsCollapsed()) {
        // if an insertion cursor, extend the selection unless we are at an edge
        if (event.key === 'Backspace' && !TheActiveMathField.selectionAtStart()) {
            TheActiveMathField.perform('extendToPreviousChar');

        } else if (event.key === 'Delete' && !TheActiveMathField.selectionAtEnd()) {
            TheActiveMathField.perform('extendToNextChar');
        }
    }
    if (event.shiftKey && event.key === 'Enter' && $('#mathAnnotation').val() !== '') {
        if ($('#updateStep').is(":visible")) {
            $('#updateStep').click();
        } else {
            NewRowOrRowsAfterCleanup(TheActiveMathField.latex());
        }
    }

    var keys = [];
    if (event.shiftKey) {
        keys.push("Shift");
    }
    if (event.ctrlKey) {
        keys.push("Ctrl");
    }
    keys.push(event.key);
    var id = keyShortcuts.get(buildMapKey(keys));
    if (id) {
        $("#" + id).click();
    }
}

function GoogleAnalytics(action) {
    ga('send', {
        hitType: 'event',
        eventCategory: 'Editor',
        eventAction: action,
        eventLabel: ''
    });
}
