<?php

namespace App\DataFixtures;

use App\Entity\Param\ParamSeason;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Faker;

class ParamSeasonFixture extends Fixture
{
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
            $paramGlobal = new ParamSeason();
            $paramGlobal
                ->setLabel($el['label'])
                ->setIsActive($el['is_active'])
                ->setIsCurrent($el['is_current']);
            $manager->persist($paramGlobal);
        }

        $manager->flush();
    }
}
