<?php

namespace App\Test\Controller;

use App\Constants;
use App\Entity\Param\ParamGlobal;
use App\Entity\User;
use App\Test\TraitTest;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Liip\TestFixturesBundle\Test\FixturesTrait;
use Faker;

/**
 * Public controller test
 */

class PublicControllerTest extends WebTestCase
{
    use FixturesTrait;
    use TraitTest;
    private $faker;
    private $entityManager;

    public function __construct($name = null, array $data = [], $dataName = '')
    {
        parent::__construct($name, $data, $dataName);
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
        // if (!empty(self::bootKernel()->getContainer()->get('doctrine')->getManager())) self::bootKernel()->getContainer()->get('doctrine')->getManager()->getConnection()->close();
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

    public function testCannotCreateUserIfDisable()
    {
        self::ensureKernelShutdown();
        $client = static::createClient();

        $param = $this->entityManager->getRepository(ParamGlobal::class)->findOneBy(['label' => 'is_create_new_user_able']);
        $param->setValue('false');
        $this->entityManager->persist($param);
        $this->entityManager->flush();

        $client->request(Constants::POST, '/api/register', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['username' => $this->faker->email(), 'plainPassword' => ['first' => 'fd6fsadeaz62@+', 'second' => 'fd6fsadeaz62@+']]));

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
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

    public function testNoneExistingUserTokenCannotReset()
    {
        self::ensureKernelShutdown();
        $client = static::createClient();
        $client->request(Constants::POST, '/api/reset', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['resetToken' => 'test', 'plainPassword' => ['first' => 'fd6fsadeaz62@+123', 'second' => 'fd6fsadeaz62@+123']]));
        $this->assertEquals(400, $client->getResponse()->getStatusCode());
    }

    public function testUserCannotResetWithExpiredToken()
    {
        self::ensureKernelShutdown();
        $client = static::createClient();
        $client->request(Constants::POST, '/api/reset/mail', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['username' => 'super-admin@mail.com']));
        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $user = $this->entityManager->getRepository(User::class)->findOneBy(['username' => 'super-admin@mail.com']);
        $user->setPasswordRequestedAt((new \DateTime())->createFromFormat('d/m/Y', '01/01/1970'));
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $client->request(Constants::POST, '/api/reset', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['resetToken' => $user->getConfirmationToken(), 'plainPassword' => ['first' => 'fd6fsadeaz62@+123', 'second' => 'fd6fsadeaz62@+123']]));
        $this->assertEquals(400, $client->getResponse()->getStatusCode());
    }

    public function testUserCannotResetWithWrongData()
    {
        self::ensureKernelShutdown();
        $client = static::createClient();
        $client->request(Constants::POST, '/api/reset/mail', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['username' => 'super-admin@mail.com']));
        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $user = $this->entityManager->getRepository(User::class)->findOneBy(['username' => 'super-admin@mail.com']);
        $client->request(Constants::POST, '/api/reset', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['resetToken' => $user->getConfirmationToken(), 'plainPassword' => ['first' => 'test', 'second' => 'teste']]));
        $this->assertEquals(400, $client->getResponse()->getStatusCode());
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
        $client->request(Constants::POST, '/api/log', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['env' => 'test', 'datetime' => date_format(date_timestamp_set(new \DateTime(), (new \DateTime)->getTimestamp()), 'c'), 'error' => $this->faker->text(), 'info' => $this->faker->text()]));
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }
}
