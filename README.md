# Team Sentry - Backend

###TEAM Sentry - INSTALLATION

Step 1: Click on Fork at the top right corner

Step 2: Clone your forked repository

Step 3: cd into the cloned folded | <code>cd sentry-my-customer-backend</code>

Step 4: git remote add upstream https://github.com/hngi/sentry-my-customer-backend.git

Step 5: git pull upstream develop

Step 6: Check out to the task branch | <code>git checkout -b <NAME_OF_THE_TASK></code>

<code>e.g git checkout -b implemented_notification_api</code>


###TEAM SENTRY - Running the project locally

Step 1: npm install

Step 2: Copy env.example to .env

Step 3: npm run start

Step 4: Go to http://localhost:3000

A welcome message will come up with status code 200

#### Creating a pull request
Run <code>git branch</code> It should show that you are on your current branch

After implementing your task

Step 1: Run: git add .

Step 2: Run: git commit -m "< COMMIT MESSAGE >"

Step 3: git pull upstream develop

Step 4: git push origin < BRANCH_NAME >

Go to the repository https://github.com/hngi/sentry-my-customer-backend

As soon as you get there, you are going to see a green ‘compare and create a pull request’

Click on it, and type your message, click on create pull request.

If you have any more questions, please check out this resource -> https://www.youtube.com/watch?v=HbSjyU2vf6Y

[![Run on Repl.it](https://repl.it/badge/github/nerdyphil/sentry-my-customer-backend)](https://repl.it/github/nerdyphil/sentry-my-customer-backend)
