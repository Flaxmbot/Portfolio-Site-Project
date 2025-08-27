# Node.js and npm Fix 
 
This project had an issue with the Node.js installation where npm was missing. 
 
## Solution 
 
1. Downloaded npm package manually 
2. Extracted npm package to local `package` directory 
3. Created `npm.bat` script to use local npm 
 
## Usage 
 
Use `npm.bat` instead of `npm` for all npm commands. 
 
Example: `npm.bat install`, `npm.bat run dev`, etc. 
