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

class MemberControllerTest extends WebTestCase
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
    public function setUp()
    {
        parent::setup();
        $this->loadFixtures([
            'App\DataFixtures\UserFixture',
            'App\DataFixtures\ParamGlobalFixture',
            'App\DataFixtures\ParamSeasonFixture',
            'App\DataFixtures\MemberFixture'
        ]);
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
