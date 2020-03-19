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

class TeamControllerTest extends WebTestCase
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
     * Route [GET] /api/team
     */
    public function testGetAllTeams()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/team');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertInternalType('array', $data);
        $this->assertGreaterThanOrEqual(1, sizeof($data));
        $this->assertArrayHasKey('label', $data[0]);
    }

    /**
     * Route [GET] /api/team/new
     */
    public function testGetNewTeam()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/team/new');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('label', $data);
    }

    /**
     * Route [GET] /api/team/:id
     */
    public function testGetOneTeamById()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/team/1');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('label', $data);
    }

    public function testCannotGetOneTeamByNoneExistingId()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/team/666');

        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [POST] /api/team
     */
    public function testPostOneTeam()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::POST, '/api/team', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'label' => $this->faker->text(),
            'label_google_contact' => $this->faker->text(),
            'max_number_members' => $this->faker->buildingNumber(),
            'member_years' => $this->faker->year(),
            'referent_parent' => $this->faker->name(),
            'coaches' => $this->faker->name(),
            'trainers' => $this->faker->name()
        ]));

        $this->assertEquals(201, $client->getResponse()->getStatusCode());
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('label', $data);
    }
    public function testCannotPostOneTeamWithWrongData()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::POST, '/api/team', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'label' => 123123,
            'label_google_contact' => '',
            'max_number_members' => $this->faker->buildingNumber(),
            'member_years' => $this->faker->year(),
            'referent_parent' => $this->faker->name(),
            'coaches' => $this->faker->name(),
            'trainers' => $this->faker->name()
        ]));

        $this->assertEquals(400, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [PUT] /api/team/1
     */
    public function testPutOneTeamById()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::PUT, '/api/team/1', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'label' => $this->faker->text(),
            'label_google_contact' => $this->faker->text(),
            'max_number_members' => $this->faker->buildingNumber(),
            'member_years' => $this->faker->year(),
            'referent_parent' => $this->faker->name(),
            'coaches' => $this->faker->name(),
            'trainers' => $this->faker->name()
        ]));

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('label', $data);
    }

    public function testCannotPutOneTeamByNoneExistingId()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::PUT, '/api/team/666', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'label' => $this->faker->text(),
            'label_google_contact' => $this->faker->text(),
            'max_number_members' => $this->faker->buildingNumber(),
            'member_years' => $this->faker->year(),
            'referent_parent' => $this->faker->name(),
            'coaches' => $this->faker->name(),
            'trainers' => $this->faker->name()
        ]));

        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }

    public function testCannotPutOneTeamWithWrongData()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::PUT, '/api/team/1', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'label' => 123123,
            'label_google_contact' => '',
            'max_number_members' => $this->faker->buildingNumber(),
            'member_years' => $this->faker->year(),
            'referent_parent' => $this->faker->name(),
            'coaches' => $this->faker->name(),
            'trainers' => $this->faker->name()
        ]));

        $this->assertEquals(400, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [DELETE] /api/team/1
     */
    public function testDeleteOneTeamById()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::DELETE, '/api/team/1');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testCannotDeleteOneTeamByNoneExistingId()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::DELETE, '/api/team/666');

        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }
}
