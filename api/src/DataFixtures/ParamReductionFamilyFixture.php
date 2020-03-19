<?php

namespace App\DataFixtures;

use App\Entity\Param\ParamPriceTransfer;
use App\Entity\Param\ParamReductionFamily;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Faker;

class ParamReductionFamilyFixture extends Fixture implements OrderedFixtureInterface
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
            ['id' => 1, 'number' => 1, 'discount' => 0, 'id_season' => 2],
            ['id' => 2, 'number' => 2, 'discount' => 10, 'id_season' => 2],
            ['id' => 3, 'number' => 3, 'discount' => 20, 'id_season' => 2],
            ['id' => 4, 'number' => 4, 'discount' => 30, 'id_season' => 2],
        ];

        foreach ($data as $el) {
            $paramReductionFamily = new ParamReductionFamily();
            $paramReductionFamily
                ->setSeason($paramSeason)
                ->setNumber($el['number'])
                ->setDiscount($el['discount']);
            $manager->persist($paramReductionFamily);
        }

        $manager->flush();
    }

    /**
     * Get the order of this fixture
     * @return integer
     */
    public function getOrder()
    {
        return 12;
    }
}
