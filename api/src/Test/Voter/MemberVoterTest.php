<?php

namespace App\Test\Voter;

use App\Constants;
use App\Entity\Member;
use App\Entity\Param\ParamPriceGlobal;
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

class MemberVoterTest extends WebTestCase
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
     * [CREATE]
     */
    public function testCanCreate()
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
    }

    public function testCannotCreate()
    {
        $client = $this->createAuthenticatedClient('user2@mail.com', '123456789azerty+*/');

        $client->request(Constants::POST, '/api/member', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([]));

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * [CREATE_ADMIN]
     */
    public function testCanCreateAdmin()
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
    }

    /**
     * [READ]
     */
    public function testCanReadWithAdmin()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/member/1');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testCanReadWithCoach()
    {
        $client = $this->createAuthenticatedClient('coach@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/member/1');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testCannotReadWithCoach()
    {
        $client = $this->createAuthenticatedClient('coach@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/member/16');

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    public function testCanReadWithUser()
    {
        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/member/1/price');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testCannotReadWithUser()
    {
        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/member/3/price');

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * [READ_DOCUMENT]
     */
    public function testCanReadDocumentWithAdmin()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/document/1/attestation');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testCanReadDocumentWithUser()
    {
        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/document/1/attestation');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testCannotReadDocumentWithUser()
    {
        $client = $this->createAuthenticatedClient('user2@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/document/3/attestation');

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * [UPDATE]
     */
    public function testCanUpdate()
    {
        $member = $this->entityManager->getRepository(Member::class)->findOneBy(['id' => 2]);
        $member
            ->setIsPayed(false)
            ->setIsDocumentComplete(false)
            ->setSex($this->entityManager->getRepository(ParamSex::class)->findOneBy(['id' => 1]))
            ->setSeason($this->entityManager->getRepository(ParamSeason::class)->findOneBy(['is_current' => true]))
            ->setUser($this->entityManager->getRepository(User::class)->findOneBy(['username' => 'user@mail.com']))
            ->setTeams(new \Doctrine\Common\Collections\ArrayCollection([]));

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
    }

    public function testCannotUpdate()
    {
        $member = $this->entityManager->getRepository(Member::class)->findOneBy(['id' => 2]);
        $entity = $this->entityManager->merge($member);
        $entity
            ->setIsPayed(true)
            ->setIsDocumentComplete(false)
            ->setSex($this->entityManager->getRepository(ParamSex::class)->findOneBy(['id' => 1]))
            ->setSeason($this->entityManager->getRepository(ParamSeason::class)->findOneBy(['is_current' => true]))
            ->setUser($this->entityManager->getRepository(User::class)->findOneBy(['username' => 'user@mail.com']))
            ->setTeams(new \Doctrine\Common\Collections\ArrayCollection([]));
        $this->entityManager->persist($entity);
        $this->entityManager->flush();

        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');

        $client->request(Constants::PUT, '/api/member/2');

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * [UPDATE_ADMIN]
     */
    public function testCanUpdateAdmin()
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
    }

    /**
     * [DELETE]
     */
    public function testCanDelete()
    {
        $member = $this->entityManager->getRepository(Member::class)->findOneBy(['id' => 1]);
        $entity = $this->entityManager->merge($member);
        $entity
            ->setIsPayed(false)
            ->setSex($this->entityManager->getRepository(ParamSex::class)->findOneBy(['id' => 1]))
            ->setSeason($this->entityManager->getRepository(ParamSeason::class)->findOneBy(['is_current' => true]))
            ->setUser($this->entityManager->getRepository(User::class)->findOneBy(['username' => 'user@mail.com']))
            ->setTeams(new \Doctrine\Common\Collections\ArrayCollection([]));
        $this->entityManager->persist($entity);
        $this->entityManager->flush();

        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::DELETE, '/api/member/1');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testCanDeleteUser()
    {
        $member = $this->entityManager->getRepository(Member::class)->findOneBy(['id' => 2]);
        $entity = $this->entityManager->merge($member);
        $entity
            ->setIsPayed(false)
            ->setSex($this->entityManager->getRepository(ParamSex::class)->findOneBy(['id' => 1]))
            ->setSeason($this->entityManager->getRepository(ParamSeason::class)->findOneBy(['is_current' => true]))
            ->setUser($this->entityManager->getRepository(User::class)->findOneBy(['username' => 'user@mail.com']))
            ->setTeams(new \Doctrine\Common\Collections\ArrayCollection([]));
        $this->entityManager->persist($entity);
        $this->entityManager->flush();

        $client = $this->createAuthenticatedClient('user@mail.com', '123456789azerty+*/');

        $client->request(Constants::DELETE, '/api/member/2');
        var_dump($client->getResponse()->getContent());

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testCannotDeleteMemberPayed()
    {
        $member = $this->entityManager->getRepository(Member::class)->findOneBy(['id' => 1]);
        $entity = $this->entityManager->merge($member);
        $entity
            ->setIsPayed(true)
            ->setSex($this->entityManager->getRepository(ParamSex::class)->findOneBy(['id' => 1]))
            ->setSeason($this->entityManager->getRepository(ParamSeason::class)->findOneBy(['is_current' => true]))
            ->setUser($this->entityManager->getRepository(User::class)->findOneBy(['username' => 'user@mail.com']))
            ->setTeams(new \Doctrine\Common\Collections\ArrayCollection([]));
        $this->entityManager->persist($entity);
        $this->entityManager->flush();

        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::DELETE, '/api/member/1');

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    public function testCannotDeleteMemberNotAccess()
    {
        $member = $this->entityManager->getRepository(Member::class)->findOneBy(['id' => 1]);
        $entity = $this->entityManager->merge($member);
        $entity
            ->setIsPayed(false)
            ->setSex($this->entityManager->getRepository(ParamSex::class)->findOneBy(['id' => 1]))
            ->setSeason($this->entityManager->getRepository(ParamSeason::class)->findOneBy(['is_current' => true]))
            ->setUser($this->entityManager->getRepository(User::class)->findOneBy(['username' => 'user@mail.com']))
            ->setTeams(new \Doctrine\Common\Collections\ArrayCollection([]));
        $this->entityManager->persist($entity);
        $this->entityManager->flush();

        $client = $this->createAuthenticatedClient('user2@mail.com', '123456789azerty+*/');

        $client->request(Constants::DELETE, '/api/member/1');

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }
}
