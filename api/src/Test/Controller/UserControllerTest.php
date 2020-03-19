<?php

namespace App\Test\Controller;

use App\Constants;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Liip\TestFixturesBundle\Test\FixturesTrait;
use Faker;
use App\Test\TraitTest;

/**
 * User controller test
 */

class UserControllerTest extends WebTestCase
{
    use FixturesTrait;
    use TraitTest;
    private $faker;
    private $entityManager;

    public function __construct()
    {
        parent::__construct();
        $this->faker = Faker\Factory::create('fr_FR');
        $this->entityManager = self::bootKernel()->getContainer()->get('doctrine')->getManager();
    }

    //Before all test
    static function setUpBeforeClass()
    {
        parent::setUpBeforeClass();
        TraitTest::saveResources();
    }

    //After all test
    static function tearDownAfterClass()
    {
        parent::tearDownAfterClass();
        TraitTest::restoreResources();
    }

    //Before each test
    public function setUp()
    {
        parent::setup();
        $this->loadMyFixtures();
    }

    //After each test
    public function tearDown()
    {
        parent::tearDown();
        $this->clearResources();
        if (!empty(self::bootKernel()->getContainer()->get('doctrine')->getManager())) self::bootKernel()->getContainer()->get('doctrine')->getManager()->getConnection()->close();
    }

    /**
     * Route [GET] /api/user/me 
     */
    public function testGetMe()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/user/me');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('username', $data);
        $this->assertArrayNotHasKey('emailCanonical', $data);
    }

    public function testUserNotConnectedCannotGetMe()
    {
        self::ensureKernelShutdown();
        $client = static::createClient();
        $client->request(Constants::GET, '/api/user/me');
        $this->assertEquals(401, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [GET] /api/user/infos 
     */
    public function testGetInfos()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/user/infos');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('text', $data);
        $this->assertArrayHasKey('activity_historic', $data);
        $this->assertArrayHasKey('infos', $data);
        $this->assertArrayHasKey('users', $data['infos']);
        $this->assertArrayHasKey('members', $data['infos']);
        $this->assertArrayHasKey('membersOk', $data['infos']);
        $this->assertArrayHasKey('membersPending', $data['infos']);
        $this->assertArrayHasKey('members', $data);
    }

    /**
     * Route [GET] /api/user 
     */
    public function testGetAllUsers()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/user?name=&isEnabled=1&roles=');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertInternalType('array', $data);
        $this->assertGreaterThanOrEqual(1, sizeof($data));
        $this->assertArrayHasKey('username', $data[0]);
        $this->assertArrayNotHasKey('emailCanonical', $data[0]);
    }

    public function testGetAllUsersWithParams()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/user?name=&isEnabled=0&roles=');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertInternalType('array', $data);
        $this->assertEquals(0, sizeof($data));
    }

    public function testCannotGetAllUsersIfUserIsNotAdmin()
    {
        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/user?name=&isEnabled=1&roles=');
        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [GET] /api/user/new
     */
    public function testGetNewUser()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/user/new');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('user', $data);
        $this->assertArrayHasKey('username', $data['user']);
        $this->assertEquals($data['user']['enabled'], true);
        $this->assertArrayNotHasKey('emailCanonical', $data['user']);
    }

    /**
     * Route [GET] /api/user/:id
     */
    public function testGetOneUserById()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/user/1');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('user', $data);
        $this->assertArrayHasKey('username', $data['user']);
        $this->assertEquals($data['user']['id'], 1);
        $this->assertArrayNotHasKey('emailCanonical', $data['user']);
    }

    public function testCannotGetOneUserByNoneExistingId()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/user/666');
        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }


    /**
     * Route [POST] /api/user
     */
    public function testPostOneUser()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::POST, '/api/user', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'username' => 'test@mail.com',
            'roles' => [Constants::ROLE_COACH],
            'teams' => [],
            'enabled' => true
        ]));
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testCannotPostOneUserWithWrongData()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::POST, '/api/user', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'username' => 'wrongname',
            'roles' => [Constants::ROLE_COACH],
            'teams' => [],
            'enabled' => true
        ]));
        $this->assertEquals(400, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [PUT] /api/user/:id
     */
    public function testPutOneUserById()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::PUT, '/api/user/2', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'enabled' => false
        ]));
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }
    
    public function testCannotPutOneNoneExistingUserById()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::PUT, '/api/user/666', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'enabled' => false
        ]));
        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }
    
    public function testCannotPutOneUserByIdWithWrongData()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::PUT, '/api/user/1', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'roles' => ['wrong_role'],
        ]));
        $this->assertEquals(400, $client->getResponse()->getStatusCode());
    }
}
