<?php

namespace App\DataFixtures;

use App\Entity\Param\ParamDocumentCategory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Faker;

class ParamDocumentCategoryFixture extends Fixture implements OrderedFixtureInterface
{
    /**
     * Load data fixtures with the passed EntityManager
     * @param ObjectManager $manager
     */
    public function load(ObjectManager $manager)
    {
        $faker = Faker\Factory::create('fr_FR');
        $paramSeason = $this->getReference('param-season');

        $data = [
            ['id' => 1, 'label' => 'Certificat médical'],
            ['id' => 2, 'label' => 'Justificatif étudiant/chomeur'],
        ];

        foreach ($data as $el) {
            $paramDocumentCategory = new ParamDocumentCategory();
            $paramDocumentCategory
                ->setLabel($el['label']);
                if ($el['id'] === 1) $this->addReference('param-document-category', $paramDocumentCategory);
            $manager->persist($paramDocumentCategory);
        }

        $manager->flush();
    }

    /**
     * Get the order of this fixture
     * @return integer
     */
    public function getOrder()
    {
        return 8;
    }
}
