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

        ]);
    }
}
