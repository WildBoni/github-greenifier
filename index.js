#!/usr/bin/env node

import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { execSync } from "child_process";

function isGitInstalled() {
  try {
    execSync("git --version", { stdio: "ignore" });
    return true;
  } catch (error) {
    return false;
  }
}

async function generateCronJob() {
  // Ask the user for input
  const { hours } = await inquirer.prompt([
    {
      type: "input",
      name: "hours",
      message: "Enter the number of hours for the cron interval:",
      validate(input) {
        const num = parseInt(input, 10);
        if (isNaN(num) || num <= 0) {
          return "Please enter a valid positive number.";
        }
        return true;
      },
    },
  ]);

  // Generate the cron job YAML content
  const cronJobYml = `
    name: Auto Update File

    on:
      schedule:
        - cron: "0 */${hours} * * *"

    permissions:
      contents: write

    jobs:
      update-file:
        runs-on: ubuntu-latest

        steps:
        - name: Checkout repository
          uses: actions/checkout@v4

        - name: Update text file
          run: echo "\$(date)" >> dummy_file.txt

        - name: Commit changes
          run: |
            git config --local user.name "github-actions[bot]"
            git config --local user.email "github-actions[bot]@users.noreply.github.com"
            git add dummy_file.txt
            git commit -m "Automated update - \$(date)" || echo "no changes to commit"

        - name: Push changes
          run: git push
  `;

  const projectFolderPath = path.join(process.cwd(), "github-greenifier");
  if (!fs.existsSync(projectFolderPath)) {
    fs.mkdirSync(projectFolderPath, { recursive: true });
  }

  const githubWorkflowDir = path.join(
    process.cwd(),
    "github-greenifier",
    ".github",
    "workflows"
  );
  if (!fs.existsSync(githubWorkflowDir)) {
    fs.mkdirSync(githubWorkflowDir, { recursive: true });
  }

  const githubActionFilePath = path.join(
    githubWorkflowDir,
    "auto_update_file.yml"
  );

  // Write the cron job YAML content to the file
  fs.writeFileSync(githubActionFilePath, cronJobYml);

  console.log(
    `GitHub Actions cron job YAML file generated at "${githubActionFilePath}"`
  );

  // Define the path for dummy_file.txt in the root directory of the project
  const dummyFilePath = path.join(projectFolderPath, "dummy_file.txt");

  // Check if dummy_file.txt already exists, if not, create it with initial content
  if (!fs.existsSync(dummyFilePath)) {
    fs.writeFileSync(dummyFilePath, "Initial content for dummy file\n");
    console.log(
      `dummy_file.txt created at "${dummyFilePath}" with initial content.`
    );
  } else {
    console.log(`dummy_file.txt already exists at "${dummyFilePath}".`);
  }

  if (isGitInstalled()) {
    // Initialize a Git repository
    execSync("git init", { cwd: projectFolderPath });

    // Add the test.txt file to the staging area
    execSync("git add .", { cwd: projectFolderPath });

    // Commit the changes with a message
    try {
      execSync('git commit -m "GitHub Greenifier initialized"', {
        cwd: projectFolderPath,
        stdio: "inherit",
      });
    } catch (error) {
      console.error("Error committing the changes:", error.message);
    }

    console.log(
      "Project successfully created: push it on a private GitHub repo and let Greenifier take care of the rest."
    );
  } else {
    console.log(
      'Git is not installed. The folder "github-greenifier" has been created with the test.txt file, but Git initialization and commit were skipped.'
    );
  }
}

// Run the function
generateCronJob().catch(console.error);
