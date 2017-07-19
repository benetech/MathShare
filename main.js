define(['mathlive/mathlive'], 
    function(mLive) {
	  MathLive = mLive;
	  MathLive.renderMathInDocument();
	  TheActiveMathField = MathLive.makeMathField(
		document.getElementById('mathEditorActive'),
	  	{commandbarToggle: 'hidden',
		 overrideDefaultInlineShortcuts: false});
	}
)
