# Exercise Tracker REST API

#### An exercise tracking application utilizing Mongodb, React Express, Node and CSS Grid.

### Installation Instructions
Clone and download the repo.  Make sure node and npm are installed.  
Open a node terminal to the root folder of the repo and type npm install
type cd client to enter the client folder.  Type npm install to install React dependencies.

### Running Instructions
After installation in the root folder type npm start in terminal.  The backend server should start.
cd client to get into the client folder.
Type npm start in the client folder and a new browser window should open with the app running.

Live Version: http://exercise-now.herokuapp.com/

### User Stories

1. I can create a user by posting form data username to /api/exercise/new-user and returned will be an object with username and _id.
2. I can see a display of all users showing userId and username for each user.
3. I can add an exercise to any user by posting form data userId(_id), description, duration, and optionally date into the form. If no date supplied it will use current date. Returned will the the user object with also with the exercise fields added.
4. I can retrieve a full exercise log of any user by searching the form using a userId(_id). Return will be the user object with added array log and count (total exercise count).
5. I can retrieve part of the log of any user by also passing along optional parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)

### Screenshots
![Alt text](https://raw.githubusercontent.com/tmstani23/exercise-now/master/ss1.jpg)
