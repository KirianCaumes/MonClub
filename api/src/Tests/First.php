<?php

namespace App\Tests;

use App\Constants;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
// use Liip\FunctionalTestBundle\Test\WebTestCase;
use Liip\TestFixturesBundle\Test\FixturesTrait;

/**
 * CommentControllerTest
 * @author G. Simard
 */

class First extends WebTestCase
{
    use FixturesTrait;

    public static function setUpBeforeClass()
    {
        parent::setUpBeforeClass();
        // $this->loadFixtures([
        //     'App\DataFixtures\MemberFixture',
        //     'App\DataFixtures\ParamGlobalFixture'
        // ]);
    }
    public function setUp()
    {
        parent::setup();
        // $this->loadFixtures([
        //     'App\DataFixtures\MemberFixture',
        //     'App\DataFixtures\ParamGlobalFixture'
        // ]);
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

        //var_dump($data);

        $client = static::createClient();
        $client->setServerParameter('HTTP_Authorization', sprintf('Bearer %s', $data['token']));

        return $client;
    }

    public function testCreateUser()
    {
        $client = static::createClient();
        $client->request(Constants::POST, '/api/register', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['username' => 'kirian.caumes@gmail.com', 'plainPassword' => ['first' => 'fd6fsadeaz62@+', 'second' => 'fd6fsadeaz62@+']]));

        $this->assertEquals(201, $client->getResponse()->getStatusCode());
    }

    public function testGetCommentsWithoutToken()
    {
        $client = $this->createAuthenticatedClient('kirian.caumes@gmail.com', 'fd6fsadeaz62@+');

        $client->request(Constants::GET, '/api/member?name=&stepsId=&teamsId=&seasonId=2&userId=');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertInternalType('array', $data);
        $this->assertGreaterThanOrEqual(1, sizeof($data));
        $this->assertArrayHasKey('firstname', $data[0]);
    }
}
