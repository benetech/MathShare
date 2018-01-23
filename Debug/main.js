define(['mathlive/mathlive'], 
    function(mLive) {
	  MathLive = mLive;
	  MathLive.renderMathInDocument();
	  TheActiveMathField = MathLive.makeMathField(
		document.getElementById('mathEditorActive'),
	  	{commandbarToggle: 'hidden',
		 overrideDefaultInlineShortcuts: false,
		 inlineShortcuts: { '>-': '>-',			// override builtin shortcut (\succ)
							'<-': '<-',			// override builtin shortcut (\leftarrow)
							'$': '\\$',			// make it easy to type $
							'%': '\\%',			// make it easy to type %
							'?=': '\\overset{?}{=}'	// is equal to
						  }
         //onSelectionDidChange: UpdatePalette
		}
	  );
	  document.onkeydown = HandleKeyDown;
		$(document).ready(function() {
			//generate all problem data for main page -- this is asynchronous
			 ReadFileInitiate('../data/data01.js');
		});
	}
)
