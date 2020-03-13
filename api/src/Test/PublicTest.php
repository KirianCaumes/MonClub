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

class PublicTest extends WebTestCase
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
     * Route [POST] /api/login 
     */
    public function testUserCanLogin()
    {
        self::ensureKernelShutdown();
        $client = static::createClient();
        $client->request(Constants::POST, '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['username' => 'super-admin@mail.com', 'plainPassword' => '123456789azerty+*/']));

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('token', $data);
    }

    public function testWrongUserNameCannotLogin()
    {
        self::ensureKernelShutdown();
        $client = static::createClient();
        $client->request(Constants::POST, '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['username' => 'fail@mail.com', 'plainPassword' => '123']));

        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }

    public function testWrongUserPasswordCannotLogin()
    {
        self::ensureKernelShutdown();
        $client = static::createClient();
        $client->request(Constants::POST, '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['username' => 'super-admin@mail.com', 'plainPassword' => '123']));

        $this->assertEquals(401, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [POST] /api/register
     */
    public function testCreateUser()
    {
        self::ensureKernelShutdown();
        $client = static::createClient();
        $client->request(Constants::POST, '/api/register', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['username' => 'test@mail.com', 'plainPassword' => ['first' => 'fd6fsadeaz62@+', 'second' => 'fd6fsadeaz62@+']]));

        $this->assertEquals(201, $client->getResponse()->getStatusCode());
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('token', $data);
    }

    public function testCannotCreateUserPasswordWeak()
    {
        self::ensureKernelShutdown();
        $client = static::createClient();
        $client->request(Constants::POST, '/api/register', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['username' => $this->faker->email(), 'plainPassword' => ['first' => '123', 'second' => '123']]));

        $this->assertEquals(400, $client->getResponse()->getStatusCode());
    }

    public function testCannotCreateUserAlreadyExist()
    {
        self::ensureKernelShutdown();
        $client = static::createClient();
        for ($i = 0; $i < 2; $i++) {
            $client->request(Constants::POST, '/api/register', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['username' => 'test@mail.com', 'plainPassword' => ['first' => 'fd6fsadeaz62@+', 'second' => 'fd6fsadeaz62@+']]));
        }

        $this->assertEquals(400, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [POST] /api/reset/mail
     */
    public function testUserCanResetMail()
    {
        self::ensureKernelShutdown();
        $client = static::createClient();
        $client->request(Constants::POST, '/api/reset/mail', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['username' => 'super-admin@mail.com']));

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testWrongUserNameCannotResetMail()
    {
        self::ensureKernelShutdown();
        $client = static::createClient();
        $client->request(Constants::POST, '/api/reset/mail', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['username' => 'test@mail.com']));

        $this->assertEquals(400, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [POST] /api/reset
     */
    public function testUserCanReset()
    {
        self::ensureKernelShutdown();
        $client = static::createClient();
        $client->request(Constants::POST, '/api/reset/mail', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['username' => 'super-admin@mail.com']));
        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $user = $this->entityManager->getRepository(User::class)->findOneBy(['username' => 'super-admin@mail.com']);
        $client->request(Constants::POST, '/api/reset', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['resetToken' => $user->getConfirmationToken(), 'plainPassword' => ['first' => 'fd6fsadeaz62@+123', 'second' => 'fd6fsadeaz62@+123']]));
        $this->assertEquals(201, $client->getResponse()->getStatusCode());

        $client->request(Constants::POST, '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['username' => 'super-admin@mail.com', 'plainPassword' => 'fd6fsadeaz62@+123']));
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [POST] /api/login/drive
     */
    public function testUserCanLoginDrive()
    {
        self::ensureKernelShutdown();
        $client = static::createClient();
        $client->request(Constants::POST, '/api/login/drive', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['username' => 'super-admin@mail.com', 'plainPassword' => '123456789azerty+*/']));
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testWrongUserNameCannotLoginDrive()
    {
        self::ensureKernelShutdown();
        $client = static::createClient();
        $client->request(Constants::POST, '/api/login/drive', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['username' => 'test@mail.com', 'plainPassword' => '123456789azerty+*/']));
        $this->assertEquals(401, $client->getResponse()->getStatusCode());
    }

    public function testWrongUserPasswordCannotLoginDrive()
    {
        self::ensureKernelShutdown();
        $client = static::createClient();
        $client->request(Constants::POST, '/api/login/drive', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['username' => 'super-admin@mail.com', 'plainPassword' => 'test']));
        $this->assertEquals(401, $client->getResponse()->getStatusCode());
    }

    public function testNoneAdminUserCannotLoginDrive()
    {
        self::ensureKernelShutdown();
        $client = static::createClient();
        $client->request(Constants::POST, '/api/login/drive', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['username' => 'user@mail.com', 'plainPassword' => '123456789azerty+*/']));
        $this->assertEquals(401, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [POST] /api/log
     */
    public function testPostLog()
    {
        self::ensureKernelShutdown();
        $client = static::createClient();
        $client->request(Constants::POST, '/api/log', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['env' => 'test', 'datetime' => date_format(date_timestamp_set(new \DateTime(), (new \DateTime)->getTimestamp() ), 'c'), 'error' => $this->faker->text(), 'info' => $this->faker->text()]));
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }
}
