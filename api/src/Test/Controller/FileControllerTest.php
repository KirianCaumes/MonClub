<?php

namespace App\Test\Controller;

use App\Constants;
use App\Entity\Member;
use App\Entity\Param\ParamPriceGlobal;
use App\Entity\Param\ParamSeason;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Liip\TestFixturesBundle\Test\FixturesTrait;
use Faker;
use App\Test\TraitTest;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * Member controller test
 */

class FileControllerTest extends WebTestCase
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
     * Route [GET] /api/document/google/contact
     */
    public function testGetDocumentGoogleContact()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/document/google/contact');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertEquals(true, $client->getResponse()->isOk());
    }

    /**
     * Route [GET] /api/document/excel/tracking
     */
    public function testGetDocumentExcelTracking()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/document/excel/tracking');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertEquals(true, $client->getResponse()->isOk());
    }

    /**
     * Route [GET] /api/document/excel/general
     */
    public function testGetDocumentExcelGeneral()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/document/excel/general');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertEquals(true, $client->getResponse()->isOk());
    }

    /**
     * Route [GET] /api/document/excel/calculhand
     */
    public function testGetDocumentExcelCalculhand()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/document/excel/calculhand');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertEquals(true, $client->getResponse()->isOk());
    }

    /**
     * Route [GET] /api/document/:id/attestation
     */
    public function testGetDocumentAttestationByMemberId()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');
        $client->request(Constants::GET, '/api/document/1/attestation');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertEquals(true, $client->getResponse()->isOk());
    }

    public function testCannotGetDocumentAttestationByNoneExistingMemberId()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/document/666/attestation');
        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }

    public function testCannotGetDocumentAttestationByNonePayedMemberId()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/document/2/attestation');
        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [GET] /api/document/:id/non-objection
     */
    public function testGetDocumentNonObjectionByMemberId()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');
        $client->request(Constants::GET, '/api/document/1/non-objection?address=test&club=test');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertEquals(true, $client->getResponse()->isOk());
    }

    public function testCannotGetDocumentNonObjectionByNoneExistingMemberId()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/document/666/non-objection?address=test&club=test');
        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [GET] /api/document/:id/facture
     */
    public function testGetDocumentFactureByMemberId()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');
        $client->request(Constants::GET, '/api/document/1/facture');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertEquals(true, $client->getResponse()->isOk());
    }

    public function testCannotGetDocumentFactureByNoneExistingMemberId()
    {
        $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

        $client->request(Constants::GET, '/api/document/666/facture');
        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }

    /**
     * Route [GET] /api/{memberId}/{documentCategoryId}
     */    
    /**
     * @deprecated No longer used : no more document are uploaded.
     */
    // public function testGetDocumentByMemberIdAndDocumentId()
    // {
    //     $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');
    //     $client->request(Constants::GET, '/api/document/1/1');

    //     $this->assertEquals(200, $client->getResponse()->getStatusCode());
    //     $this->assertEquals(true, $client->getResponse()->isOk());
    // }

    /**
     * @deprecated No longer used : no more document are uploaded.
     */
    // public function testCannotGetDocumentByNoneExistingMemberIdAndDocumentId()
    // {
    //     $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

    //     $client->request(Constants::GET, '/api/document/666/1');
    //     $this->assertEquals(404, $client->getResponse()->getStatusCode());
    // }

    /**
     * @deprecated No longer used : no more document are uploaded.
     */
    // public function testCannotGetDocumentByMemberIdAndNoneExistingDocumentId()
    // {
    //     $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

    //     $client->request(Constants::GET, '/api/document/1/666');
    //     $this->assertEquals(404, $client->getResponse()->getStatusCode());
    // }

    /**
     * Route [POST] /api/{memberId}/{documentCategoryId}
     */
    /**
     * @deprecated No longer used : no more document are uploaded.
     */
    // public function testPostDocumentByMemberIdAndDocumentId()
    // {
    //     $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

    //     $srcBase = __DIR__ . "/../../../public/img/logo.png";
    //     $srcNew = __DIR__ . "/../../../public/img/logo_copy.png";
    //     copy($srcBase, $srcNew);

    //     $file = new UploadedFile($srcNew, 'mydocument.png', 'image/png', null, true);

    //     $client->request(Constants::POST, '/api/document/1/1', [], ['documentFile' => $file]);

    //     $this->assertEquals(201, $client->getResponse()->getStatusCode());
    // }

    /**
     * @deprecated No longer used : no more document are uploaded.
     */
    // public function testCannotPostDocumentByNoneExistingMemberIdAndDocumentId()
    // {
    //     $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

    //     $client->request(Constants::POST, '/api/document/666/1');
    //     $this->assertEquals(404, $client->getResponse()->getStatusCode());
    // }

    /**
     * @deprecated No longer used : no more document are uploaded.
     */
    // public function testCannotPostDocumentByMemberIdAndNoneExistingDocumentId()
    // {
    //     $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

    //     $client->request(Constants::POST, '/api/document/1/666');
    //     $this->assertEquals(404, $client->getResponse()->getStatusCode());
    // }

    /**
     * @deprecated No longer used : no more document are uploaded.
     */
    // public function testCannotPostDocumentByMemberIdAndDocumentIdWithoutFile()
    // {
    //     $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

    //     $client->request(Constants::POST, '/api/document/1/1');
    //     $this->assertEquals(400, $client->getResponse()->getStatusCode());
    // }

    /**
     * Route [DELETE] /api/{memberId}/{documentCategoryId}
     */
    /**
     * @deprecated No longer used : no more document are uploaded.
     */
    // public function testDeleteDocumentByMemberIdAndDocumentId()
    // {
    //     $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

    //     $client->request(Constants::DELETE, '/api/document/1/1');

    //     $this->assertEquals(200, $client->getResponse()->getStatusCode());
    // }

    /**
     * @deprecated No longer used : no more document are uploaded.
     */
    // public function testCannotDeleteDocumentByNoneExistingMemberIdAndDocumentId()
    // {
    //     $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

    //     $client->request(Constants::GET, '/api/document/666/1');
    //     $this->assertEquals(404, $client->getResponse()->getStatusCode());
    // }

    /**
     * @deprecated No longer used : no more document are uploaded.
     */
    // public function testCannotDeleteDocumentByMemberIdAndNoneExistingDocumentId()
    // {
    //     $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

    //     $client->request(Constants::GET, '/api/document/1/666');
    //     $this->assertEquals(404, $client->getResponse()->getStatusCode());
    // }

    /**
     * @deprecated No longer used : no more document are uploaded.
     */
    // public function testDeleteDocumentByMemberIdAndDocumentIdWithoutExistingFile()
    // {
    //     $client = $this->createAuthenticatedClient('super-admin@mail.com', '123456789azerty+*/');

    //     $client->request(Constants::DELETE, '/api/document/1/2');

    //     $this->assertEquals(404, $client->getResponse()->getStatusCode());
    // }
}
