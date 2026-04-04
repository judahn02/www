<?php
declare(strict_types=1);

require_once __DIR__ . '/php/jwt-creation-endpoint.php';

$requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

if ($requestPath === '/wp-json/aslta/v1/jwtCreation') {
    handle_jwt_creation_request(__DIR__);
    exit;
}

$keyStatus = get_jwt_key_status(__DIR__);
$endpointPath = '/wp-json/aslta/v1/jwtCreation';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JWT Creation Test Harness</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 2rem;
            line-height: 1.5;
        }

        main {
            max-width: 60rem;
        }

        code,
        pre {
            font-family: Consolas, Monaco, monospace;
        }

        .card {
            border: 1px solid #ccc;
            border-radius: 0.5rem;
            padding: 1rem;
            margin-bottom: 1rem;
        }

        .button-row {
            display: flex;
            gap: 0.75rem;
            flex-wrap: wrap;
            margin: 1rem 0;
        }

        button {
            cursor: pointer;
            padding: 0.65rem 1rem;
        }

        pre {
            background: #f5f5f5;
            border-radius: 0.5rem;
            overflow-x: auto;
            padding: 1rem;
            white-space: pre-wrap;
        }

        .status-ok {
            color: #156c2f;
        }

        .status-missing {
            color: #8a2d0a;
        }
    </style>
</head>
<body>
    <main>
        <h1>JWT Creation Test Harness</h1>

        <div class="card">
            <p><strong>Endpoint:</strong> <code><?= htmlspecialchars($endpointPath, ENT_QUOTES, 'UTF-8') ?></code></p>
            <p><strong>Method:</strong> <code>POST</code></p>
            <p><strong>Key storage:</strong> <code><?= htmlspecialchars($keyStatus['storage_dir'], ENT_QUOTES, 'UTF-8') ?></code></p>
            <p>
                <strong>Current keypair:</strong>
                <span class="<?= $keyStatus['exists'] ? 'status-ok' : 'status-missing' ?>">
                    <?= $keyStatus['exists'] ? 'Present' : 'Not created yet' ?>
                </span>
            </p>
            <p><strong>Public key file:</strong> <code><?= htmlspecialchars($keyStatus['public_key_path'], ENT_QUOTES, 'UTF-8') ?></code></p>
            <p><strong>Private key file:</strong> <code><?= htmlspecialchars($keyStatus['private_key_path'], ENT_QUOTES, 'UTF-8') ?></code></p>
        </div>

        <div class="card">
            <h2>Run Test Requests</h2>
            <div class="button-row">
                <button id="create-key-btn" type="button">POST createJwtKey()</button>
                <button id="recreate-key-btn" type="button">POST recreateJwtKey()</button>
            </div>
            <p id="request-status">No request sent yet.</p>
            <p id="download-link-wrap" hidden>
                <a id="download-link" href="#" download="jwt-public-key.pem">Download last public key response</a>
            </p>
            <h3>Response Body</h3>
            <pre id="response-body">No response yet.</pre>
        </div>

        <div class="card">
            <h2>Expected Behavior</h2>
            <ul>
                <li>The first <code>createJwtKey()</code> call should generate and return a public key.</li>
                <li>A second <code>createJwtKey()</code> call should return <code>409</code> because the keypair already exists.</li>
                <li><code>recreateJwtKey()</code> should overwrite the saved keypair and return the new public key.</li>
            </ul>
        </div>
    </main>

    <script>
        (function () {
            const endpoint = <?= json_encode($endpointPath, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?>;
            const statusNode = document.getElementById('request-status');
            const responseNode = document.getElementById('response-body');
            const downloadWrap = document.getElementById('download-link-wrap');
            const downloadLink = document.getElementById('download-link');
            let lastBlobUrl = null;

            async function sendRequest(shouldRecreate) {
                if (lastBlobUrl) {
                    URL.revokeObjectURL(lastBlobUrl);
                    lastBlobUrl = null;
                }

                downloadWrap.hidden = true;
                downloadLink.removeAttribute('href');

                const requestUrl = shouldRecreate ? endpoint + '?change=change' : endpoint;
                statusNode.textContent = 'Sending POST request to ' + requestUrl + ' ...';
                responseNode.textContent = 'Waiting for response...';

                try {
                    const response = await fetch(requestUrl, {
                        method: 'POST',
                        credentials: 'include'
                    });

                    const responseBody = await response.text();
                    const filenameMatch = (response.headers.get('content-disposition') || '').match(/filename="([^"]+)"/i);
                    const filename = filenameMatch ? filenameMatch[1] : 'jwt-public-key.pem';

                    statusNode.textContent = 'HTTP ' + response.status + ' ' + response.statusText;
                    responseNode.textContent = responseBody || '[empty response body]';

                    if (response.ok) {
                        const blob = new Blob([responseBody], { type: 'text/plain;charset=utf-8' });
                        lastBlobUrl = URL.createObjectURL(blob);
                        downloadLink.href = lastBlobUrl;
                        downloadLink.download = filename;
                        downloadWrap.hidden = false;
                    }
                } catch (error) {
                    statusNode.textContent = 'Request failed.';
                    responseNode.textContent = error && error.message ? error.message : String(error);
                }
            }

            document.getElementById('create-key-btn').addEventListener('click', function () {
                sendRequest(false);
            });

            document.getElementById('recreate-key-btn').addEventListener('click', function () {
                sendRequest(true);
            });
        })();
    </script>
</body>
</html>
