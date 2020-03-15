<?php

namespace App\DataFixtures;

use App\Entity\Param\ParamPaymentSolution;
use App\Entity\Param\ParamPriceTransfer;
use App\Entity\Param\ParamReductionFamily;
use App\Entity\Param\ParamSex;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Faker;

class ParamSexFixture extends Fixture implements OrderedFixtureInterface
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
            ['id' => 1, 'label' => 'Homme', 'icon' => 'Man', 'civility' => 'Monsieur'],
            ['id' => 2, 'label' => 'Femme', 'icon' => 'Woman', 'civility' => 'Madame'],
        ];

        foreach ($data as $el) {
            $paramPaymentSolution = new ParamSex();
            $paramPaymentSolution
                ->setLabel($el['label'])
                ->setIcon($el['icon'])
                ->setCivility($el['civility']);
            $manager->persist($paramPaymentSolution);
        }

        $manager->flush();
    }

    /**
     * Get the order of this fixture
     * @return integer
     */
    public function getOrder()
    {
        return 13;
    }
}
