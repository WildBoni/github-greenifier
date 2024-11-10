#!/usr/bin/env node

import fs from "fs";
import path from "path";
import inquirer from "inquirer";

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
  const cronJobYml = `name: Auto Update File

on:
  schedule:
    - cron: "0 */${hours} * * *"

jobs:
  update-file:
    runs-on: ubuntu-latest
    env:
      GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Update text file
      run: echo "X" >> dummy_file.txt

    - name: Commit changes
      run: |
        git config --local user.name "github-actions[bot]"
        git config --local user.email "github-actions[bot]@users.noreply.github.com"
        git add dummy_file.txt
        git commit -m "Automated update - \$(date)" || echo "no changes to commit"

    - name: Push changes
      run: git push
      env:
        GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`;

  const targetDir = path.join(process.cwd(), ".github", "workflows");

  // Ensure the .github/workflows directory exists, create it if it doesn't
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const filePath = path.join(targetDir, "auto_update_file.yml");

  // Write the cron job YAML content to the file
  fs.writeFileSync(filePath, cronJobYml);

  console.log(`GitHub Actions cron job YAML file generated at "${filePath}"`);
}

// Run the function
generateCronJob().catch(console.error);
