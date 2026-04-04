<?php
declare(strict_types=1);

$projectRoot = dirname(__DIR__, 4);

require_once $projectRoot . '/php/jwt-creation-endpoint.php';

handle_jwt_creation_request($projectRoot);
