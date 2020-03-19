<?php

namespace App\Test\Controller;

use App\Constants;
use App\Entity\Param\ParamPriceGlobal;
use App\Entity\Param\ParamPriceLicense;
use App\Entity\Param\ParamPriceTransfer;
use App\Entity\Param\ParamReductionFamily;
use App\Entity\Param\ParamSeason;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Liip\TestFixturesBundle\Test\FixturesTrait;
use Faker;
use App\Test\TraitTest;

/**
 * Member controller test
 */

class ParamControllerTest extends WebTestCase
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
     * Route [GET] /api/param
     */
    public function testGetParam()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/param');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertInternalType('array', $data);
        $this->assertArrayHasKey('teams', $data);
        $this->assertArrayHasKey('workflowStep', $data);
        $this->assertArrayHasKey('global', $data);
        $this->assertArrayHasKey('documentCategory', $data);
        $this->assertArrayHasKey('roles', $data);
        $this->assertArrayHasKey('choices', $data);
        $this->assertArrayHasKey('sexes', $data);
        $this->assertArrayHasKey('price', $data);
        $this->assertArrayHasKey('global', $data['price']);
        $this->assertArrayHasKey('license', $data['price']);
        $this->assertArrayHasKey('transfer', $data['price']);
        $this->assertArrayHasKey('discount', $data['price']);
        $this->assertArrayHasKey('payment_solution', $data['price']);
        $this->assertArrayHasKey('season', $data);
        $this->assertArrayHasKey('users', $data);
    }

    /**
     * Route [GET] /api/param/price/{seasonId}
     */
    public function testGetPriceBySeasonId()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/param/price/2');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertInternalType('array', $data);
        $this->assertArrayHasKey('global', $data);
        $this->assertArrayHasKey('license', $data);
        $this->assertInternalType('array', $data['license']);
        $this->assertArrayHasKey('transfer', $data);
        $this->assertInternalType('array', $data['transfer']);
        $this->assertArrayHasKey('discount', $data);
        $this->assertInternalType('array', $data['discount']);
    }

    public function testCannotGetPriceByNoneExistingSeasonId()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/param/price/666');

        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [PUT] /api/param/price/{seasonId}
     */
    public function testPutPriceBySeasonIdWithNewData()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::PUT, '/api/param/price/2', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'global' => [
                'id' => null,
                'reduced_price_before_deadline' => $this->faker->randomNumber(3),
                'reduced_price_after_deadline' => $this->faker->randomNumber(3),
                'deadline_date' => $this->faker->date(),
                'paypal_fee' => $this->faker->randomNumber(1),
            ],
            'license' => [
                [
                    'id' => null,
                    'label' => $this->faker->word(),
                    'price_before_deadline' => $this->faker->randomNumber(3),
                    'price_after_deadline' => $this->faker->randomNumber(3),
                    'min_year' => $this->faker->year(),
                    'max_year' => $this->faker->year()
                ],
                [
                    'id' => null,
                    'label' => $this->faker->word(),
                    'price_before_deadline' => $this->faker->randomNumber(3),
                    'price_after_deadline' => $this->faker->randomNumber(3),
                    'min_year' => $this->faker->year(),
                    'max_year' => $this->faker->year()
                ],
            ],
            'transfer' => [
                [
                    'id' => null,
                    'label' => $this->faker->word(),
                    'price' => $this->faker->randomNumber(3),
                    'min_age' => $this->faker->randomNumber(2),
                    'max_age' => $this->faker->randomNumber(2),
                ],
                [
                    'id' => null,
                    'label' => $this->faker->word(),
                    'price' => $this->faker->randomNumber(3),
                    'min_age' => $this->faker->randomNumber(2),
                    'max_age' => $this->faker->randomNumber(2),
                ],
            ],
            'discount' => [
                [
                    'id' => null,
                    'number' => $this->faker->randomNumber(1),
                    'discount' => $this->faker->randomNumber(2)
                ],
                [
                    'id' => null,
                    'number' => $this->faker->randomNumber(1),
                    'discount' => $this->faker->randomNumber(2)
                ],
            ]
        ]));

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertInternalType('array', $data);
        $this->assertArrayHasKey('global', $data);
        $this->assertArrayHasKey('license', $data);
        $this->assertInternalType('array', $data['license']);
        $this->assertArrayHasKey('transfer', $data);
        $this->assertInternalType('array', $data['transfer']);
        $this->assertArrayHasKey('discount', $data);
        $this->assertInternalType('array', $data['discount']);
    }

    public function testPutPriceBySeasonIdWithOldData()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');
        $season = $this->entityManager->getRepository(ParamSeason::class)->findOneBy(['id' => 2]);
        $paramPriceGlobal = $this->entityManager->getRepository(ParamPriceGlobal::class)->findOneBy(['season' => $season]);
        $paramPriceLicenses = $this->entityManager->getRepository(ParamPriceLicense::class)->findBy(['season' => $season]);
        $paramPriceTransfers = $this->entityManager->getRepository(ParamPriceTransfer::class)->findBy(['season' => $season]);
        $paramReductionFamilys = $this->entityManager->getRepository(ParamReductionFamily::class)->findBy(['season' => $season]);
        $client->request(Constants::PUT, '/api/param/price/2', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'global' => [
                'id' => $paramPriceGlobal->getId(),
                'reduced_price_before_deadline' => $this->faker->randomNumber(3),
                'reduced_price_after_deadline' => $this->faker->randomNumber(3),
                'deadline_date' => $this->faker->date(),
                'paypal_fee' => $this->faker->randomNumber(1),
            ],
            'license' => [
                [
                    'id' => $paramPriceLicenses[0]->getId(),
                    'label' => $this->faker->word(),
                    'price_before_deadline' => $this->faker->randomNumber(3),
                    'price_after_deadline' => $this->faker->randomNumber(3),
                    'min_year' => $this->faker->year(),
                    'max_year' => $this->faker->year()
                ]
            ],
            'transfer' => [
                [
                    'id' => $paramPriceTransfers[0]->getId(),
                    'label' => $this->faker->word(),
                    'price' => $this->faker->randomNumber(3),
                    'min_age' => $this->faker->randomNumber(2),
                    'max_age' => $this->faker->randomNumber(2),
                ]
            ],
            'discount' => [
                [
                    'id' => $paramReductionFamilys[0]->getId(),
                    'number' => $this->faker->randomNumber(1),
                    'discount' => $this->faker->randomNumber(2)
                ]
            ]
        ]));

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertInternalType('array', $data);
        $this->assertArrayHasKey('global', $data);
        $this->assertArrayHasKey('license', $data);
        $this->assertInternalType('array', $data['license']);
        $this->assertArrayHasKey('transfer', $data);
        $this->assertInternalType('array', $data['transfer']);
        $this->assertArrayHasKey('discount', $data);
        $this->assertInternalType('array', $data['discount']);
    }

    public function testPutPriceBySeasonIdWithWrongData()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::PUT, '/api/param/price/2', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'global' => [
                'id' => null,
                'reduced_price_before_deadline' => 'test',
                'reduced_price_after_deadline' => 'test',
                'deadline_date' => 'test',
                'paypal_fee' => 'test',
            ],
            'license' => [
                [
                    'id' => null,
                    'label' => 'test',
                    'price_before_deadline' => 'test',
                    'price_after_deadline' => 'test',
                    'min_year' => 'test',
                    'max_year' => 'test'
                ],
                [
                    'id' => null,
                    'label' => 'test',
                    'price_before_deadline' => 'test',
                    'price_after_deadline' => 'test',
                    'min_year' => 'test',
                    'max_year' => 'test'
                ],
            ],
            'transfer' => [
                [
                    'id' => null,
                    'label' => 'test',
                    'price' => 'test',
                    'min_age' => 'test',
                    'max_age' => 'test',
                ],
                [
                    'id' => null,
                    'label' => 'test',
                    'price' => 'test',
                    'min_age' => 'test',
                    'max_age' => 'test',
                ],
            ],
            'discount' => [
                [
                    'id' => null,
                    'number' => 'test',
                    'discount' => 'test'
                ],
                [
                    'id' => null,
                    'number' => 'test',
                    'discount' => 'test'
                ],
            ]
        ]));

        $this->assertEquals(400, $client->getResponse()->getStatusCode());
    }

    public function testCannotPutPriceByNoneExistingSeasonId()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::PUT, '/api/param/price/666');

        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [PUT] /api/param/current-season/{id}
     */
    public function testPutSeasonId()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::PUT, '/api/param/current-season/4');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertInternalType('array', $data);
        $this->assertArrayHasKey('id', $data);
        $this->assertEquals(4, $data['id']);

        $season = $this->entityManager->getRepository(ParamSeason::class)->findOneBy(['is_current' => true]);
        $this->assertEquals(4, $season->getId());

        foreach ($this->entityManager->getRepository(ParamSeason::class)->findAll() as $s) {
            if ($season->getId() === $s->getId()) {
                $this->assertEquals(true, $s->getIsCurrent());
            } else {
                $this->assertEquals(false, $s->getIsCurrent());
            }

            if ($s->getId() <= $season->getId()) {
                $this->assertEquals(true, $s->getIsActive());
            } else {
                $this->assertEquals(false, $s->getIsActive());
            }
        }
    }

    public function testCannotPutByNoneExistingSeasonId()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::PUT, '/api/param/current-season/66');

        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [PUT] /api/param/{label}
     */
    public function testPutParamByLabel()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::PUT, '/api/param/text_infos_admin', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'value' => 'test'
        ]));

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertInternalType('array', $data);
        $this->assertArrayHasKey('id', $data);
        $this->assertArrayHasKey('label', $data);
        $this->assertArrayHasKey('value', $data);
        $this->assertEquals('test', $data['value']);
    }

    public function testCannotPutParamByNoneExistingLabel()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::PUT, '/api/param/test');

        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }
}
