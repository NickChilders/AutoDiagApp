# Getting Started

Clone the repository:<br>
```
git clone https://github.com/<username>/<repository>.git
```
Replace "username" with your GitHub username and "repository" with the name of the repository you created.<br>
<br>
Move into the cloned repository:<br>
```
cd <repository>
```
Replace "repository" with the name of the repository you created.
<br>
<br>
To ensure you have the latest version of the code, pull any changes made to the repository:<br>
```
git pull origin master
```
This will pull the latest changes made to the "master" branch of the repository.
<br>
If you want to update your local repository with any further changes made to the remote repository in the future, you can simply run the same `git pull` command again.
<br>

# Before starting to make code changes, please ensure you have all dependencies installed.

### Follow these steps to do so:
You need to have node.js and npm installed on your machine.
<br>
In order to install Node.js and npm on your machine you can use the instructions found here:
<br>
https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
<br>
<br>
Once you have installed Node.js and npm and you have all code files on your machine, you must now add the dependencies.
<br>
run the following command:
<br>
```
npm install
```
<br>
Copy the .env-example file and create a new .env file
<br>
Contact the code owner for the RAPID_KEY and RAPID_HOST variables. Add them to the .env file you just created.
<br>
Now you should be able to run npm start successfully.
<br>

### Note:
You must have the server code running in a separate terminal in order to run the app properly.<br>
If you do not have the server code running, you will not be able to log in or register.

#### Link to Server Code:
https://github.com/NickChilders/AutoDiagServer
<br>
<br>
To stop the code from running hit `CTRL+C` on Windows or `Cmd+C` on Mac.
<br>
<br>
Now we need to create a separate branch to work with. This will prevent undesired code changes to the master branch.
<br>
```
git checkout -b your_name_branch
```
Replace "your_name_branch" with your name. (example: nickc_branch)
<br>
You can now make changes to the code on this new branch. 
<br>
When you are ready to commit your changes check the status to verify all of the changed files.
```
git status
```
If everything looks correct add the changed files.
<br>
```
git add <changed files>
```

OR
<br>
```
git add .
```
to add all changed files.
<br>
Now you are ready to commit the changes.
<br>
```
git commit -m "Decription of changes that were made"
```
Once you have committed your changes, you can push the new branch to GitHub using the push command.
```
git push --set-upstream origin your_name_branch
```
<br>
Your new branch is now available on GitHub, and you can continue making changed to the code on this branch as needed.
<br>
<br>
To request approval for a new branch to be merged into the master branch, you must create a pull request.
<br>
<br>
&emsp;1. Go to the repository on GitHub where your branch is located.
<br>
&emsp;2. Click on the "New pull request" button.
<br>
&emsp;3. Select the master branch and the branch you created.
<br>
&emsp;4. GitHub will show you the changes that have been made in your branch. Review these changes to make sure everything looks correct.
<br>
&emsp;5. Write a brief description of the changes you have made and why they were necessary.
<br>
&emsp;6. Assign the pull request to the team for review.
<br>
&emsp;7. Click on the "Create pull request" button.
<br>
<br>
Once the pull request is created, the team you assigned will receive a notification. They can review the changes and leave comments or requests for changes. Once they are satisfied with the changes, they can approve the pull request and merge the new branch into the master branch.
<br>
<br>


<br>
<br>
<br>
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
