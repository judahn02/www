<?php
declare(strict_types=1);

function get_jwt_key_status(string $projectRoot): array
{
    $storageDir = get_jwt_storage_dir($projectRoot);
    $privateKeyPath = $storageDir . DIRECTORY_SEPARATOR . 'jwt-private-key.pem';
    $publicKeyPath = $storageDir . DIRECTORY_SEPARATOR . 'jwt-public-key.pem';

    return [
        'storage_dir' => $storageDir,
        'private_key_path' => $privateKeyPath,
        'public_key_path' => $publicKeyPath,
        'exists' => is_file($privateKeyPath) && is_file($publicKeyPath),
    ];
}

function handle_jwt_creation_request(string $projectRoot): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        header('Allow: POST');
        send_text_response(405, "Method not allowed. Use POST for /wp-json/aslta/v1/jwtCreation.\n");
    }

    if (!extension_loaded('openssl')) {
        send_text_response(500, "The OpenSSL extension is required to generate a JWT keypair.\n");
    }

    $shouldChange = isset($_GET['change']) && $_GET['change'] === 'change';
    $keyStatus = get_jwt_key_status($projectRoot);

    if ($keyStatus['exists'] && !$shouldChange) {
        send_text_response(409, "A JWT keypair already exists. Send ?change=change to replace it.\n");
    }

    ensure_jwt_storage_dir($keyStatus['storage_dir']);

    $keyConfig = [
        'private_key_bits' => 2048,
        'private_key_type' => OPENSSL_KEYTYPE_RSA,
    ];

    $keyResource = openssl_pkey_new($keyConfig);
    if ($keyResource === false) {
        send_text_response(500, "Unable to generate a new RSA key resource.\n" . collect_openssl_errors());
    }

    $privateKey = '';
    if (!openssl_pkey_export($keyResource, $privateKey)) {
        send_text_response(500, "Unable to export the private key.\n" . collect_openssl_errors());
    }

    $keyDetails = openssl_pkey_get_details($keyResource);
    $publicKey = is_array($keyDetails) ? ($keyDetails['key'] ?? '') : '';

    if ($publicKey === '') {
        send_text_response(500, "Unable to extract the public key.\n" . collect_openssl_errors());
    }

    if (file_put_contents($keyStatus['private_key_path'], $privateKey) === false) {
        send_text_response(500, "Unable to save the private key to disk.\n");
    }

    if (file_put_contents($keyStatus['public_key_path'], $publicKey) === false) {
        send_text_response(500, "Unable to save the public key to disk.\n");
    }

    @chmod($keyStatus['private_key_path'], 0600);
    @chmod($keyStatus['public_key_path'], 0644);

    header('Content-Type: text/plain; charset=UTF-8');
    header('Content-Disposition: attachment; filename="jwt-public-key.pem"');
    header('Cache-Control: no-store');
    http_response_code(200);
    echo $publicKey;
    exit;
}

function ensure_jwt_storage_dir(string $storageDir): void
{
    if (is_dir($storageDir)) {
        return;
    }

    if (!mkdir($storageDir, 0775, true) && !is_dir($storageDir)) {
        send_text_response(500, "Unable to create the JWT storage directory: {$storageDir}\n");
    }
}

function get_jwt_storage_dir(string $projectRoot): string
{
    return $projectRoot . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'jwt';
}

function collect_openssl_errors(): string
{
    $errors = [];

    while (($message = openssl_error_string()) !== false) {
        $errors[] = $message;
    }

    if ($errors === []) {
        return '';
    }

    return implode("\n", $errors) . "\n";
}

function send_text_response(int $statusCode, string $body): void
{
    header('Content-Type: text/plain; charset=UTF-8');
    header('Cache-Control: no-store');
    http_response_code($statusCode);
    echo $body;
    exit;
}
