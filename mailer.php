<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed.'
    ]);
    exit;
}

$toEmail = 'sahurohankumar7596@gmail.com';

$inputRaw = file_get_contents('php://input');
$data = json_decode($inputRaw, true);

if (is_array($data)) {
    $name    = isset($data['name']) ? trim($data['name']) : '';
    $email   = isset($data['email']) ? trim($data['email']) : '';
    $subject = isset($data['subject']) ? trim($data['subject']) : '';
    $message = isset($data['message']) ? trim($data['message']) : '';
} else {
    $name    = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email   = isset($_POST['email']) ? trim($_POST['email']) : '';
    $subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';
}

if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Please complete all fields in the form.'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Please enter a valid email address.'
    ]);
    exit;
}

$name = htmlspecialchars(strip_tags($name));
$email = filter_var($email, FILTER_SANITIZE_EMAIL);
$subject = htmlspecialchars(strip_tags($subject));
$message = htmlspecialchars(strip_tags($message));

$emailSubject = "New Contact Form Submission: " . $subject;

$emailBody  = "You have received a new contact message from SOS Infocity:\n\n";
$emailBody .= "--------------------------------------------------\n";
$emailBody .= "Name:    " . $name . "\n";
$emailBody .= "Email:   " . $email . "\n";
$emailBody .= "Subject: " . $subject . "\n";
$emailBody .= "--------------------------------------------------\n\n";
$emailBody .= "Message:\n" . $message . "\n\n";
$emailBody .= "--------------------------------------------------\n";

$headers  = "From: SOS Infocity Form <noreply@" . $_SERVER['SERVER_NAME'] . ">\r\n";
$headers .= "Reply-To: " . $name . " <" . $email . ">\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if (mail($toEmail, $emailSubject, $emailBody, $headers)) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Thank you! Your message has been sent successfully. Our team will get back to you within 24 hours.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to send message. Please try again or contact us directly at hr@sosinfocity.in.'
    ]);
}