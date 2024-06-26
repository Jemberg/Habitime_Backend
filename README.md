# Habitime

Progressive Web Application made for task management created as a part of a Bachelor Thesis project at Ventspils University of Applied Sciences.

## Features

- User authentication via JsonWebTokens.
- Creating, reading, updating and deleting user created habits, tasks and periodical tasks.
- Ability to group or sort tasks by priority, category.
- Chance to repeat tasks via periodical tasks functionality multiple times a day/week/month.
- Progressive Web Application features like partial offline access, push notifications, faster loading times etc.

## Technologies

The application has been fully developed in Javascript, with plans to convert it fully to Typescript in future updates. The application uses the MERN stack and other NPM packages used in the application can be found in ```packages.json``` files.

- Node.JS
- JsonWebTokens
- ReactJS
- MongoDB
- Semantic UI CSS
- ExpressJS

## Installation

1. Install necessary dependencies for the front-end and back-end with the command ```npm ci```.
2. (If semantic-ui-css version is < 2.5.0) Currently, before the front-end is started with ```npm start``` a fix has to be applied, where the files in ```node_modules/semantic-ui-css``` have to be edited. Double semi-colons have to be removed from the files ```semantic.min.css``` and ```semantic.css``` and have to be replaced with a single semi-colon.
3. Add environment variables according to the ```.env.example``` file located in both the front-end and back-end directories by creating a ```.env``` file, as well as create a ```serviceAccountKey.json``` file according to the example given from your Firebase Realtime Database configuration.

If you are using the included Dockerfile, then please use the ENV variable declaration spots in the Dockerfile instead of .env.
To build and run the Dockerfile:
1. docker build -t habitime-backend .
2. docker run -d -p 3000:3000 --name habitime-backend habitime-backend

IMPORTANT: For the back-end to function properly, a MongoDB instance has to be connected, the application is not functional without a database.

## Run

NOTE: Be warned, this application is deprecated by now and needs heavy updates to work properly and safely. For further details on maintenance or other questions please reach out to me.
To start the back-end, simply type ```npm run dev```, the back-end has two different options for starting: ```npm start``` will start the application in development mode, but to have push notifications work, the front-end has to be built via ```npm run build``` and afterwards ```serve -s build```. 


## Licence

This project is under the GNU General Public Licence v3.0.
