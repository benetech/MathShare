// A simple data API that will be used to get the data for our problems for now
const ProblemAPI = {
    problems: [
      { number: 1, 
        equation: "3(-\\frac{1}{6})(-\\frac{2}{5})",
        annotation: "LOCAL Find the product" },
      { number: 2, 
        equation: "-\\frac{2}{5}(-\\frac{1}{2})(-\\frac{5}{6})", 
        annotation: "LOCAL Find the product" },
      { number: 3, 
        equation: "\\frac{55}{\\frac{1}{2}}", 
        annotation: "LOCAL Find the quotient" },
      { number: 4, 
        equation: "\\frac{3}{10}\\div (\\frac{5}{8})", 
        annotation: "LOCAL Find the quotient" },
      { number: 5, 
        equation: "", 
        annotation: "LOCAL Sarah works at a coffee shop. Her weekly salary is $325 and she earns 11.5% commission on sales. How much does she make if she sells $2800 in merchandise?" },
      { number: 6, 
        equation: "7x-13=1", 
        annotation: "LOCAL Solve for x" },
      { number: 7, 
        equation: "\\frac{b}{9}-34\\leq -36", 
        annotation: "LOCAL Solve the inequality" },
      { number: 8, 
        equation: "", 
        annotation: "LOCAL Try your own problem" }
    ],
    all: function() { return this.problems},
    get: function(id) {
      const isProblem = p => p.number === id
      return this.problems.find(isProblem)
    }
  }
  
  export default ProblemAPI
  