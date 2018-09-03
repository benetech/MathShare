# MathShare
This is a step by step editor built on top of mathlive. 

Open index.html to see a list of sample problems. Clicking on one of them will take you to the editor. Debug/index.html is for being able to debug mathlive code as well as this project's code and requires a few other files.

# Acknowledgement
Benetech and its funding partners are developing this tool to benefit all kids, regardless of their abilities, to learn and do math.

# Building and running
To make the MathShare application work properly there is a need to run the **MathShareBackend** server first. To do so, please follow the instruction: 
* https://github.com/benetech/MathShareBackend

## Dependencies
MathShare uses **npm** for a development process. 
* for Linux, install npm 
```
sudo apt-get install npm
```
* for Windows it may be simply to use nodeJS installer which allows to install npm as well
http://blog.teamtreehouse.com/install-node-js-npm-windows

To install all required dependencies use: 
```
npm install
``` 
## Running
To run MathShare locally on port 8080 use: 
```
npm start
``` 
or 
```
npm run start
```

## Debugging
If you want to debug MathLive from its original sources, you need to put them into the root folder and run: 
```
npm run debug
```
In this case, the application will use sources you've provided, assuming that the files structure is preserved (mathlive/src/mathlive.js as the main script). 

Additionally, React requires quite different file paths, that those used the 'define' statement in the MathLive library. To use it properly, 
* replace ```mathlive/``` in these statements to ```./``` in mathlive.js 
* replace ```mathlive/``` to ```../``` in all js files from subdirectories

Note that from time to time, the debugger won't stop on the breakpoint in imported sources - in this case simply put ```debugger;``` at the line you want to stop, and the debugger should stop there. After that debugger should use this file normally and you can remove this line and use casual breakpoints.
