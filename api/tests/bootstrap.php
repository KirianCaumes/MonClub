<?php

use Symfony\Component\Dotenv\Dotenv;

require dirname(__DIR__) . '/vendor/autoload.php';

if (file_exists(dirname(__DIR__) . '/config/bootstrap.php')) {
    require dirname(__DIR__) . '/config/bootstrap.php';
} elseif (method_exists(Dotenv::class, 'bootEnv')) {
    (new Dotenv())->bootEnv(dirname(__DIR__) . '/.env');
}

if (isset($_ENV['BOOTSTRAP_EXECUTE_FIXTURE_ENV'])) {
    passthru(sprintf('set:APP_ENV=%s && php "%s/../bin/console" doctrine:database:drop --force', $_ENV['BOOTSTRAP_EXECUTE_FIXTURE_ENV'], __DIR__));
    passthru(sprintf('set:APP_ENV=%s && php "%s/../bin/console" ddctrine:database:create', $_ENV['BOOTSTRAP_EXECUTE_FIXTURE_ENV'], __DIR__));
    passthru(sprintf('set:APP_ENV=%s && php "%s/../bin/console" doctrine:fixtures:load -q', $_ENV['BOOTSTRAP_EXECUTE_FIXTURE_ENV'], __DIR__));
}
