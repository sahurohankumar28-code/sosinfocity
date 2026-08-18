<?php
// Set JSON response header
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method.'
    ]);
    exit;
}

// -------------------------------------------------------------
// CONFIGURATION
// -------------------------------------------------------------
// 1. Where you want to RECEIVE the job applications:
$toEmail = "hr@sosinfocity.in"; // e.g. hr@sosinfocity.com or your_personal@gmail.com

// 2. Sender address on your GoDaddy domain (avoids spam filters):
$fromEmail = "noreply@sosinfocity.com";

// -------------------------------------------------------------
// FORM DATA SANITIZATION
// -------------------------------------------------------------
$candidateName     = htmlspecialchars(trim($_POST['candidateName'] ?? ''));
$candidateEmail    = filter_var(trim($_POST['candidateEmail'] ?? ''), FILTER_SANITIZE_EMAIL);
$callNumber        = htmlspecialchars(trim($_POST['callNumber'] ?? ''));
$whatsappNumber    = htmlspecialchars(trim($_POST['whatsappNumber'] ?? ''));
$addressDetails    = htmlspecialchars(trim($_POST['addressDetails'] ?? ''));
$appliedRole       = htmlspecialchars(trim($_POST['appliedRole'] ?? 'General Application'));
$hasExperience     = htmlspecialchars(trim($_POST['hasExperience'] ?? 'No'));
$experienceDetails = htmlspecialchars(trim($_POST['experienceDetails'] ?? 'None provided'));
$linkedinUrl       = htmlspecialchars(trim($_POST['linkedinUrl'] ?? ''));

// Validate required fields
if (empty($candidateName) || empty($candidateEmail) || empty($callNumber) || empty($addressDetails)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Please fill in all required fields.'
    ]);
    exit;
}

// -------------------------------------------------------------
// EMAIL CONTENT & HEADERS
// -------------------------------------------------------------
$subject = "New Job Application: " . $appliedRole . " - " . $candidateName;

$messageHtml = "
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
    .header { background: #0f172a; color: #fff; padding: 16px 20px; }
    .content { padding: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    td { padding: 8px 12px; border-bottom: 1px solid #f1f5f9; }
    .label { font-weight: bold; width: 35%; color: #64748b; }
  </style>
</head>
<body>
  <div class='container'>
    <div class='header'>
      <h2 style='margin:0;'>New Job Application</h2>
      <p style='margin:4px 0 0 0; font-size:14px;'>Role: {$appliedRole}</p>
    </div>
    <div class='content'>
      <table>
        <tr><td class='label'>Full Name</td><td>{$candidateName}</td></tr>
        <tr><td class='label'>Email</td><td><a href='mailto:{$candidateEmail}'>{$candidateEmail}</a></td></tr>
        <tr><td class='label'>Contact Number</td><td>{$callNumber}</td></tr>
        <tr><td class='label'>WhatsApp</td><td>{$whatsappNumber}</td></tr>
        <tr><td class='label'>Residential Address</td><td>{$addressDetails}</td></tr>
        <tr><td class='label'>Prior Experience?</td><td>{$hasExperience}</td></tr>
        <tr><td class='label'>Experience Details</td><td>" . nl2br($experienceDetails) . "</td></tr>
        <tr><td class='label'>LinkedIn Profile</td><td>" . (!empty($linkedinUrl) ? "<a href='https://linkedin.com/in/{$linkedinUrl}' target='_blank'>linkedin.com/in/{$linkedinUrl}</a>" : "N/A") . "</td></tr>
      </table>
    </div>
  </div>
</body>
</html>
";

$boundary = md5(uniqid(time()));

// Mail headers
$headers = "From: SOS Infocity Applications <{$fromEmail}>\r\n";
$headers .= "Reply-To: {$candidateName} <{$candidateEmail}>\r\n"; // Clicking reply responds directly to the candidate
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"\r\n";

// Multipart body
$body = "--{$boundary}\r\n";
$body .= "Content-Type: text/html; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
$body .= $messageHtml . "\r\n";

// -------------------------------------------------------------
// RESUME ATTACHMENT PROCESSING
// -------------------------------------------------------------
if (isset($_FILES['resumeFile']) && $_FILES['resumeFile']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath  = $_FILES['resumeFile']['tmp_name'];
    $fileName     = basename($_FILES['resumeFile']['name']);
    $fileSize     = $_FILES['resumeFile']['size'];
    $fileMimeType = mime_content_type($fileTmpPath);

    // Max 1MB (1,048,576 bytes)
    if ($fileSize <= 1048576) {
        $fileContent = file_get_contents($fileTmpPath);
        $encodedFile = chunk_split(base64_encode($fileContent));

        $body .= "--{$boundary}\r\n";
        $body .= "Content-Type: {$fileMimeType}; name=\"{$fileName}\"\r\n";
        $body .= "Content-Disposition: attachment; filename=\"{$fileName}\"\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= $encodedFile . "\r\n";
    }
}

$body .= "--{$boundary}--";

// -------------------------------------------------------------
// SEND VIA GODADDY MAIL
// -------------------------------------------------------------
if (@mail($toEmail, $subject, $body, $headers)) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Application submitted successfully! Our team will contact you soon.'
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to send application. Please check your connection or try again later.'
    ]);
}
?>