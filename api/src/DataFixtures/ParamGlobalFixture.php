<?php

namespace App\DataFixtures;

use App\Entity\Param\ParamGlobal;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Faker;

class ParamGlobalFixture extends Fixture implements OrderedFixtureInterface
{
    /**
    * Load data fixtures with the passed EntityManager
    * @param ObjectManager $manager
    */
    public function load(ObjectManager $manager)
    {
        $faker = Faker\Factory::create('fr_FR');
        $data = [
            ['label' => 'text_infos_admin', 'value' => 'azerty'],
            ['label' => 'text_infos_user', 'value' => 'azertydsqds'],
            ['label' => 'president_firstname', 'value' => 'azerty'],
            ['label' => 'president_lastname', 'value' => 'benjamin'],
            ['label' => 'is_create_new_user_able', 'value' => 'true'],
            ['label' => 'new_member_deadline', 'value' => ''],
            ['label' => 'is_create_new_member_able', 'value' => 'true'],
            ['label' => 'secretary_firstname', 'value' => 'carole'],
            ['label' => 'secretary_lastname', 'value' => 'blanchard'],
            ['label' => 'date_mail_renew_certif', 'value' => '01-05'],
        ];

        foreach ($data as $el) {
            $paramGlobal = new ParamGlobal();
            $paramGlobal
                ->setLabel($el['label'])
                ->setValue($el['value']);
            $manager->persist($paramGlobal);
        }

        $manager->flush();
    }

    /**
     * Get the order of this fixture
     * @return integer
     */
    public function getOrder()
    {
        return 2;
    }
}
