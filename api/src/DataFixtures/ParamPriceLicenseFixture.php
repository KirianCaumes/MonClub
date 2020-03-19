<?php

namespace App\DataFixtures;

use App\Entity\Param\ParamGlobal;
use App\Entity\Param\ParamPriceGlobal;
use App\Entity\Param\ParamPriceLicense;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Faker;

class ParamPriceLicenseFixture extends Fixture implements OrderedFixtureInterface
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
            ['id' => 1, 'label' => '2014 à 2011 inclus', 'price_before_deadline' => 100, 'price_after_deadline' => 120, 'min_year' => 2011, 'max_year' => 2014, 'id_season' => 2],
            ['id' => 2, 'label' => '2010 à 2008 inclus', 'price_before_deadline' => 135, 'price_after_deadline' => 155, 'min_year' => 2008, 'max_year' => 2010, 'id_season' => 2],
            ['id' => 3, 'label' => '2007 à 2002 inclus', 'price_before_deadline' => 145, 'price_after_deadline' => 165, 'min_year' => 2002, 'max_year' => 2007, 'id_season' => 2],
            ['id' => 4, 'label' => '2001 et avant', 'price_before_deadline' => 160, 'price_after_deadline' => 180, 'min_year' => 1900, 'max_year' => 2001, 'id_season' => 2],
        ];

        foreach ($data as $el) {
            $paramPriceLicense = new ParamPriceLicense();
            $paramPriceLicense
                ->setSeason($paramSeason)
                ->setLabel($el['label'])
                ->setPriceBeforeDeadline($el['price_before_deadline'])
                ->setPriceAfterDeadline($el['price_after_deadline'])
                ->setMinYear($el['min_year'])
                ->setMaxYear($el['max_year']);
            $manager->persist($paramPriceLicense);
        }

        $oldParamSeason = $this->getReference('old-param-season');

        $data = [
            ['id' => 1, 'label' => '2014 à 2011 inclus', 'price_before_deadline' => 100, 'price_after_deadline' => 120, 'min_year' => 2011, 'max_year' => 2014, 'id_season' => 1],
            ['id' => 2, 'label' => '2010 à 2008 inclus', 'price_before_deadline' => 135, 'price_after_deadline' => 155, 'min_year' => 2008, 'max_year' => 2010, 'id_season' => 1],
            ['id' => 3, 'label' => '2007 à 2002 inclus', 'price_before_deadline' => 145, 'price_after_deadline' => 165, 'min_year' => 2002, 'max_year' => 2007, 'id_season' => 1],
            ['id' => 4, 'label' => '2001 et avant', 'price_before_deadline' => 160, 'price_after_deadline' => 180, 'min_year' => 1900, 'max_year' => 2001, 'id_season' => 1],
        ];

        foreach ($data as $el) {
            $paramPriceLicense = new ParamPriceLicense();
            $paramPriceLicense
                ->setSeason($oldParamSeason)
                ->setLabel($el['label'])
                ->setPriceBeforeDeadline($el['price_before_deadline'])
                ->setPriceAfterDeadline($el['price_after_deadline'])
                ->setMinYear($el['min_year'])
                ->setMaxYear($el['max_year']);
            $manager->persist($paramPriceLicense);
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
