<?php

namespace App\Test\Controller;

use App\Constants;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Liip\TestFixturesBundle\Test\FixturesTrait;
use Faker;
use App\Test\TraitTest;

/**
 * Member controller test
 */

class MainControllerTest extends WebTestCase
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
     * Route [GET] /static/{folder}/{filename}
     */
    public function testGetStaticFile()
    {
        self::ensureKernelShutdown();
        $client = static::createClient();

        if (!is_dir(__DIR__ . '/../../../public/app/static/script')) mkdir(__DIR__ . "/../../../public/app/static/script", 0755, true);
        $fp = fopen(__DIR__ . '/../../../public/app/static/script/script.js', "wb");
        fwrite($fp, "console.log('test')");
        fclose($fp);

        $client->request(Constants::GET, '/static/script/script.js');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertEquals(true, $client->getResponse()->isOk());

        array_map('unlink', glob(__DIR__ . '/../../../public/app/static/script/*'));
        rmdir(__DIR__ . '/../../../public/app/static/script');
        rmdir(__DIR__ . '/../../../public/app/static');
        rmdir(__DIR__ . '/../../../public/app');
    }

    public function testCannotGetNoneExistingStaticFile()
    {
        self::ensureKernelShutdown();
        $client = static::createClient();

        $client->request(Constants::GET, '/static/script/script.js');
        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [GET] /{filename}
     */
    public function testGetHomeFile()
    {
        self::ensureKernelShutdown();
        $client = static::createClient();

        if (!is_dir(__DIR__ . '/../../../public/app')) mkdir(__DIR__ . "/../../../public/app", 0755, true);
        $fp = fopen(__DIR__ . '/../../../public/app/index.html', "wb");
        fwrite($fp, "<h1>Test</h1>");
        fclose($fp);

        $client->request(Constants::GET, '/');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertEquals(true, $client->getResponse()->isOk());

        array_map('unlink', glob(__DIR__ . '/../../../public/app/*'));
        rmdir(__DIR__ . '/../../../public/app');
    }

    public function testGetOneHomeFile()
    {
        self::ensureKernelShutdown();
        $client = static::createClient();

        if (!is_dir(__DIR__ . '/../../../public/app')) mkdir(__DIR__ . "/../../../public/app", 0755, true);
        $fp = fopen(__DIR__ . '/../../../public/app/index.css', "wb");
        fwrite($fp, "<h1>Test</h1>");
        fclose($fp);

        $client->request(Constants::GET, '/index.css');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertEquals(true, $client->getResponse()->isOk());
        
        array_map('unlink', glob(__DIR__ . '/../../../public/app/*'));
        rmdir(__DIR__ . '/../../../public/app');
    }

    public function testCannotGetNoneExistingOneHomeFile()
    {
        self::ensureKernelShutdown();
        $client = static::createClient();

        $client->request(Constants::GET, '/');
        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }
}
