<?php

namespace App\Test;

use App\Constants;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Liip\TestFixturesBundle\Test\FixturesTrait;
use Faker;

/**
 * Public controller test
 */

class UserTest extends WebTestCase
{
    use FixturesTrait;
    private $faker;
    private $entityManager;

    public function __construct()
    {
        parent::__construct();
        $this->faker = Faker\Factory::create('fr_FR');

        $kernel = self::bootKernel();
        $this->entityManager = $kernel->getContainer()
            ->get('doctrine')
            ->getManager();
    }

    //Before all test
    public function setUp()
    {
        parent::setup();
        $this->loadFixtures([
            'App\DataFixtures\MemberFixture',
            'App\DataFixtures\ParamGlobalFixture',
            'App\DataFixtures\UserFixture',
            'App\DataFixtures\ParamSeasonFixture'
        ]);
    }

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
        $client = static::createClient();
        $client->request(Constants::POST, '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['username' => $username, 'plainPassword' => $password]));
        $data = json_decode($client->getResponse()->getContent(), true);
        $client = static::createClient();
        $client->setServerParameter('HTTP_Authorization', sprintf('Bearer %s', $data['token']));
        return $client;
    }

    // public function testGetCommentsWithoutToken()
    // {
    //     $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

    //     $client->request(Constants::GET, '/api/member?name=&stepsId=&teamsId=&seasonId=&userId=');

    //     $this->assertEquals(200, $client->getResponse()->getStatusCode());

    //     $data = json_decode($client->getResponse()->getContent(), true);

    //     $this->assertInternalType('array', $data);
    //     $this->assertGreaterThanOrEqual(1, sizeof($data));
    //     $this->assertArrayHasKey('firstname', $data[0]);
    // }
}
