<?php

namespace App\DataFixtures;

use App\Entity\Member;
use App\Entity\Team;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Faker;

class TeamFixture extends Fixture implements OrderedFixtureInterface
{
    /**
    * Load data fixtures with the passed EntityManager
    * @param ObjectManager $manager
    */
    public function load(ObjectManager $manager)
    {
        $faker = Faker\Factory::create('fr_FR');

        for ($i = 0; $i < 10; $i++) {
            $team = new Team();
            $team
                ->setLabel($faker->word())
                ->setLabelGoogleContact($faker->word())
                ->setMaxNumberMembers($faker->buildingNumber())
                ->setMemberYears($faker->year())
                ->setReferentParent($faker->name())
                ->setCoaches($faker->name())
                ->setTrainers($faker->name());
                // ->setMembers();
            $manager->persist($team);
        }

        $manager->flush();
    }
    
    /**
     * Get the order of this fixture
     * @return integer
     */
    public function getOrder()
    {
        return 5;
    }
}
