<?php

namespace App\Test\Controller;

use App\Constants;
use App\Entity\Member;
use App\Entity\Param\ParamGlobal;
use App\Entity\Param\ParamSeason;
use App\Entity\Param\ParamSex;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Liip\TestFixturesBundle\Test\FixturesTrait;
use Faker;
use App\Test\TraitTest;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * Member controller test
 */

class MemberControllerTest extends WebTestCase
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
     * Route [GET] /api/member
     */
    public function testGetMemberWithAdmin()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/member?name=&stepsId=&teamsId=1&seasonId=2&userId=4');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertInternalType('array', $data);
        $this->assertGreaterThanOrEqual(1, sizeof($data));
        $this->assertArrayHasKey('firstname', $data[0]);
    }

    public function testGetMemberWithAdminAndOtherParams()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/member?name=e&stepsId=1&teamsId=&seasonId=&userId=');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertInternalType('array', $data);
        $this->assertGreaterThanOrEqual(1, sizeof($data));
        $this->assertArrayHasKey('firstname', $data[0]);
    }

    public function testGetMemberWithCoach()
    {
        $client = $this->createAuthenticatedClient('coach@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/member?name=&stepsId=&teamsId=&seasonId=&userId=');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertInternalType('array', $data);
        $this->assertGreaterThanOrEqual(1, sizeof($data));
        $this->assertArrayHasKey('firstname', $data[0]);
    }

    public function testCannotGetMemberWithUser()
    {
        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/member?name=&stepsId=&teamsId=&seasonId=&userId=');

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [GET] /api/member/me
     */
    public function testGetMemberMe()
    {
        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/member/me');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertInternalType('array', $data);
        $this->assertGreaterThanOrEqual(1, sizeof($data));
        $this->assertArrayHasKey('firstname', $data[0]);
    }

    public function testGetNoMember()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/member/me');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertInternalType('array', $data);
        $this->assertEquals(1, sizeof($data));
        $this->assertArrayHasKey('firstname', $data[0]);
    }

    /**
     * Route [GET] /api/member/me/previous-season
     */
    public function testGetMemberPreviousSeason()
    {
        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/member/me/previous-season');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertInternalType('array', $data);
        $this->assertGreaterThanOrEqual(1, sizeof($data));
        $this->assertArrayHasKey('firstname', $data[0]);
    }

    /**
     * Route [GET] /api/member/new
     */
    public function testGetNewMemberWithAdmin()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/member/new');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertInternalType('array', $data);
        $this->assertArrayHasKey('member', $data);
        $this->assertArrayHasKey('workflow', $data);
    }

    public function testGetNewMemberWithUser()
    {
        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/member/new');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertInternalType('array', $data);
        $this->assertArrayHasKey('member', $data);
        $this->assertArrayNotHasKey('workflow', $data);
    }

    /**
     * Route [GET] /api/member/{id}
     */
    public function testGetOneMemberById()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/member/1');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertInternalType('array', $data);
        $this->assertArrayHasKey('member', $data);
        $this->assertArrayHasKey('workflow', $data);
    }

    public function testCannotGetOneMemberByNoneExistingId()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/member/666');

        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [POST] /api/member/admin
     */
    public function testPostAdminOneMemberMajor()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::POST, '/api/member/admin', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'id' => null,
            'firstname' => $this->faker->firstName(),
            'lastname' => $this->faker->lastName(),
            'birthdate' => $this->faker->dateTimeBetween('-99 years', '-18 years')->format('Y-m-d'),
            'email' => $this->faker->email(),
            'phone_number' => '0123456789',
            'postal_code' => str_replace(' ', '', $this->faker->postcode()),
            'street' => $this->faker->country(),
            'city' => $this->faker->city(),
            'profession' => $this->faker->jobTitle(),
            'parent_one_firstname' => $this->faker->firstName(),
            'parent_one_lastname' => $this->faker->lastName(),
            'parent_one_email' => $this->faker->email(),
            'parent_one_phone_number' => '0123456789',
            'parent_one_profession' => $this->faker->jobTitle(),
            'parent_two_firstname' => $this->faker->firstName(),
            'parent_two_lastname' => $this->faker->lastName(),
            'parent_two_email' => $this->faker->email(),
            'parent_two_phone_number' => '0123456789',
            'parent_two_profession' => $this->faker->jobTitle(),
            'is_evacuation_allow' => $this->faker->boolean(),
            'is_transport_allow' => $this->faker->boolean(),
            'is_image_allow' => $this->faker->boolean(),
            'is_return_home_allow' => $this->faker->boolean(),
            'is_newsletter_allow' => $this->faker->boolean(),
            'is_accepted' => true,
            'is_reduced_price' => false,
            'is_non_competitive' => false,
            'is_transfer_needed' => $this->faker->boolean(),
            'is_document_complete' => true,
            'is_payed' => true,
            'amount_payed' => 304,
            'amount_payed_other' => NULL,
            'is_license_renewal' => true,
            'payment_notes' => NULL,
            'is_check_gest_hand' => true,
            'is_inscription_done' => true,
            'gesthand_is_photo' => false,
            'gesthand_is_photo_id' => false,
            'gesthand_is_certificate' => false,
            'gesthand_certificate_date' => '',
            'gesthand_is_health_questionnaire' => false,
            'gesthand_is_ffhb_authorization' => false,
            'gesthand_qualification_date' => '',
            'creation_datetime' => (new \DateTime()),
            'notes' => $this->faker->word(),
            'sex' => 1,
            'payment_solution' => 3,
            'user' => 1,
            'teams' => [],
            'documents' => [],
            'season' => 2,
            'paypal_information' => NULL,
        ]));

        $this->assertEquals(201, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertInternalType('array', $data);
        $this->assertArrayHasKey('id', $data);
        $this->assertNotNull($data['id']);
    }

    public function testPostAdminOneMemberMinor()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::POST, '/api/member/admin', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'id' => null,
            'firstname' => $this->faker->firstName(),
            'lastname' => $this->faker->lastName(),
            'birthdate' => $this->faker->dateTimeBetween('-17 years', '-10 years')->format('Y-m-d'),
            'email' => $this->faker->email(),
            'phone_number' => '0123456789',
            'postal_code' => str_replace(' ', '', $this->faker->postcode()),
            'street' => $this->faker->country(),
            'city' => $this->faker->city(),
            'profession' => $this->faker->jobTitle(),
            'parent_one_firstname' => $this->faker->firstName(),
            'parent_one_lastname' => $this->faker->lastName(),
            'parent_one_email' => $this->faker->email(),
            'parent_one_phone_number' => '0123456789',
            'parent_one_profession' => $this->faker->jobTitle(),
            'parent_two_firstname' => $this->faker->firstName(),
            'parent_two_lastname' => $this->faker->lastName(),
            'parent_two_email' => $this->faker->email(),
            'parent_two_phone_number' => '0123456789',
            'parent_two_profession' => $this->faker->jobTitle(),
            'is_evacuation_allow' => $this->faker->boolean(),
            'is_transport_allow' => $this->faker->boolean(),
            'is_image_allow' => $this->faker->boolean(),
            'is_return_home_allow' => $this->faker->boolean(),
            'is_newsletter_allow' => $this->faker->boolean(),
            'is_accepted' => true,
            'is_reduced_price' => false,
            'is_non_competitive' => false,
            'is_transfer_needed' => $this->faker->boolean(),
            'is_document_complete' => true,
            'is_payed' => true,
            'amount_payed' => 304,
            'amount_payed_other' => NULL,
            'is_license_renewal' => true,
            'payment_notes' => NULL,
            'is_check_gest_hand' => true,
            'is_inscription_done' => true,
            'gesthand_is_photo' => false,
            'gesthand_is_photo_id' => false,
            'gesthand_is_certificate' => false,
            'gesthand_certificate_date' => '',
            'gesthand_is_health_questionnaire' => false,
            'gesthand_is_ffhb_authorization' => false,
            'gesthand_qualification_date' => '',
            'creation_datetime' => (new \DateTime()),
            'notes' => $this->faker->word(),
            'sex' => 1,
            'payment_solution' => 2,
            'user' => 1,
            'teams' => [],
            'documents' => [],
            'season' => 2,
            'paypal_information' => NULL,
        ]));

        $this->assertEquals(201, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertInternalType('array', $data);
        $this->assertArrayHasKey('id', $data);
        $this->assertNotNull($data['id']);
    }

    public function testCannotPostAdminOneMemberWithWrongData()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::POST, '/api/member/admin', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([]));

        $this->assertEquals(400, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [POST] /api/member
     */
    public function testPostOneMemberMajor()
    {
        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');

        $client->request(Constants::POST, '/api/member', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'id' => null,
            'firstname' => $this->faker->firstName(),
            'lastname' => $this->faker->lastName(),
            'birthdate' => $this->faker->dateTimeBetween('-99 years', '-18 years')->format('Y-m-d'),
            'email' => $this->faker->email(),
            'phone_number' => '0123456789',
            'postal_code' => str_replace(' ', '', $this->faker->postcode()),
            'street' => $this->faker->country(),
            'city' => $this->faker->city(),
            'profession' => $this->faker->jobTitle(),
            'parent_one_firstname' => $this->faker->firstName(),
            'parent_one_lastname' => $this->faker->lastName(),
            'parent_one_email' => $this->faker->email(),
            'parent_one_phone_number' => '0123456789',
            'parent_one_profession' => $this->faker->jobTitle(),
            'parent_two_firstname' => $this->faker->firstName(),
            'parent_two_lastname' => $this->faker->lastName(),
            'parent_two_email' => $this->faker->email(),
            'parent_two_phone_number' => '0123456789',
            'parent_two_profession' => $this->faker->jobTitle(),
            'is_evacuation_allow' => $this->faker->boolean(),
            'is_transport_allow' => $this->faker->boolean(),
            'is_image_allow' => $this->faker->boolean(),
            'is_return_home_allow' => $this->faker->boolean(),
            'is_newsletter_allow' => $this->faker->boolean(),
            'is_accepted' => true,
            'is_reduced_price' => false,
            'is_non_competitive' => false,
            'is_transfer_needed' => $this->faker->boolean(),
            'is_document_complete' => true,
            'is_payed' => true,
            'amount_payed' => 304,
            'amount_payed_other' => NULL,
            'is_license_renewal' => true,
            'payment_notes' => NULL,
            'is_check_gest_hand' => true,
            'is_inscription_done' => true,
            'gesthand_is_photo' => false,
            'gesthand_is_photo_id' => false,
            'gesthand_is_certificate' => false,
            'gesthand_certificate_date' => '',
            'gesthand_is_health_questionnaire' => false,
            'gesthand_is_ffhb_authorization' => false,
            'gesthand_qualification_date' => '',
            'creation_datetime' => (new \DateTime()),
            'notes' => $this->faker->word(),
            'sex' => 1,
            'payment_solution' => 3,
            'user' => 1,
            'teams' => [],
            'documents' => [],
            'season' => 2,
            'paypal_information' => NULL,
        ]));
        $this->assertEquals(201, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertInternalType('array', $data);
        $this->assertArrayHasKey('id', $data);
        $this->assertNotNull($data['id']);
    }

    public function testPostOneMemberMinor()
    {
        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');

        $client->request(Constants::POST, '/api/member', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'id' => null,
            'firstname' => $this->faker->firstName(),
            'lastname' => $this->faker->lastName(),
            'birthdate' => $this->faker->dateTimeBetween('-17 years', '-10 years')->format('Y-m-d'),
            'email' => $this->faker->email(),
            'phone_number' => '0123456789',
            'postal_code' => str_replace(' ', '', $this->faker->postcode()),
            'street' => $this->faker->country(),
            'city' => $this->faker->city(),
            'profession' => $this->faker->jobTitle(),
            'parent_one_firstname' => $this->faker->firstName(),
            'parent_one_lastname' => $this->faker->lastName(),
            'parent_one_email' => $this->faker->email(),
            'parent_one_phone_number' => '0123456789',
            'parent_one_profession' => $this->faker->jobTitle(),
            'parent_two_firstname' => $this->faker->firstName(),
            'parent_two_lastname' => $this->faker->lastName(),
            'parent_two_email' => $this->faker->email(),
            'parent_two_phone_number' => '0123456789',
            'parent_two_profession' => $this->faker->jobTitle(),
            'is_evacuation_allow' => $this->faker->boolean(),
            'is_transport_allow' => $this->faker->boolean(),
            'is_image_allow' => $this->faker->boolean(),
            'is_return_home_allow' => $this->faker->boolean(),
            'is_newsletter_allow' => $this->faker->boolean(),
            'is_accepted' => true,
            'is_reduced_price' => false,
            'is_non_competitive' => false,
            'is_transfer_needed' => $this->faker->boolean(),
            'is_document_complete' => true,
            'is_payed' => true,
            'amount_payed' => 304,
            'amount_payed_other' => NULL,
            'is_license_renewal' => true,
            'payment_notes' => NULL,
            'is_check_gest_hand' => true,
            'is_inscription_done' => true,
            'gesthand_is_photo' => false,
            'gesthand_is_photo_id' => false,
            'gesthand_is_certificate' => false,
            'gesthand_certificate_date' => '',
            'gesthand_is_health_questionnaire' => false,
            'gesthand_is_ffhb_authorization' => false,
            'gesthand_qualification_date' => '',
            'creation_datetime' => (new \DateTime()),
            'notes' => $this->faker->word(),
            'sex' => 1,
            'payment_solution' => 2,
            'user' => 1,
            'teams' => [],
            'documents' => [],
            'season' => 2,
            'paypal_information' => NULL,
        ]));

        $this->assertEquals(201, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertInternalType('array', $data);
        $this->assertArrayHasKey('id', $data);
        $this->assertNotNull($data['id']);
    }

    public function testCannotPostOneMemberWithWrongData()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::POST, '/api/member', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([]));

        $this->assertEquals(400, $client->getResponse()->getStatusCode());
    }

    public function testCannotPostOneMemberWithDeadline()
    {
        $param = $this->entityManager->getRepository(ParamGlobal::class)->findOneBy(['label' => 'new_member_deadline']);
        $param->setValue($this->faker->dateTimeBetween('-99 years', '-1 years')->format('Y-m-d'));
        $this->entityManager->persist($param);
        $this->entityManager->flush();

        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::POST, '/api/member', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([]));

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    public function testCannotPostAdminOneMemberWithCreationDisable()
    {
        $param = $this->entityManager->getRepository(ParamGlobal::class)->findOneBy(['label' => 'is_create_new_member_able']);
        $param->setValue('false');
        $this->entityManager->persist($param);
        $this->entityManager->flush();

        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::POST, '/api/member', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([]));

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    public function testPostOneMemberMajorWithOldDocs()
    {
        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');

        $client->request(Constants::POST, '/api/member', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'id' => null,
            'firstname' => $this->faker->firstName(),
            'lastname' => $this->faker->lastName(),
            'birthdate' => $this->faker->dateTimeBetween('-99 years', '-18 years')->format('Y-m-d'),
            'email' => $this->faker->email(),
            'phone_number' => '0123456789',
            'postal_code' => str_replace(' ', '', $this->faker->postcode()),
            'street' => $this->faker->country(),
            'city' => $this->faker->city(),
            'profession' => $this->faker->jobTitle(),
            'parent_one_firstname' => $this->faker->firstName(),
            'parent_one_lastname' => $this->faker->lastName(),
            'parent_one_email' => $this->faker->email(),
            'parent_one_phone_number' => '0123456789',
            'parent_one_profession' => $this->faker->jobTitle(),
            'parent_two_firstname' => $this->faker->firstName(),
            'parent_two_lastname' => $this->faker->lastName(),
            'parent_two_email' => $this->faker->email(),
            'parent_two_phone_number' => '0123456789',
            'parent_two_profession' => $this->faker->jobTitle(),
            'is_evacuation_allow' => $this->faker->boolean(),
            'is_transport_allow' => $this->faker->boolean(),
            'is_image_allow' => $this->faker->boolean(),
            'is_return_home_allow' => $this->faker->boolean(),
            'is_newsletter_allow' => $this->faker->boolean(),
            'is_accepted' => true,
            'is_reduced_price' => false,
            'is_non_competitive' => false,
            'is_transfer_needed' => $this->faker->boolean(),
            'is_document_complete' => true,
            'is_payed' => true,
            'amount_payed' => 304,
            'amount_payed_other' => NULL,
            'is_license_renewal' => true,
            'payment_notes' => NULL,
            'is_check_gest_hand' => true,
            'is_inscription_done' => true,
            'gesthand_is_photo' => false,
            'gesthand_is_photo_id' => false,
            'gesthand_is_certificate' => false,
            'gesthand_certificate_date' => '',
            'gesthand_is_health_questionnaire' => false,
            'gesthand_is_ffhb_authorization' => false,
            'gesthand_qualification_date' => '',
            'creation_datetime' => (new \DateTime()),
            'notes' => $this->faker->word(),
            'sex' => 1,
            'payment_solution' => 3,
            'user' => 1,
            'teams' => [],
            'documents' => [
                [
                    'id' => 1,
                    'document_file' => NULL,
                    'document' => [
                        'name' => '2019-2020-aze-qds_electricien_5e31d42155d82.jpeg',
                        'original_name' => 'electricien.jpeg',
                        'mime_type' => 'image/jpeg',
                        'size' => 197090,
                        'dimensions' => [
                            0 => '1920',
                            1 => '1276',
                        ]
                    ],
                    'updated_at' => '2020-01-29T19:51:13+01:00',
                    'category' => [
                        'id' => 1,
                        'label' => 'Certificat médical',
                    ]
                ],
                [
                    'id' => 666,
                ]
            ],
            'season' => 2,
            'paypal_information' => NULL,
        ]));
        //TODO : find a solution why doc cannot be duplicate (File size too large)
        // var_dump(json_decode($client->getResponse()->getContent(), true));
        // var_dump(json_decode($client->getResponse()->getContent(), true)['form']['children']['documentFile']);
        $this->assertEquals(201, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertInternalType('array', $data);
        $this->assertArrayHasKey('id', $data);
        $this->assertNotNull($data['id']);
    }

    /**
     * Route [PUT] /api/member/admin
     */
    public function testPutOneMemberByIdAdminMajor()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::PUT, '/api/member/1/admin', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'id' => 1,
            'firstname' => $this->faker->firstName(),
            'lastname' => $this->faker->lastName(),
            'birthdate' => $this->faker->dateTimeBetween('-99 years', '-18 years')->format('Y-m-d'),
            'email' => $this->faker->email(),
            'phone_number' => '0123456789',
            'postal_code' => str_replace(' ', '', $this->faker->postcode()),
            'street' => $this->faker->country(),
            'city' => $this->faker->city(),
            'profession' => $this->faker->jobTitle(),
            'parent_one_firstname' => $this->faker->firstName(),
            'parent_one_lastname' => $this->faker->lastName(),
            'parent_one_email' => $this->faker->email(),
            'parent_one_phone_number' => '0123456789',
            'parent_one_profession' => $this->faker->jobTitle(),
            'parent_two_firstname' => $this->faker->firstName(),
            'parent_two_lastname' => $this->faker->lastName(),
            'parent_two_email' => $this->faker->email(),
            'parent_two_phone_number' => '0123456789',
            'parent_two_profession' => $this->faker->jobTitle(),
            'is_evacuation_allow' => $this->faker->boolean(),
            'is_transport_allow' => $this->faker->boolean(),
            'is_image_allow' => $this->faker->boolean(),
            'is_return_home_allow' => $this->faker->boolean(),
            'is_newsletter_allow' => $this->faker->boolean(),
            'is_accepted' => true,
            'is_reduced_price' => false,
            'is_non_competitive' => false,
            'is_transfer_needed' => $this->faker->boolean(),
            'is_document_complete' => true,
            'is_payed' => true,
            'amount_payed' => 304,
            'amount_payed_other' => NULL,
            'is_license_renewal' => true,
            'payment_notes' => NULL,
            'is_check_gest_hand' => true,
            'is_inscription_done' => true,
            'gesthand_is_photo' => false,
            'gesthand_is_photo_id' => false,
            'gesthand_is_certificate' => false,
            'gesthand_certificate_date' => '',
            'gesthand_is_health_questionnaire' => false,
            'gesthand_is_ffhb_authorization' => false,
            'gesthand_qualification_date' => '',
            'creation_datetime' => (new \DateTime()),
            'notes' => $this->faker->word(),
            'sex' => 1,
            'payment_solution' => 3,
            'user' => 1,
            'teams' => [],
            'documents' => [],
            'season' => 2,
            'paypal_information' => NULL,
        ]));
        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertInternalType('array', $data);
        $this->assertArrayHasKey('member', $data);
        $this->assertArrayHasKey('workflow', $data);
        $this->assertArrayHasKey('id', $data['member']);
    }

    public function testPutOneMemberByIdAdminMinor()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::PUT, '/api/member/1/admin', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'id' => 1,
            'firstname' => $this->faker->firstName(),
            'lastname' => $this->faker->lastName(),
            'birthdate' => $this->faker->dateTimeBetween('-17 years', '-10 years')->format('Y-m-d'),
            'email' => $this->faker->email(),
            'phone_number' => '0123456789',
            'postal_code' => str_replace(' ', '', $this->faker->postcode()),
            'street' => $this->faker->country(),
            'city' => $this->faker->city(),
            'profession' => $this->faker->jobTitle(),
            'parent_one_firstname' => $this->faker->firstName(),
            'parent_one_lastname' => $this->faker->lastName(),
            'parent_one_email' => $this->faker->email(),
            'parent_one_phone_number' => '0123456789',
            'parent_one_profession' => $this->faker->jobTitle(),
            'parent_two_firstname' => $this->faker->firstName(),
            'parent_two_lastname' => $this->faker->lastName(),
            'parent_two_email' => $this->faker->email(),
            'parent_two_phone_number' => '0123456789',
            'parent_two_profession' => $this->faker->jobTitle(),
            'is_evacuation_allow' => $this->faker->boolean(),
            'is_transport_allow' => $this->faker->boolean(),
            'is_image_allow' => $this->faker->boolean(),
            'is_return_home_allow' => $this->faker->boolean(),
            'is_newsletter_allow' => $this->faker->boolean(),
            'is_accepted' => true,
            'is_reduced_price' => false,
            'is_non_competitive' => false,
            'is_transfer_needed' => $this->faker->boolean(),
            'is_document_complete' => true,
            'is_payed' => true,
            'amount_payed' => 304,
            'amount_payed_other' => NULL,
            'is_license_renewal' => true,
            'payment_notes' => NULL,
            'is_check_gest_hand' => true,
            'is_inscription_done' => true,
            'gesthand_is_photo' => false,
            'gesthand_is_photo_id' => false,
            'gesthand_is_certificate' => false,
            'gesthand_certificate_date' => '',
            'gesthand_is_health_questionnaire' => false,
            'gesthand_is_ffhb_authorization' => false,
            'gesthand_qualification_date' => '',
            'creation_datetime' => (new \DateTime()),
            'notes' => $this->faker->word(),
            'sex' => 1,
            'payment_solution' => 2,
            'user' => 1,
            'teams' => [],
            'documents' => [],
            'season' => 2,
            'paypal_information' => NULL,
        ]));

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertInternalType('array', $data);
        $this->assertArrayHasKey('member', $data);
        $this->assertArrayHasKey('workflow', $data);
        $this->assertArrayHasKey('id', $data['member']);
    }

    public function testCannotPutAdminOneMemberByIdWithWrongData()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::PUT, '/api/member/1/admin', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([]));

        $this->assertEquals(400, $client->getResponse()->getStatusCode());
    }

    public function testCannotPutAdminOneMemberByNoneExistingId()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::PUT, '/api/member/666/admin', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([]));

        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [PUT] /api/member
     */
    public function testPutOneMemberByIdMajor()
    {
        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');

        $client->request(Constants::PUT, '/api/member/2', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'id' => 2,
            'firstname' => $this->faker->firstName(),
            'lastname' => $this->faker->lastName(),
            'birthdate' => $this->faker->dateTimeBetween('-99 years', '-18 years')->format('Y-m-d'),
            'email' => $this->faker->email(),
            'phone_number' => '0123456789',
            'postal_code' => str_replace(' ', '', $this->faker->postcode()),
            'street' => $this->faker->country(),
            'city' => $this->faker->city(),
            'profession' => $this->faker->jobTitle(),
            'parent_one_firstname' => $this->faker->firstName(),
            'parent_one_lastname' => $this->faker->lastName(),
            'parent_one_email' => $this->faker->email(),
            'parent_one_phone_number' => '0123456789',
            'parent_one_profession' => $this->faker->jobTitle(),
            'parent_two_firstname' => $this->faker->firstName(),
            'parent_two_lastname' => $this->faker->lastName(),
            'parent_two_email' => $this->faker->email(),
            'parent_two_phone_number' => '0123456789',
            'parent_two_profession' => $this->faker->jobTitle(),
            'is_evacuation_allow' => $this->faker->boolean(),
            'is_transport_allow' => $this->faker->boolean(),
            'is_image_allow' => $this->faker->boolean(),
            'is_return_home_allow' => $this->faker->boolean(),
            'is_newsletter_allow' => $this->faker->boolean(),
            'is_accepted' => true,
            'is_reduced_price' => false,
            'is_non_competitive' => false,
            'is_transfer_needed' => $this->faker->boolean(),
            'is_document_complete' => true,
            'is_payed' => true,
            'amount_payed' => 304,
            'amount_payed_other' => NULL,
            'is_license_renewal' => true,
            'payment_notes' => NULL,
            'is_check_gest_hand' => true,
            'is_inscription_done' => true,
            'gesthand_is_photo' => false,
            'gesthand_is_photo_id' => false,
            'gesthand_is_certificate' => false,
            'gesthand_certificate_date' => '',
            'gesthand_is_health_questionnaire' => false,
            'gesthand_is_ffhb_authorization' => false,
            'gesthand_qualification_date' => '',
            'creation_datetime' => (new \DateTime()),
            'notes' => $this->faker->word(),
            'sex' => 1,
            'payment_solution' => 3,
            'user' => 1,
            'teams' => [],
            'documents' => [],
            'season' => 2,
            'paypal_information' => NULL,
        ]));
        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertInternalType('array', $data);
        $this->assertArrayHasKey('id', $data);
    }

    public function testPutOneMemberByIdMinor()
    {
        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');

        $client->request(Constants::PUT, '/api/member/2', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'id' => 2,
            'firstname' => $this->faker->firstName(),
            'lastname' => $this->faker->lastName(),
            'birthdate' => $this->faker->dateTimeBetween('-17 years', '-10 years')->format('Y-m-d'),
            'email' => $this->faker->email(),
            'phone_number' => '0123456789',
            'postal_code' => str_replace(' ', '', $this->faker->postcode()),
            'street' => $this->faker->country(),
            'city' => $this->faker->city(),
            'profession' => $this->faker->jobTitle(),
            'parent_one_firstname' => $this->faker->firstName(),
            'parent_one_lastname' => $this->faker->lastName(),
            'parent_one_email' => $this->faker->email(),
            'parent_one_phone_number' => '0123456789',
            'parent_one_profession' => $this->faker->jobTitle(),
            'parent_two_firstname' => $this->faker->firstName(),
            'parent_two_lastname' => $this->faker->lastName(),
            'parent_two_email' => $this->faker->email(),
            'parent_two_phone_number' => '0123456789',
            'parent_two_profession' => $this->faker->jobTitle(),
            'is_evacuation_allow' => $this->faker->boolean(),
            'is_transport_allow' => $this->faker->boolean(),
            'is_image_allow' => $this->faker->boolean(),
            'is_return_home_allow' => $this->faker->boolean(),
            'is_newsletter_allow' => $this->faker->boolean(),
            'is_accepted' => true,
            'is_reduced_price' => false,
            'is_non_competitive' => false,
            'is_transfer_needed' => $this->faker->boolean(),
            'is_document_complete' => true,
            'is_payed' => true,
            'amount_payed' => 304,
            'amount_payed_other' => NULL,
            'is_license_renewal' => true,
            'payment_notes' => NULL,
            'is_check_gest_hand' => true,
            'is_inscription_done' => true,
            'gesthand_is_photo' => false,
            'gesthand_is_photo_id' => false,
            'gesthand_is_certificate' => false,
            'gesthand_certificate_date' => '',
            'gesthand_is_health_questionnaire' => false,
            'gesthand_is_ffhb_authorization' => false,
            'gesthand_qualification_date' => '',
            'creation_datetime' => (new \DateTime()),
            'notes' => $this->faker->word(),
            'sex' => 1,
            'payment_solution' => 2,
            'user' => 1,
            'teams' => [],
            'documents' => [],
            'season' => 2,
            'paypal_information' => NULL,
        ]));

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertInternalType('array', $data);
        $this->assertArrayHasKey('id', $data);
    }

    public function testCannotPutOneMemberByIdWithWrongData()
    {
        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');

        $client->request(Constants::PUT, '/api/member/2', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([]));

        $this->assertEquals(400, $client->getResponse()->getStatusCode());
    }

    public function testCannotPutOneMemberByNoneExistingId()
    {
        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');

        $client->request(Constants::PUT, '/api/member/666', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([]));

        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }

    public function testCannotPutOneMemberWithDeadline()
    {
        $param = $this->entityManager->getRepository(ParamGlobal::class)->findOneBy(['label' => 'new_member_deadline']);
        $param->setValue($this->faker->dateTimeBetween('-99 years', '-1 years')->format('Y-m-d'));
        $this->entityManager->persist($param);
        $this->entityManager->flush();

        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');

        $client->request(Constants::PUT, '/api/member/2', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([]));

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    public function testCannotPutOneMemberWithCreationDisable()
    {
        $param = $this->entityManager->getRepository(ParamGlobal::class)->findOneBy(['label' => 'is_create_new_member_able']);
        $param->setValue('false');
        $this->entityManager->persist($param);
        $this->entityManager->flush();

        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');

        $client->request(Constants::PUT, '/api/member/2', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([]));

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [DELETE] /api/member
     */
    public function testDeleteOneMemberById()
    {
        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');
        $client->request(Constants::DELETE, '/api/member/2');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testCannotDeleteOneMemberByNoneExistingId()
    {
        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');
        $client->request(Constants::DELETE, '/api/member/666');

        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [GET] /api/member/me/price
     */
    public function testGetPriceMembersMe()
    {
        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');
        $client->request(Constants::GET, '/api/member/me/price');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertInternalType('array', $data);
        $this->assertArrayHasKey('price', $data);
        $this->assertInternalType('array', $data['price']);
    }

    public function testCannotGetPriceOnNoneMembersMe()
    {
        $client = $this->createAuthenticatedClient('coach@mail.com', '123456789azerty+*/');
        $client->request(Constants::GET, '/api/member/me/price');

        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [GET] /api/member/{id}/price
     */
    public function testGetPriceMembersByIdOnCurrentSeason()
    {
        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');
        $client->request(Constants::GET, '/api/member/1/price');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertInternalType('array', $data);
        $this->assertArrayHasKey('price', $data);
        $this->assertArrayHasKey('position', $data);
        $this->assertArrayHasKey('paramPrice', $data);
        $this->assertInternalType('null', $data['paramPrice']);
    }

    public function testGetPriceMembersByIdOnOldSeason()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');
        $client->request(Constants::GET, '/api/member/6/price');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertInternalType('array', $data);
        $this->assertArrayHasKey('price', $data);
        $this->assertArrayHasKey('position', $data);
        $this->assertArrayHasKey('paramPrice', $data);
        $this->assertInternalType('array', $data['paramPrice']);
        $this->assertArrayHasKey('global', $data['paramPrice']);
        $this->assertArrayHasKey('license', $data['paramPrice']);
        $this->assertArrayHasKey('transfer', $data['paramPrice']);
        $this->assertArrayHasKey('discount', $data['paramPrice']);
    }

    public function testCannotGetPriceMembersByNoneExistingId()
    {
        $client = $this->createAuthenticatedClient('coach@mail.com', '123456789azerty+*/');
        $client->request(Constants::GET, '/api/member/666/price');

        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [POST] /api/member/{id}/validate-document
     */
    
    /**
     * @deprecated No longer used : no more document are uploaded.
     */
    // public function testPostValidateDocumentMemberById()
    // {
    //     $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');

    //     $srcBase = __DIR__ . "/../../../public/img/logo.png";
    //     $srcNew = __DIR__ . "/../../../public/img/logo_copy.png";
    //     copy($srcBase, $srcNew);
    //     $file = new UploadedFile($srcNew, 'mydocument.png', 'image/png', null, true);
    //     $client->request(Constants::POST, '/api/document/2/1', [], ['documentFile' => $file]);

    //     copy($srcBase, $srcNew);
    //     $file = new UploadedFile($srcNew, 'mydocument.png', 'image/png', null, true);
    //     $client->request(Constants::POST, '/api/document/2/2', [], ['documentFile' => $file]);

    //     $member = $this->entityManager->getRepository(Member::class)->findOneBy(['id' => 2]);
    //     $member
    //         ->setIsReducedPrice(true)
    //         ->setSex($this->entityManager->getRepository(ParamSex::class)->findOneBy(['id' => 1]))
    //         ->setSeason($this->entityManager->getRepository(ParamSeason::class)->findOneBy(['is_current' => true]))
    //         ->setUser($this->entityManager->getRepository(User::class)->findOneBy(['username' => 'user@mail.com']))
    //         ->setTeams(new \Doctrine\Common\Collections\ArrayCollection([]));

    //     $this->entityManager->persist($member);
    //     $this->entityManager->flush();

    //     $client->request(Constants::POST, '/api/member/2/validate-document');

    //     $this->assertEquals(200, $client->getResponse()->getStatusCode());
    // }

    /**
     * @deprecated No longer used : no more document are uploaded.
     */
    // public function testPostValidateDocumentMemberByIdWithoutReducedPrice()
    // {
    //     $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');

    //     $srcBase = __DIR__ . "/../../../public/img/logo.png";
    //     $srcNew = __DIR__ . "/../../../public/img/logo_copy.png";
    //     copy($srcBase, $srcNew);
    //     $file = new UploadedFile($srcNew, 'mydocument.png', 'image/png', null, true);
    //     $client->request(Constants::POST, '/api/document/2/1', [], ['documentFile' => $file]);

    //     $member = $this->entityManager->getRepository(Member::class)->findOneBy(['id' => 2]);
    //     $member
    //         ->setIsReducedPrice(false)
    //         ->setSex($this->entityManager->getRepository(ParamSex::class)->findOneBy(['id' => 1]))
    //         ->setSeason($this->entityManager->getRepository(ParamSeason::class)->findOneBy(['is_current' => true]))
    //         ->setUser($this->entityManager->getRepository(User::class)->findOneBy(['username' => 'user@mail.com']))
    //         ->setTeams(new \Doctrine\Common\Collections\ArrayCollection([]));

    //     $this->entityManager->persist($member);
    //     $this->entityManager->flush();

    //     $client->request(Constants::POST, '/api/member/2/validate-document');

    //     $this->assertEquals(200, $client->getResponse()->getStatusCode());
    // }

    /**
     * @deprecated No longer used : no more document are uploaded.
     */
    // public function testCannotPostValidateDocumentMemberByIdWithoutDocs()
    // {
    //     $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');

    //     $client->request(Constants::POST, '/api/member/2/validate-document');

    //     $this->assertEquals(400, $client->getResponse()->getStatusCode());
    // }

    /**
     * @deprecated No longer used : no more document are uploaded.
     */
    // public function testPostValidateDocumentMemberByIdByNoneExistingId()
    // {
    //     $client = $this->createAuthenticatedClient('coach@mail.com', '123456789azerty+*/');
    //     $client->request(Constants::POST, '/api/member/666/validate-document');

    //     $this->assertEquals(404, $client->getResponse()->getStatusCode());
    // }

    /**
     * Route [POST] /api/member/me/pay
     */
    public function testPostPayMeWithPaypal()
    {
        $members = $this->entityManager->getRepository(Member::class)->findBy(['user' => $this->entityManager->getRepository(User::class)->findOneBy(['username' => 'user@mail.com'])]);
        //Keep only one member for easiest test
        foreach ($members as $member) {
            if ($member->getId() > 1) {
                $entity = $this->entityManager->merge($member);
                $this->entityManager->remove($entity);
                $this->entityManager->flush();
            } else {
                $entity = $this->entityManager->merge($member);
                $entity
                    ->setIsDocumentComplete(true)
                    ->setIsPayed(false)
                    ->setSex($this->entityManager->getRepository(ParamSex::class)->findOneBy(['id' => 1]))
                    ->setSeason($this->entityManager->getRepository(ParamSeason::class)->findOneBy(['is_current' => true]))
                    ->setUser($this->entityManager->getRepository(User::class)->findOneBy(['username' => 'user@mail.com']))
                    ->setTeams(new \Doctrine\Common\Collections\ArrayCollection([]));
                $this->entityManager->persist($entity);
                $this->entityManager->flush();
            }
        }

        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');
        $client->request(Constants::POST, '/api/member/me/pay', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'payment_solution' => 1,
            'paypalInfos' => [
                'id_payment' => $this->faker->word(),
                'creation_datetime' => $this->faker->dateTime()->format('Y-m-d h:m:s'),
                'amount' => $this->faker->numberBetween(0, 200),
                'currency' => $this->faker->currencyCode(),
                'email' => $this->faker->email(),
                'country' => $this->faker->country(),
                'firstname' => $this->faker->firstName(),
                'lastname' => $this->faker->lastName(),
                'data' => $this->faker->text(),
            ]
        ]));

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testCannotPostPayMeWithPaypalAndWrongData()
    {
        $members = $this->entityManager->getRepository(Member::class)->findBy(['user' => $this->entityManager->getRepository(User::class)->findOneBy(['username' => 'user@mail.com'])]);
        //Keep only one member for easiest test
        foreach ($members as $member) {
            if ($member->getId() > 1) {
                $entity = $this->entityManager->merge($member);
                $this->entityManager->remove($entity);
                $this->entityManager->flush();
            } else {
                $entity = $this->entityManager->merge($member);
                $entity
                    ->setIsDocumentComplete(true)
                    ->setIsPayed(false)
                    ->setSex($this->entityManager->getRepository(ParamSex::class)->findOneBy(['id' => 1]))
                    ->setSeason($this->entityManager->getRepository(ParamSeason::class)->findOneBy(['is_current' => true]))
                    ->setUser($this->entityManager->getRepository(User::class)->findOneBy(['username' => 'user@mail.com']))
                    ->setTeams(new \Doctrine\Common\Collections\ArrayCollection([]));
                $this->entityManager->persist($entity);
                $this->entityManager->flush();
            }
        }

        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');
        $client->request(Constants::POST, '/api/member/me/pay', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'payment_solution' => 1,
            'paypalInfos' => [
                'id_payment' => $this->faker->word(),
                'creation_datetime' => $this->faker->dateTime()->format('Y-m-d h:m:s'),
                'amount' => 'abcdef',
                'currency' => $this->faker->currencyCode(),
                'email' => $this->faker->email(),
                'country' => $this->faker->country(),
                'firstname' => $this->faker->firstName(),
                'lastname' => $this->faker->lastName(),
                'data' => $this->faker->text(),
            ]
        ]));

        $this->assertEquals(400, $client->getResponse()->getStatusCode());
    }

    public function testPostPayMeWithCheques()
    {
        $members = $this->entityManager->getRepository(Member::class)->findBy(['user' => $this->entityManager->getRepository(User::class)->findOneBy(['username' => 'user@mail.com'])]);
        //Keep only one member for easiest test
        foreach ($members as $member) {
            if ($member->getId() > 1) {
                $entity = $this->entityManager->merge($member);
                $this->entityManager->remove($entity);
                $this->entityManager->flush();
            } else {
                $entity = $this->entityManager->merge($member);
                $entity
                    ->setIsDocumentComplete(true)
                    ->setIsPayed(false)
                    ->setSex($this->entityManager->getRepository(ParamSex::class)->findOneBy(['id' => 1]))
                    ->setSeason($this->entityManager->getRepository(ParamSeason::class)->findOneBy(['is_current' => true]))
                    ->setUser($this->entityManager->getRepository(User::class)->findOneBy(['username' => 'user@mail.com']))
                    ->setTeams(new \Doctrine\Common\Collections\ArrayCollection([]));
                $this->entityManager->persist($entity);
                $this->entityManager->flush();
            }
        }

        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');
        $client->request(Constants::POST, '/api/member/me/pay', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'payment_solution' => 3,
            'each' => [
                [
                    'id' => 1,
                    'price_other' => $this->faker->numberBetween(0, 200)
                ]
            ]
        ]));

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testCannotPostPayMeWithChequesAndWrongData()
    {
        $members = $this->entityManager->getRepository(Member::class)->findBy(['user' => $this->entityManager->getRepository(User::class)->findOneBy(['username' => 'user@mail.com'])]);
        //Keep only one member for easiest test
        foreach ($members as $member) {
            if ($member->getId() > 1) {
                $entity = $this->entityManager->merge($member);
                $this->entityManager->remove($entity);
                $this->entityManager->flush();
            } else {
                $entity = $this->entityManager->merge($member);
                $entity
                    ->setIsDocumentComplete(true)
                    ->setIsPayed(false)
                    ->setSex($this->entityManager->getRepository(ParamSex::class)->findOneBy(['id' => 1]))
                    ->setSeason($this->entityManager->getRepository(ParamSeason::class)->findOneBy(['is_current' => true]))
                    ->setUser($this->entityManager->getRepository(User::class)->findOneBy(['username' => 'user@mail.com']))
                    ->setTeams(new \Doctrine\Common\Collections\ArrayCollection([]));
                $this->entityManager->persist($entity);
                $this->entityManager->flush();
            }
        }

        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');
        $client->request(Constants::POST, '/api/member/me/pay', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'payment_solution' => 3,
            'each' => [
                [
                    'id' => 1,
                    'price_other' => -666
                ]
            ]
        ]));

        $this->assertEquals(400, $client->getResponse()->getStatusCode());
    }

    public function testPostPayMeWithOther()
    {
        $members = $this->entityManager->getRepository(Member::class)->findBy(['user' => $this->entityManager->getRepository(User::class)->findOneBy(['username' => 'user@mail.com'])]);
        //Keep only one member for easiest test
        foreach ($members as $member) {
            if ($member->getId() > 1) {
                $entity = $this->entityManager->merge($member);
                $this->entityManager->remove($entity);
                $this->entityManager->flush();
            } else {
                $entity = $this->entityManager->merge($member);
                $entity
                    ->setIsDocumentComplete(true)
                    ->setIsPayed(false)
                    ->setSex($this->entityManager->getRepository(ParamSex::class)->findOneBy(['id' => 1]))
                    ->setSeason($this->entityManager->getRepository(ParamSeason::class)->findOneBy(['is_current' => true]))
                    ->setUser($this->entityManager->getRepository(User::class)->findOneBy(['username' => 'user@mail.com']))
                    ->setTeams(new \Doctrine\Common\Collections\ArrayCollection([]));
                $this->entityManager->persist($entity);
                $this->entityManager->flush();
            }
        }

        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');
        $client->request(Constants::POST, '/api/member/me/pay', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'payment_solution' => 2
        ]));

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testCannotPostPayMeWitoutMembers()
    {
        $members = $this->entityManager->getRepository(Member::class)->findBy(['user' => $this->entityManager->getRepository(User::class)->findOneBy(['username' => 'user@mail.com'])]);
        //Keep only one member for easiest test
        foreach ($members as $member) {
            $entity = $this->entityManager->merge($member);
            $this->entityManager->remove($entity);
            $this->entityManager->flush();
        }

        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');
        $client->request(Constants::POST, '/api/member/me/pay');

        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }

    /**
     * @deprecated No longer used : no more document are uploaded.
     */
    // public function testCannotPostPayMeWitMembersNotDocumentCompleted()
    // {
    //     $members = $this->entityManager->getRepository(Member::class)->findBy(['user' => $this->entityManager->getRepository(User::class)->findOneBy(['username' => 'user@mail.com'])]);
    //     //Keep only one member for easiest test
    //     foreach ($members as $member) {
    //         if ($member->getId() > 1) {
    //             $entity = $this->entityManager->merge($member);
    //             $this->entityManager->remove($entity);
    //             $this->entityManager->flush();
    //         } else {
    //             $member
    //                 ->setIsDocumentComplete(false)
    //                 ->setIsPayed(false)
    //                 ->setSex($this->entityManager->getRepository(ParamSex::class)->findOneBy(['id' => 1]))
    //                 ->setSeason($this->entityManager->getRepository(ParamSeason::class)->findOneBy(['is_current' => true]))
    //                 ->setUser($this->entityManager->getRepository(User::class)->findOneBy(['username' => 'user@mail.com']))
    //                 ->setTeams(new \Doctrine\Common\Collections\ArrayCollection([]));
    //             $this->entityManager->persist($member);
    //             $this->entityManager->flush();
    //         }
    //     }

    //     $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');
    //     $client->request(Constants::POST, '/api/member/me/pay');

    //     $this->assertEquals(400, $client->getResponse()->getStatusCode());
    // }

    public function testCannotPostPayMeWithWrongPaymentId()
    {
        $members = $this->entityManager->getRepository(Member::class)->findBy(['user' => $this->entityManager->getRepository(User::class)->findOneBy(['username' => 'user@mail.com'])]);
        //Keep only one member for easiest test
        foreach ($members as $member) {
            if ($member->getId() > 1) {
                $entity = $this->entityManager->merge($member);
                $this->entityManager->remove($entity);
                $this->entityManager->flush();
            } else {
                $entity = $this->entityManager->merge($member);
                $entity
                    ->setIsDocumentComplete(true)
                    ->setIsPayed(false)
                    ->setSex($this->entityManager->getRepository(ParamSex::class)->findOneBy(['id' => 1]))
                    ->setSeason($this->entityManager->getRepository(ParamSeason::class)->findOneBy(['is_current' => true]))
                    ->setUser($this->entityManager->getRepository(User::class)->findOneBy(['username' => 'user@mail.com']))
                    ->setTeams(new \Doctrine\Common\Collections\ArrayCollection([]));
                $this->entityManager->persist($entity);
                $this->entityManager->flush();
            }
        }

        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');
        $client->request(Constants::POST, '/api/member/me/pay', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'payment_solution' => 666,
        ]));
        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }
}
