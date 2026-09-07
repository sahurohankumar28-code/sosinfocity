GoDaddy Deployment & RSS Automation Guide
cPanel File Upload, PHP Configuration, Testing & Cron Automation

Purpose. This guide explains how to deploy the RSS automation script and frontend files on GoDaddy cPanel, configure the required PHP extensions, test the live feed synchronization, and schedule automatic feed updates using a Cron Job.
Step 1: Upload Files via cPanel File Manager
1.	Log in to your GoDaddy account, navigate to Web Hosting, and click Manage next to your cPanel hosting plan.
2.	Click cPanel Admin to open your cPanel dashboard.
3.	Under the Files section, click File Manager.
4.	Open the public_html folder, which is the root directory of your website.
5.	Upload the following project structure:
•	Create or place an empty news.json file directly inside public_html/.
•	Upload the automation/ folder containing run.php into public_html/automation/.
•	Upload the frontend HTML files, along with the css/ and js/ folders, directly into public_html/.
Expected project structure:
public_html/
├── automation/
│   └── run.php
├── css/
├── js/
├── news.json
└── index.html
Step 2: Enable Required PHP Extensions on GoDaddy
6.	Return to the main cPanel dashboard.
7.	Under the Software section, click Select PHP Version.
8.	Open the Extensions tab and ensure that the following PHP extensions are enabled:
•	curl
•	json
•	mbstring
•	libxml
•	simplexml
9.	Click Save to apply the changes.
Step 3: Test the Live PHP Script
10.	Open the following URL in your web browser:
https://sosinfocity.com/automation/run.php
11.	Verify that the script displays a text log confirming that the RSS feed synchronization completed successfully.
12.	Open the following URL to confirm that fresh article data has been populated:
https://sosinfocity.com/news.json
Important: If the PHP script executes successfully and fresh article data is populated in news.json, proceed to Step 4. If the PHP deployment or script fails, follow Step 5 and do not proceed with the Cron Job setup.
Step 4: Automate Feed Updates with a GoDaddy Cron Job
For initial validation, configure the Cron Job to run every 10 minutes. After the PHP script and RSS synchronization have been verified successfully, change the same Cron Job to run every 2 hours for normal production operation.
Initial Test Schedule - Every 10 Minutes
In your cPanel dashboard, locate the Cron Jobs tool under the Advanced section.
Under Common Settings, select the option for every 10 minutes, if available. Otherwise, configure the custom schedule below:
Cron Field	Value
Minute	*/10
Hour	*
Day	*
Month	*
Weekday	*
Enter the Cron command:
/usr/local/bin/php /home/yourcpanelusername/public_html/automation/run.php >/dev/null 2>&1
Replace yourcpanelusername with your actual cPanel login username.
Important: There must be a space between the PHP binary path and the script path.
/usr/local/bin/php /home/yourcpanelusername/public_html/automation/run.php
Click Add New Cron Job.
10-Minute Test and Validation
13.	Allow the Cron Job to execute for the initial test period.
14.	Open https://sosinfocity.com/news.json and confirm that fresh article data is being updated.
15.	Verify that the RSS synchronization completes successfully and that no PHP errors are reported.
16.	If the test is successful, proceed to the production schedule below.
17.	If the test fails, delete the Cron Job and follow Step 5: PHP Deployment Failure & Rollback Procedure.
Production Schedule - Every 2 Hours
After the 10-minute test has completed successfully, edit the same Cron Job and change the schedule to every 2 hours:
Cron Field	Value
Minute	0
Hour	*/2
Day	*
Month	*
Weekday	*
Save the updated Cron Job. The RSS automation will then run automatically at minute 0 of every second hour.
Step 5: PHP Deployment Failure & Rollback Procedure
Important: If the PHP deployment or RSS automation does not work successfully, do not continue with the Cron Job setup. Revert the deployment changes and restore the previous working configuration.
If the PHP Script Fails
18.	Do not add or activate the Cron Job.
19.	Open cPanel → File Manager → public_html.
20.	Remove the newly uploaded automation/ folder and run.php if they were added specifically for this deployment.
21.	Remove the newly created news.json file if it was created specifically for this deployment.
22.	Restore the previous versions of any frontend files that were replaced during deployment.
23.	Open cPanel → Select PHP Version → Extensions.
24.	If any PHP extensions were enabled specifically for this deployment and the previous configuration needs to be restored, return them to their original state.
25.	Test the website to confirm that the previous version is working correctly.
26.	Verify that the existing website pages, CSS, JavaScript, and other functionality are operating normally.
If the Cron Job Was Already Added
Important: If a Cron Job was created before the failure was identified, remove it before completing the rollback.
27.	Open cPanel → Cron Jobs.
28.	Locate the RSS automation Cron Job.
29.	Delete the Cron Job to prevent the failed script from running automatically.
30.	Confirm that the website continues to operate normally.
Rollback Verification
•	☐ The website loads normally.
•	☐ Existing frontend pages work correctly.
•	☐ CSS and JavaScript files load correctly.
•	☐ The previous news.json file, if applicable, is restored.
•	☐ No failed RSS automation process is running.
•	☐ No unwanted Cron Job remains active.
•	☐ The website has been returned to its previous working state.
Important: Always keep a backup of the existing website files and configuration before making deployment changes. This allows the previous working version to be restored safely if the PHP deployment fails.
