var palettes = [
    {
        "screenReadersTitle": "cross out and calc buttons",
        "label": "Edit",
        "commonClass": "staticMath btn btn-facility paletteButton",
        "buttonsRows": [
            [
                {
                    "id": "crossOutBtn",
                    "title": "Cross out",
                    "additionalOnclick": "MathLivePasteFromButton(this); GoogleAnalytics('Cross Out');",
                    "value": "$$\\enclose{updiagonalstrike downdiagonalstrike}[2px solid blue]{\\blacksquare}$$",
                    "keys":
                    [
                        "Shift",
                        "Delete"
                    ]
                },
                {
                    "id": "crossOutAndReplaceBtn",
                    "title": "Cross out & replace",
                    "additionalOnclick": "MathLivePasteFromButton(this); GoogleAnalytics('Cross Out & Replace');",
                    "value": "$$ \\enclose{updiagonalstrike downdiagonalstrike}[2px solid blue]{\\blacksquare}^{\\square} $$",
                    "keys":
                    [
                        "Shift",
                        "Ctrl",
                        "Delete"
                    ]
                }
            ],
            [
                {
                    "id": "stackBelowBtn",
                    "title": "stack below",
                    "additionalOnclick": "MathLivePasteFromButton(this); GoogleAnalytics('stack below');",
                    "value": "$$ \\begin{array}{r} \\blacksquare \\\\ \\square\\end{array}$$",
                    "keys":
                    [
                        "Ctrl",
                        "Enter"
                    ]
                }
            ],
            [
                {
                    "id": "calculateBtn",
                    "title": "Calculate",
                    "additionalOnclick": "CalculateAndReplace(this); GoogleAnalytics('Calculate');",
                    "value": "Calc",
                    "keys":
                    [
                        "Ctrl",
                        "="
                    ]
                }
            ]
        ]
    },
    {
        "screenReadersTitle": "Operator buttons",
        "label": "Operators",
        "commonClass": "staticMath btn btn-operator paletteButton",
        "commonOnclick": "MathLivePasteFromButton(this)",
        "buttonsRows": [
            [
                {
                    "id": "dotTimesBtn",
                    "title": "Dot times (⌨: \\cdot⏎)",
                    "value": "$$\\cdot$$"
                },
                {
                    "id": "timesBtn",
                    "title": "Times (⌨: xx)",
                    "value": "$$\\times$$"
                },
                {
                    "id": "divisionBtn",
                    "title": "Division (⌨: \\div⏎)",
                    "value": "$$\\div$$"
                }
            ],
            [
                {
                    "id": "plusMinusBtn",
                    "title": "Plus minus (⌨: +-)",
                    "value": "$$\\pm$$"
                },
                {
                    "id": "lessThanOrEqualBtn",
                    "title": "Less than or equal  (⌨: <=)",
                    "value": "$$\\leq$$"
                },
                {
                    "id": "greaterThanOrEqualBtn",
                    "title": "Greater than or equal  (⌨: >=)",
                    "value": "$$\\geq$$"
                }
            ],
            [
                {
                    "id": "notEqualBtn",
                    "title": "Not equal (⌨: !=)",
                    "value": "$$\\neq$$"
                },
                {
                    "id": "isEqualToBtn",
                    "title": "Is equal to (⌨: ?=)",
                    "value": "$$\\overset{?}{=}$$"
                }
            ]
        ]
    },
    {
        "screenReadersTitle": "Fraction and other notation buttons",
        "label": "Notations",
        "commonClass": "staticMath btn btn-notation paletteButton",
        "commonOnclick": "MathLivePasteFromButton(this)",
        "buttonsRows": [
            [
                {
                    "id": "fractionBtn",
                    "title": "Fraction (⌨: /)",
                    "value": "$$\\frac{\\blacksquare}{\\square}$$"
                },
                {
                    "id": "superscriptBtn",
                    "title": "Superscript (⌨: ^)",
                    "value": "$${\\blacksquare}^{\\square}$$"
                },
                {
                    "id": "subscriptBtn",
                    "title": "Subscript (⌨: _)",
                    "value": "$${\\blacksquare}_{\\square}$$"
                }
            ],
            [
                {
                    "id": "squareRootBtn",
                    "title": "Square root (⌨: sqrt)",
                    "value": "$$\\sqrt{\\blacksquare}$$"
                },
                {
                    "id": "generalRootBtn",
                    "title": "General root(⌨: \\sqrt[n])",
                    "value": "$$\\sqrt[{\\square}]{\\blacksquare}$$"
                },
                {
                    "id": "parenthesesBtn",
                    "title": "Parentheses",
                    "value": "$$\\Bigl{(}\\blacksquare\\Bigr{)}$$"
                }
            ],
            [
                {
                    "id": "squareBracketsBtn",
                    "title": "Square brackets",
                    "value": "$$\\Bigl{[}\\blacksquare\\Bigr{]}$$"
                },
                {
                    "id": "absoluteValueBtn",
                    "title": "Absolute value",
                    "value": "$$\\Bigl{|}\\blacksquare\\Bigr{|}$$"
                },
                {
                    "id": "floorBtn",
                    "title": "Floor",
                    "value": "$$\\Bigl{\\lfloor}\\blacksquare\\Bigr{\\rfloor}$$"
                },
                {
                    "id": "ceilingBtn",
                    "title": "Ceiling",
                    "value": "$$\\Bigl{\\lceil}\\blacksquare\\Bigr{\\rceil}$$"
                }
            ]
        ]
    },
    {
        "screenReadersTitle": "Additional symbols buttons",
        "label": "Geometry",
        "commonClass": "staticMath btn btn-symbol paletteButton",
        "commonOnclick": "MathLivePasteFromButton(this)",
        "buttonsRows": [
            [
                {
                    "id": "triangleBtn",
                    "title": "Triangle (⌨: \\triangle⏎)",
                    "value": "$$\\triangle$$"
                },
                {
                    "id": "angleBtn",
                    "title": "Angle (⌨: \\angle⏎)",
                    "value": "$$\\angle$$"
                },
                {
                    "id": "congruentBtn",
                    "title": "Congruent (⌨: \\cong⏎)",
                    "value": "$$\\cong$$"
                }
            ],
            [
                {
                    "id": "perpendicularBtn",
                    "title": "Perpendicular (⌨: \\perp⏎)",
                    "value": "$$\\perp$$"
                },
                {
                    "id": "parallelBtn",
                    "title": "Parallel (⌨: \\parallel⏎)",
                    "value": "$$\\parallel$$"
                },
                {
                    "id": "degreeBtn",
                    "title": "Degree (⌨: \\degree⏎)",
                    "value": "$$\\degree$$"
                }
            ],
            [
                {
                    "id": "piBtn",
                    "title": "Pi (⌨: pi⏎)",
                    "value": "$$\\pi$$"
                }
            ]
        ]
    }
]
