# super_campaign
<b>Getting Started</b>:
From within the project directory in the terminal run the following commands
1) npm install 
2) npm run watch 
  
<b>About the Build Process</b>:<br>
1) npm install - This installs all the packages from within node_modules.
2) npm run watch - Builds the application. You might need to install yarn. 

Keep all the code you right within the src directory. When the project is compiled all the js files get put in the dist directory. The dist folder is what is actually running. 


<b>NOTE</b><br>
I'm going to be changing how it's structured as the semester goes on. I just wanted to get something together that allows us to all start working on it. 

The full folder structure of this app is explained below:

> **Note!** Make sure you have already built the app using `npm run watch`

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **.vscode**              | Contains VS Code specific settings                                                            |
| **dist**                 | Contains the distributable (or output) from our TypeScript build. This is the code we deploy  |
| **node_modules**         | Contains all our npm dependencies                                                             |
| **src**                  | Contains our source code that will be compiled to the dist dir                                |
| **src/config**           | Passport authentication strategies and login middleware. Database script                      |
| **src/controllers**      | Controllers define functions that respond to various http requests                            |
| **src/public**           | Static assets that will be used client side                                                   |
| **src/backend**		   | Contains our source code for the server side 												   |
| **src**/server.ts        | Entry point to your express app                                                               |
| **test**                 | Contains your tests. Seperate from source because there is a different build process.         |
| **views**                | Views define how your app renders on the client. In this case we're using pug                 |
| package.json             | File that contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped)                          |
| tsconfig.json            | Config settings for compiling server code written in TypeScript                               |
| ormconfig.json 		   | Config settings for TypeORM. Where you specifiy the DB credentials and connection			   |


# Where I'm getting structure from
https://github.com/Microsoft/TypeScript-Node-Starter
