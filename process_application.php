<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
    exit;
}

$toEmail = 'hr@sosinfocity.in';

// 1. Inputs Sanitization
$appliedRole       = htmlspecialchars(strip_tags($_POST['appliedRole'] ?? 'General Application'));
$candidateName     = htmlspecialchars(strip_tags($_POST['candidateName'] ?? ''));
$candidateEmail    = filter_var($_POST['candidateEmail'] ?? '', FILTER_SANITIZE_EMAIL);
$callNumber        = htmlspecialchars(strip_tags($_POST['callNumber'] ?? ''));
$whatsappNumber    = htmlspecialchars(strip_tags($_POST['whatsappNumber'] ?? ''));
$addressDetails    = htmlspecialchars(strip_tags($_POST['addressDetails'] ?? ''));
$hasExperience     = htmlspecialchars(strip_tags($_POST['hasExperience'] ?? 'No'));
$experienceDetails = htmlspecialchars(strip_tags($_POST['experienceDetails'] ?? 'N/A'));
$linkedinUrl       = htmlspecialchars(strip_tags($_POST['linkedinUrl'] ?? 'N/A'));

// 2. Server-side Validation
if (empty($candidateName) || empty($candidateEmail) || empty($callNumber) || empty($whatsappNumber) || empty($addressDetails)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Please fill in all required fields.']);
    exit;
}

if (!filter_var($candidateEmail, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address provided.']);
    exit;
}

// 3. Handle File Upload Validation
if (!isset($_FILES['resumeFile']) || $_FILES['resumeFile']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Please upload a valid resume file (PDF or DOCX).']);
    exit;
}

$fileTmpPath = $_FILES['resumeFile']['tmp_name'];
$fileName    = $_FILES['resumeFile']['name'];
$fileSize    = $_FILES['resumeFile']['size'];
$fileType    = $_FILES['resumeFile']['type'];

$ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
$allowedExts = ['pdf', 'docx', 'doc'];

if (!in_array($ext, $allowedExts)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid file format. Only PDF, DOC, and DOCX are allowed.']);
    exit;
}

// 5MB Max File Size limit
if ($fileSize > 5 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Resume file size must be less than 5MB.']);
    exit;
}

// 4. Build Multipart Email with Resume Attachment
$boundary = md5(time());

$subject = "New Job Application: " . $candidateName . " - " . $appliedRole;

$headers  = "From: SOS Application Portal <noreply@" . $_SERVER['SERVER_NAME'] . ">\r\n";
$headers .= "Reply-To: " . $candidateName . " <" . $candidateEmail . ">\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"" . $boundary . "\"\r\n";

// Text Message Body
$bodyText  = "New Candidate Application Submitted:\n\n";
$bodyText .= "--------------------------------------------------\n";
$bodyText .= "Target Role:       " . $appliedRole . "\n";
$bodyText .= "Candidate Name:    " . $candidateName . "\n";
$bodyText .= "Email Address:     " . $candidateEmail . "\n";
$bodyText .= "Contact Number:    " . $callNumber . "\n";
$bodyText .= "WhatsApp Number:   " . $whatsappNumber . "\n";
$bodyText .= "Address:           " . $addressDetails . "\n";
$bodyText .= "--------------------------------------------------\n";
$bodyText .= "Prior Experience:  " . $hasExperience . "\n";
if ($hasExperience === 'Yes') {
    $bodyText .= "Experience Details:\n" . $experienceDetails . "\n";
}
$bodyText .= "--------------------------------------------------\n";
$bodyText .= "LinkedIn:          " . ($linkedinUrl ? "https://linkedin.com/in/" . $linkedinUrl : "N/A") . "\n";
$bodyText .= "--------------------------------------------------\n";

$body  = "--" . $boundary . "\r\n";
$body .= "Content-Type: text/plain; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
$body .= $bodyText . "\r\n";

// Attach File
$fileContent = chunk_split(base64_encode(file_get_contents($fileTmpPath)));

$body .= "--" . $boundary . "\r\n";
$body .= "Content-Type: " . $fileType . "; name=\"" . $fileName . "\"\r\n";
$body .= "Content-Disposition: attachment; filename=\"" . $fileName . "\"\r\n";
$body .= "Content-Transfer-Encoding: base64\r\n\r\n";
$body .= $fileContent . "\r\n";
$body .= "--" . $boundary . "--";

// 5. Send Mail
if (mail($toEmail, $subject, $body, $headers)) {
    echo json_encode([
        'status'  => 'success',
        'message' => 'Application submitted successfully! Our HR team will reach out to you.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Server error while sending application. Please try again later.'
    ]);
}