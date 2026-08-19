<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

// -------------------------------------------------------------
// CONFIGURATION
// -------------------------------------------------------------
$toEmail   = "rohankumar.sahu@sosinfocity.in"; // Receiver email
$fromEmail = "info@sosinfocity.com";                    // Domain sender email

$candidateName     = htmlspecialchars(trim($_POST['candidateName'] ?? ''));
$candidateEmail    = filter_var(trim($_POST['candidateEmail'] ?? ''), FILTER_SANITIZE_EMAIL);
$callNumber        = htmlspecialchars(trim($_POST['callNumber'] ?? ''));
$whatsappNumber    = htmlspecialchars(trim($_POST['whatsappNumber'] ?? ''));
$addressDetails    = htmlspecialchars(trim($_POST['addressDetails'] ?? ''));
$appliedRole       = htmlspecialchars(trim($_POST['appliedRole'] ?? 'General Application'));
$hasExperience     = htmlspecialchars(trim($_POST['hasExperience'] ?? 'No'));
$experienceDetails = htmlspecialchars(trim($_POST['experienceDetails'] ?? 'None'));
$linkedinUrl       = htmlspecialchars(trim($_POST['linkedinUrl'] ?? ''));

if (empty($candidateName) || empty($candidateEmail) || empty($callNumber) || empty($addressDetails)) {
    echo json_encode(['status' => 'error', 'message' => 'Please fill in all required fields.']);
    exit;
}

$subject = "New Application: " . $appliedRole . " - " . $candidateName;

$messageHtml = "
<html>
<body style='font-family:Arial,sans-serif;'>
  <h2>New Job Application</h2>
  <p><strong>Role:</strong> {$appliedRole}</p>
  <table cellpadding='6' cellspacing='0' style='width:100%; border:1px solid #ccc;'>
    <tr><td><strong>Candidate Name:</strong></td><td>{$candidateName}</td></tr>
    <tr><td><strong>Email:</strong></td><td>{$candidateEmail}</td></tr>
    <tr><td><strong>Phone:</strong></td><td>{$callNumber}</td></tr>
    <tr><td><strong>WhatsApp:</strong></td><td>{$whatsappNumber}</td></tr>
    <tr><td><strong>Address:</strong></td><td>{$addressDetails}</td></tr>
    <tr><td><strong>Experience:</strong></td><td>{$hasExperience}</td></tr>
    <tr><td><strong>Details:</strong></td><td>" . nl2br($experienceDetails) . "</td></tr>
    <tr><td><strong>LinkedIn:</strong></td><td>{$linkedinUrl}</td></tr>
  </table>
</body>
</html>";

$boundary = md5(uniqid(time()));

// Build full MIME message
$data = "From: SOS Infocity <{$fromEmail}>\r\n";
$data .= "To: {$toEmail}\r\n";
$data .= "Reply-To: {$candidateEmail}\r\n";
$data .= "Subject: {$subject}\r\n";
$data .= "MIME-Version: 1.0\r\n";
$data .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"\r\n\r\n";

// HTML part
$data .= "--{$boundary}\r\n";
$data .= "Content-Type: text/html; charset=UTF-8\r\n";
$data .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
$data .= $messageHtml . "\r\n\r\n";

// Attachment
if (isset($_FILES['resumeFile']) && $_FILES['resumeFile']['error'] === UPLOAD_ERR_OK) {
    $fileName = basename($_FILES['resumeFile']['name']);
    $fileMime = mime_content_type($_FILES['resumeFile']['tmp_name']);
    $fileContent = chunk_split(base64_encode(file_get_contents($_FILES['resumeFile']['tmp_name'])));

    $data .= "--{$boundary}\r\n";
    $data .= "Content-Type: {$fileMime}; name=\"{$fileName}\"\r\n";
    $data .= "Content-Disposition: attachment; filename=\"{$fileName}\"\r\n";
    $data .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $data .= $fileContent . "\r\n\r\n";
}
$data .= "--{$boundary}--\r\n";

// -------------------------------------------------------------
// SEND VIA GODADDY INTERNAL RELAY (PORT 25)
// -------------------------------------------------------------
$smtpServer = "relay-hosting.secureserver.net";
$port       = 25;
$timeout    = 15;

$socket = @fsockopen($smtpServer, $port, $errno, $errstr, $timeout);

if (!$socket) {
    // Fallback to standard mail
    $headers = "From: {$fromEmail}\r\nReply-To: {$candidateEmail}\r\nMIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary=\"{$boundary}\"";
    mail($toEmail, $subject, $messageHtml, $headers, "-f" . $fromEmail);
    echo json_encode(['status' => 'success', 'message' => 'Application submitted successfully!']);
    exit;
}

function get_response($socket) {
    $res = "";
    while ($str = fgets($socket, 515)) {
        $res .= $str;
        if (substr($str, 3, 1) == " ") break;
    }
    return $res;
}

get_response($socket);
fputs($socket, "HELO " . $_SERVER['SERVER_NAME'] . "\r\n");
get_response($socket);
fputs($socket, "MAIL FROM: <{$fromEmail}>\r\n");
get_response($socket);
fputs($socket, "RCPT TO: <{$toEmail}>\r\n");
get_response($socket);
fputs($socket, "DATA\r\n");
get_response($socket);
fputs($socket, $data . "\r\n.\r\n");
get_response($socket);
fputs($socket, "QUIT\r\n");
fclose($socket);

echo json_encode(['status' => 'success', 'message' => 'Application submitted successfully! Our team will contact you soon.']);
?>