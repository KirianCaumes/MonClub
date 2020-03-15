<?php

namespace App\DataFixtures;

use App\Entity\Param\ParamSeason;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Faker;

class ParamSeasonFixture extends Fixture implements OrderedFixtureInterface
{
    /**
    * Load data fixtures with the passed EntityManager
    * @param ObjectManager $manager
    */
    public function load(ObjectManager $manager)
    {
        $faker = Faker\Factory::create('fr_FR');
        $data = [
            ['id' => 1, 'label' => '2018/2019', 'is_active' => true, 'is_current' => false],
            ['id' => 2, 'label' => '2019/2020', 'is_active' => true, 'is_current' => true],
            ['id' => 3, 'label' => '2020/2021', 'is_active' => false, 'is_current' => false],
            ['id' => 4, 'label' => '2021/2022', 'is_active' => false, 'is_current' => false],
            ['id' => 5, 'label' => '2022/2023', 'is_active' => false, 'is_current' => false],
        ];

        foreach ($data as $el) {
            $paramSeason = new ParamSeason();
            $paramSeason
                ->setLabel($el['label'])
                ->setIsActive($el['is_active'])
                ->setIsCurrent($el['is_current']);
            if ($el['id'] === 1) $this->addReference('old-param-season', $paramSeason);
            if ($el['id'] === 2) $this->addReference('param-season', $paramSeason);
            $manager->persist($paramSeason);
        }

        $manager->flush();
    }

    /**
     * Get the order of this fixture
     * @return integer
     */
    public function getOrder()
    {
        return 3;
    }
}
