# 
1. Update the Version of React-Scripts
You can update the version of your project’s react-scripts by running the following command in your terminal:
```
// npm
npm install react-scripts@latest

// yarn
yarn add react-scripts@latest
```

2. Delete Node_modules Folder and package-lock.json File
if the error persists, then it’s possible some of your dependencies may be wrongly installed. You can fix this by deleting your node_modules folder and package-lock.json file (not package.json). Then run the following command to install the packages afresh:
```
npm install
```

Then restart your dev server.

3. Update the Versions of React and React-Dom
Finally, if the error persists, update your versions of react and react-dom using the commands below:
```
// npm
npm install react@latest react-dom@latest

// if you use TypeScript
npm install --save-dev @types/react@latest @types/react-dom@latest

// OR

// Yarn
yarn add react@latest react-dom@latest

// if you use TypeScript
yarn add @types/react@latest @types/react-dom@latest --dev
```