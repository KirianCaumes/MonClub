<?php

namespace App\DataFixtures;

use App\Entity\Document;
use App\Entity\Member;
use App\Entity\Team;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Faker;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class DocumentFixture extends Fixture implements OrderedFixtureInterface
{
    /**
     * Load data fixtures with the passed EntityManager
     * @param ObjectManager $manager
     */
    public function load(ObjectManager $manager)
    {
        $faker = Faker\Factory::create('fr_FR');
        $member = $this->getReference('member');
        $paramDocumentCategory = $this->getReference('param-document-category');

        $srcBase = __DIR__ . "/../../public/img/logo.png";
        $srcNew = __DIR__ . "/../../public/img/logo_copy.png";
        copy($srcBase, $srcNew);

        $file = new UploadedFile(
            $srcNew,
            'mydocument.png',
            'image/png',
            null,
            true
        );

        $document = new Document();
        $document
            ->setMember($member)
            ->setCategory($paramDocumentCategory)
            ->setDocumentFile($file);

        $manager->persist($document);
        $manager->flush();
    }

    /**
     * Get the order of this fixture
     * @return integer
     */
    public function getOrder()
    {
        return 10;
    }
}
