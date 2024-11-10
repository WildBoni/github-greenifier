# GitHub Greenifier

Make your GitHub greener than a rainforest! Thanks to GitHub Greenifier, a GitHub Action on a private repo will push a commit every X hour, so you can forget about green-timeline anxiety!

## Installation and Usage

GitHub Greenifier is pretty straightforward:

- Open a terminal and type **npx github-greenifier**
- The CLI will prompt you to specify an interval in hours for how frequently commits should be pushed. For example, enter **12** if you'd like commits to be pushed every 12 hours. The automated script will generate a folder named github-greenifier. Inside, you’ll find a placeholder .txt file and a GitHub Action configured to update that file at the interval you selected. A Git repository has already been initialized, and everything has been committed.
- Next, simply create a private repository on GitHub and push the github-greenifier project to it.
- That’s all! Now, every X hours, GitHub Greenifier will add a new line to the .txt file and push the changes, keeping your contribution graph active and green!

## DISCLAIMER: This project is made just for having fun!

The author believes that every developer learns at their own pace, and having an "all green" commit timeline shouldn't be the main goal for a developer, nor does it represent a reliable way for recruiters to distinguish between good and bad candidates. Learn at your own pace, strive to be consistent, but prioritize your mental health above all!
