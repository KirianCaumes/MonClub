<?php

namespace App\DataFixtures;

use App\Entity\Param\ParamPaymentSolution;
use App\Entity\Param\ParamPriceTransfer;
use App\Entity\Param\ParamReductionFamily;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Faker;

class ParamPaymentSolutionFixture extends Fixture implements OrderedFixtureInterface
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
            ['id' => 1, 'label' => 'Paypal', 'icon' => 'PaymentCard'],
            ['id' => 2, 'label' => 'Chèque', 'icon' => 'Document'],
            ['id' => 3, 'label' => 'Chèque & coupon(s)', 'icon' => 'DocumentSet'],
        ];

        foreach ($data as $el) {
            $paramPaymentSolution = new ParamPaymentSolution();
            $paramPaymentSolution
                ->setLabel($el['label'])
                ->setIcon($el['icon']);
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
