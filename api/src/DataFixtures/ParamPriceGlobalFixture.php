<?php

namespace App\DataFixtures;

use App\Entity\Param\ParamGlobal;
use App\Entity\Param\ParamPriceGlobal;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Faker;

class ParamPriceGlobalFixture extends Fixture implements OrderedFixtureInterface
{
    /**
     * Load data fixtures with the passed EntityManager
     * @param ObjectManager $manager
     */
    public function load(ObjectManager $manager)
    {
        $faker = Faker\Factory::create('fr_FR');
        $paramSeason = $this->getReference('param-season');
        $oldParamSeason = $this->getReference('old-param-season');

        $paramGlobal = new ParamPriceGlobal();
        $paramGlobal
            ->setSeason($paramSeason)
            ->setReducedPriceBeforeDeadline(140)
            ->setReducedPriceAfterDeadline(160)
            ->setDeadlineDate(new \DateTime('2019-07-12'))
            ->setPaypalFee(5);
        $manager->persist($paramGlobal);

        $paramGlobal = new ParamPriceGlobal();
        $paramGlobal
            ->setSeason($oldParamSeason)
            ->setReducedPriceBeforeDeadline(140)
            ->setReducedPriceAfterDeadline(160)
            ->setDeadlineDate(new \DateTime('2018-07-12'))
            ->setPaypalFee(5);
        $manager->persist($paramGlobal);

        $manager->flush();
    }

    /**
     * Get the order of this fixture
     * @return integer
     */
    public function getOrder()
    {
        return 6;
    }
}
