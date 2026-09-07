# GoDaddy Deployment & RSS Automation Guide

## cPanel File Upload, PHP Configuration, Testing & Cron Automation

This guide explains how to deploy the RSS automation script and frontend files on **GoDaddy cPanel**, configure the required PHP extensions, test the live RSS synchronization, validate the Cron Job, and switch the automation to its normal production schedule.

> **Deployment strategy:** First run the Cron Job every **10 minutes** for initial validation. Once the RSS automation is confirmed to work correctly, change the same Cron Job to run every **2 hours**.

---

## Table of Contents

- [1. Upload Files via cPanel File Manager](#1-upload-files-via-cpanel-file-manager)
- [2. Enable Required PHP Extensions](#2-enable-required-php-extensions)
- [3. Test the Live PHP Script](#3-test-the-live-php-script)
- [4. Configure the Cron Job](#4-configure-the-cron-job)
  - [4.1 Initial Test Schedule — Every 10 Minutes](#41-initial-test-schedule--every-10-minutes)
  - [4.2 Validate the 10-Minute Test](#42-validate-the-10-minute-test)
  - [4.3 Production Schedule — Every 2 Hours](#43-production-schedule--every-2-hours)
- [5. Final Verification Checklist](#5-final-verification-checklist)
- [6. PHP Deployment Failure & Rollback](#6-php-deployment-failure--rollback)
- [7. Project Structure](#7-project-structure)

---

# 1. Upload Files via cPanel File Manager

### Step 1.1 — Open cPanel

1. Log in to your **GoDaddy account**.
2. Navigate to **Web Hosting**.
3. Click **Manage** next to your cPanel hosting plan.
4. Click **cPanel Admin** to open the cPanel dashboard.

### Step 1.2 — Open File Manager

1. Under the **Files** section, click **File Manager**.
2. Open the `public_html` directory. This is the website's root directory.

### Step 1.3 — Upload the Project Files

Upload the project files using the following structure:

- Create or place an empty `news.json` file directly inside `public_html/`.
- Upload the `automation/` folder containing `run.php` into `public_html/automation/`.
- Upload the frontend HTML files directly into `public_html/`.
- Upload the `css/` and `js/` folders directly into `public_html/`.

### Expected Project Structure

```text
public_html/
├── automation/
│   └── run.php
├── css/
├── js/
├── news.json
└── index.html
```

> **Important:** Keep the existing website files backed up before replacing or deleting any production files.

---

# 2. Enable Required PHP Extensions

1. Return to the main cPanel dashboard.
2. Under the **Software** section, click **Select PHP Version**.
3. Open the **Extensions** tab.
4. Make sure the following PHP extensions are enabled:

- `curl`
- `json`
- `mbstring`
- `libxml`
- `simplexml`

5. Click **Save** to apply the changes.

> **Note:** If your hosting environment uses a different PHP configuration interface, use the equivalent PHP extension management option provided by GoDaddy.

---

# 3. Test the Live PHP Script

Before configuring the Cron Job, confirm that the PHP script works manually.

### Step 3.1 — Run the PHP Script

Open the following URL in a browser:

```text
https://sosinfocity.com/automation/run.php
```

Verify that the script displays a text log indicating that the RSS feed synchronization completed successfully.

### Step 3.2 — Verify `news.json`

Open:

```text
https://sosinfocity.com/news.json
```

Confirm that fresh article data has been generated or updated.

### Continue Only After Successful Testing

If:

- `run.php` executes successfully,
- the RSS synchronization completes successfully, and
- `news.json` contains fresh article data,

then proceed to the Cron Job configuration.

If the PHP script fails, **do not continue with the Cron Job setup**. Follow the rollback procedure in [Section 6](#6-php-deployment-failure--rollback).

---

# 4. Configure the Cron Job

The Cron Job should be validated in two stages:

1. **Initial testing:** every 10 minutes.
2. **Production:** every 2 hours.

This approach confirms that the automation works before moving to the normal production schedule.

---

## 4.1 Initial Test Schedule — Every 10 Minutes

1. In cPanel, locate **Cron Jobs** under the **Advanced** section.
2. Under **Common Settings**, select an option for every 10 minutes if one is available.
3. Otherwise, configure the custom schedule below.

| Cron Field | Value |
|---|---|
| Minute | `*/10` |
| Hour | `*` |
| Day | `*` |
| Month | `*` |
| Weekday | `*` |

### Cron Command

Enter the following command in the **Command** field:

```bash
/usr/local/bin/php /home/yourcpanelusername/public_html/automation/run.php >/dev/null 2>&1
```

Replace `yourcpanelusername` with your actual cPanel account username.

### Important Command Syntax

There must be a **space** between the PHP binary path and the PHP script path:

```bash
/usr/local/bin/php /home/yourcpanelusername/public_html/automation/run.php
```

The `>/dev/null 2>&1` portion suppresses normal Cron output and redirects error output.

4. Click **Add New Cron Job**.

---

## 4.2 Validate the 10-Minute Test

Allow the Cron Job to run during the initial validation period.

After at least one or more scheduled executions:

1. Open:

   ```text
   https://sosinfocity.com/news.json
   ```

2. Confirm that the article data is being updated.
3. Verify that the RSS synchronization completes successfully.
4. Check that no PHP errors are reported.
5. Confirm that the website remains operational.

### Test Result

**If the test succeeds:** proceed to [Section 4.3](#43-production-schedule--every-2-hours).

**If the test fails:** delete the Cron Job and follow the rollback procedure in [Section 6](#6-php-deployment-failure--rollback).

---

## 4.3 Production Schedule — Every 2 Hours

After the 10-minute test has completed successfully, edit the **same Cron Job** and change the schedule to every 2 hours.

| Cron Field | Value |
|---|---|
| Minute | `0` |
| Hour | `*/2` |
| Day | `*` |
| Month | `*` |
| Weekday | `*` |

The command remains:

```bash
/usr/local/bin/php /home/yourcpanelusername/public_html/automation/run.php >/dev/null 2>&1
```

Click **Save** or **Update** to apply the new schedule.

The RSS automation will then run at **minute 0 of every second hour**.

---

# 5. Final Verification Checklist

Before considering the deployment complete, verify the following:

- [ ] Required files are uploaded to the correct `public_html` locations.
- [ ] `automation/run.php` is present.
- [ ] Required PHP extensions are enabled.
- [ ] `run.php` executes successfully from the live URL.
- [ ] `news.json` contains fresh article data.
- [ ] The 10-minute Cron test completed successfully.
- [ ] No PHP or RSS synchronization errors were reported.
- [ ] The Cron schedule was changed from every 10 minutes to every 2 hours.
- [ ] The website frontend, CSS, and JavaScript continue to work correctly.

---

# 6. PHP Deployment Failure & Rollback

If the PHP deployment, RSS synchronization, or Cron test fails, **do not continue with production automation**.

Restore the website to its previous working state before making further changes.

## 6.1 If the PHP Script Fails

1. Do not add or activate the Cron Job.
2. Open **cPanel → File Manager → `public_html`**.
3. Remove the newly uploaded `automation/` folder and `run.php` if they were added specifically for this deployment.
4. Remove the newly created `news.json` file if it was created specifically for this deployment.
5. Restore the previous versions of any frontend files that were replaced.
6. Open **cPanel → Select PHP Version → Extensions**.
7. If PHP extensions were changed specifically for this deployment and the original configuration needs to be restored, return them to their previous state.
8. Test the website.
9. Verify that the existing pages, CSS, JavaScript, and other functionality work normally.

## 6.2 If the Cron Job Was Already Added

If a Cron Job was created before the failure was identified:

1. Open **cPanel → Cron Jobs**.
2. Locate the RSS automation Cron Job.
3. Delete the Cron Job.
4. Confirm that no failed automation process continues to run.
5. Test the website again.

## 6.3 Rollback Verification

After rollback, confirm:

- [ ] The website loads normally.
- [ ] Existing frontend pages work correctly.
- [ ] CSS files load correctly.
- [ ] JavaScript files load correctly.
- [ ] The previous `news.json` file, if applicable, has been restored.
- [ ] No unwanted RSS automation process is running.
- [ ] No unwanted Cron Job remains active.
- [ ] The website has returned to its previous working state.

> **Important:** Always create a backup of existing website files and configuration before deployment. A backup provides a safe restore point if the PHP deployment or RSS automation fails.

---

# 7. Project Structure

The deployed website should follow this general structure:

```text
public_html/
│
├── automation/
│   └── run.php
│
├── css/
│   └── ...
│
├── js/
│   └── ...
│
├── news.json
│
└── index.html
```

---

# Deployment Flow

```text
Upload Files
     │
     ▼
Enable PHP Extensions
     │
     ▼
Test run.php Manually
     │
     ├── FAIL ──► Rollback
     │
     ▼
Verify news.json
     │
     ├── FAIL ──► Rollback
     │
     ▼
Cron Test: Every 10 Minutes
     │
     ├── FAIL ──► Delete Cron + Rollback
     │
     ▼
Verify RSS Updates
     │
     ▼
Change Cron to Every 2 Hours
     │
     ▼
Production Deployment Complete
```

---

## Live URLs

### RSS Automation Script

```text
https://sosinfocity.com/automation/run.php
```

### Generated News Data

```text
https://sosinfocity.com/news.json
```

---

## Deployment Status

**Initial Validation:** Every 10 minutes  
**Production Schedule:** Every 2 hours  
**Rollback:** Required whenever PHP deployment or RSS automation fails
