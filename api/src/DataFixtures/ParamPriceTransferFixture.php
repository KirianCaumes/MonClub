<?php

namespace App\DataFixtures;

use App\Entity\Param\ParamPriceTransfer;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Faker;

class ParamPriceTransferFixture extends Fixture implements OrderedFixtureInterface
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
            ['id' => 1, 'label' => '+16 ans', 'price' => 119, 'min_age' => 17, 'max_age' => 99, 'id_season' => 2],
            ['id' => 2, 'label' => '12 à 16 ans inclus', 'price' => 73, 'min_age' => 12, 'max_age' => 16, 'id_season' => 2],
            ['id' => 3, 'label' => '-12 ans', 'price' => 0, 'min_age' => 0, 'max_age' => 11, 'id_season' => 2],
        ];

        foreach ($data as $el) {
            $paramPriceTransfer = new ParamPriceTransfer();
            $paramPriceTransfer
                ->setSeason($paramSeason)
                ->setLabel($el['label'])
                ->setPrice($el['price'])
                ->setMinage($el['min_age'])
                ->setMaxage($el['max_age']);
            $manager->persist($paramPriceTransfer);
        }

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
