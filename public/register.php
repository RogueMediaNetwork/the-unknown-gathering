<?php
/**
 * HORRIFY: A Film Speed Run — registration handler.
 * Validates the registration form, appends each entry to a CSV stored ABOVE the
 * web root (the reliable record), and emails a notification to the organizers.
 * Returns JSON for fetch submissions; a minimal themed page for no-JS fallback.
 */

// ---- CONFIG (edit these) -------------------------------------------------
$NOTIFY_EMAIL = 'hello@roguemedianetwork.com';            // where new registrations are emailed
$FROM_EMAIL   = 'no-reply@ugcontx.com';                  // From: address (a mailbox on this domain)
$STORE_FILE   = dirname(__DIR__) . '/horrify_registrations.csv'; // outside public_html
// --------------------------------------------------------------------------

$wantsJson = (
  (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'fetch')
  || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false)
);

function respond($ok, $message, $wantsJson, $code = 200) {
  http_response_code($code);
  if ($wantsJson) {
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(['ok' => $ok, 'error' => $ok ? null : $message]);
  } else {
    header('Content-Type: text/html; charset=UTF-8');
    $color = $ok ? '#C9A84C' : '#ff5555';
    $title = $ok ? 'Registration Received' : 'Submission Error';
    echo "<!doctype html><html><head><meta charset='utf-8'><title>$title</title>"
       . "<meta name='viewport' content='width=device-width,initial-scale=1'>"
       . "<style>body{background:#0d0d0d;color:#f5f0e8;font-family:system-ui,sans-serif;"
       . "display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center;padding:2rem}"
       . "h1{color:$color;letter-spacing:.05em}a{color:#C9A84C}</style></head><body><div>"
       . "<h1>$title</h1><p>" . htmlspecialchars($message) . "</p>"
       . "<p><a href='/horrify.html#register'>&larr; Back to HORRIFY</a></p></div></body></html>";
  }
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  respond(false, 'Method not allowed.', $wantsJson, 405);
}

// Honeypot: real users never fill the hidden "website" field.
if (!empty($_POST['website'])) {
  respond(true, 'Thanks.', $wantsJson); // silently accept + discard bot submissions
}

function field($k) { return isset($_POST[$k]) ? trim((string)$_POST[$k]) : ''; }

$filmTitle = field('film_title');
$track     = field('track');
$team      = field('team_name');
$email     = field('contact_email');
$phone     = field('contact_phone');
$heard     = field('heard');
$scale     = field('scale');
$agree1    = field('agree_rights');
$agree2    = field('agree_terms');
$agree3    = field('agree_accuracy');

$errors = [];
if ($filmTitle === '')                                   $errors[] = 'Film title is required.';
if ($track === '')                                       $errors[] = 'Please choose a track.';
if ($team === '')                                        $errors[] = 'Filmmaker/Team name is required.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))          $errors[] = 'A valid contact email is required.';
if ($phone === '')                                       $errors[] = 'Contact phone is required.';
if ($heard === '')                                       $errors[] = 'Please tell us how you heard about HORRIFY.';
if (!($agree1 && $agree2 && $agree3))                    $errors[] = 'You must accept all three certification statements.';

if ($errors) {
  respond(false, implode(' ', $errors), $wantsJson, 422);
}

$ts = date('c');
$ip = $_SERVER['REMOTE_ADDR'] ?? '';

// Append to CSV (write a header row the first time).
$isNew = !file_exists($STORE_FILE);
if ($fh = @fopen($STORE_FILE, 'a')) {
  if ($isNew) {
    fputcsv($fh, ['timestamp', 'film_title', 'track', 'team', 'email', 'phone', 'heard', 'terrifying_scale', 'certified', 'ip']);
  }
  fputcsv($fh, [$ts, $filmTitle, $track, $team, $email, $phone, $heard, $scale, 'yes', $ip]);
  fclose($fh);
}

// Email notification (best-effort).
$subject = 'HORRIFY registration: ' . $filmTitle . ' (' . $team . ')';
$bodyLines = [
  'New HORRIFY film registration', '',
  'Film Title: ' . $filmTitle,
  'Track: ' . $track,
  'Filmmaker/Team: ' . $team,
  'Email: ' . $email,
  'Phone: ' . $phone,
  'Heard via: ' . $heard,
  'Terrifying Scale: ' . $scale . '/10',
  'Certified rights/terms/accuracy: yes',
  'Submitted: ' . $ts,
  'IP: ' . $ip,
];
$headers = 'From: HORRIFY <' . $FROM_EMAIL . ">\r\n"
         . 'Reply-To: ' . $email . "\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n";
@mail($NOTIFY_EMAIL, $subject, implode("\n", $bodyLines), $headers);

respond(true, 'Your registration was received. Next, pay the $50 entry fee to confirm your spot.', $wantsJson);
