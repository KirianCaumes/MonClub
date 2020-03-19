<?php

namespace App\Test;

use App\Constants;

trait TraitTest
{
    /**
     * Create a client with a default Authorization header.
     *
     * @param string $username
     * @param string $password
     *
     * @return \Symfony\Bundle\FrameworkBundle\Client
     */
    protected function createAuthenticatedClient($username = 'user', $password = 'password')
    {
        self::ensureKernelShutdown();
        $client = static::createClient();
        $client->request(Constants::POST, '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['username' => $username, 'plainPassword' => $password]));
        $data = json_decode($client->getResponse()->getContent(), true);

        self::ensureKernelShutdown();
        $client = static::createClient();
        $client->setServerParameter('HTTP_Authorization', sprintf('Bearer %s', $data['token']));
        return $client;
    }

    protected function loadMyFixtures()
    {
        $this->loadFixtures([
            'App\DataFixtures\ParamSexFixture',
            'App\DataFixtures\UserFixture',
            'App\DataFixtures\ParamGlobalFixture',
            'App\DataFixtures\ParamSeasonFixture',
            'App\DataFixtures\MemberFixture',
            'App\DataFixtures\TeamFixture',
            'App\DataFixtures\ParamPriceGlobalFixture',
            'App\DataFixtures\ParamPriceLicenseFixture',
            'App\DataFixtures\ParamDocumentCategoryFixture',
            'App\DataFixtures\DocumentFixture',
            'App\DataFixtures\ParamPriceTransferFixture',
            'App\DataFixtures\ParamReductionFamilyFixture',
            'App\DataFixtures\ParamPaymentSolutionFixture',

        ]);
    }

    function clearResources()
    {
        $path = __DIR__ . '/../../resources/document/';

        if (is_dir($path . 'certificat-medical')) {
            foreach (glob($path . 'certificat-medical/*') as $file) if (is_file($file)) unlink($file);
        }

        if (is_dir($path . 'justificatif-etudiant-chomeur')) {
            foreach (glob($path . 'justificatif-etudiant-chomeur/*') as $file) if (is_file($file)) unlink($file);
        }
    }

    static function saveResources()
    {
        $path = __DIR__ . '/../../resources/document/';

        if (!is_dir($path . 'certificat-medical-backup')) mkdir($path . 'certificat-medical-backup');
        if (!is_dir($path . 'justificatif-etudiant-chomeur-backup')) mkdir($path . 'justificatif-etudiant-chomeur-backup');

        foreach (glob($path . 'certificat-medical/*') as $file) {
            if (is_file($file)) {
                copy($file, str_replace('certificat-medical/', 'certificat-medical-backup/',  $file));
                unlink($file);
            }
        }
        foreach (glob($path . 'justificatif-etudiant-chomeur/*') as $file) {
            if (is_file($file)) {
                copy($file, str_replace('justificatif-etudiant-chomeur/', 'justificatif-etudiant-chomeur-backup/',  $file));
                unlink($file);
            }
        }
    }

    static function restoreResources()
    {
        $path = __DIR__ . '/../../resources/document/';

        if (is_dir($path . 'certificat-medical-backup')) {
            foreach (glob($path . 'certificat-medical-backup/*') as $file) {
                if (is_file($file)) {
                    copy($file, str_replace('certificat-medical-backup/', 'certificat-medical/',  $file));
                    unlink($file);
                }
            }
        }

        if (is_dir($path . 'justificatif-etudiant-chomeur-backup')) {
            foreach (glob($path . 'justificatif-etudiant-chomeur-backup/*') as $file) {
                if (is_file($file)) {
                    copy($file, str_replace('justificatif-etudiant-chomeur-backup/', 'justificatif-etudiant-chomeur/',  $file));
                    unlink($file);
                }
            }
        }

        if (is_dir($path . 'certificat-medical-backup')) rmdir($path . 'certificat-medical-backup');
        if (is_dir($path . 'justificatif-etudiant-chomeur-backup')) rmdir($path . 'justificatif-etudiant-chomeur-backup');
    }
}
