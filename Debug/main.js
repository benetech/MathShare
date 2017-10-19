define(['mathlive/mathlive'], 
    function(mLive) {
	  MathLive = mLive;
	  MathLive.renderMathInDocument();
	  TheActiveMathField = MathLive.makeMathField(
		document.getElementById('mathEditorActive'),
	  	{commandbarToggle: 'hidden',
		 overrideDefaultInlineShortcuts: false,
		 inlineShortcuts: { '>-': '>-',			// override builtin shortcut (\succ)
							'<-': '<-'},		// override builtin shortcut (\leftarrow)
         //onSelectionDidChange: UpdatePalette
		}
	  );
	  document.onkeydown = HandleKeyDown;
	}
)
