<?php

namespace App\DataFixtures;

use App\Constants;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Faker;

class UserFixture extends Fixture implements OrderedFixtureInterface
{  
    /**
    * Load data fixtures with the passed EntityManager
    * @param ObjectManager $manager
    */
    public function load(ObjectManager $manager)
    {
        $faker = Faker\Factory::create('fr_FR');
        $team = $this->getReference('team');

        $user = new User();
        $user
            ->setEmail('super-admin@mail.com')
            ->setUsername('super-admin@mail.com')
            ->setPlainPassword('123456789azerty+*/')
            ->setEnabled(true)
            ->setRoles([Constants::ROLE_SUPER_ADMIN]);

        $manager->persist($user);

        $user = new User();
        $user
            ->setEmail('admin@mail.com')
            ->setUsername('admin@mail.com')
            ->setPlainPassword('123456789azerty+*/')
            ->setEnabled(true)
            ->setRoles([Constants::ROLE_ADMIN]);

        $manager->persist($user);

        $user = new User();
        $user
            ->setEmail('coach@mail.com')
            ->setUsername('coach@mail.com')
            ->setPlainPassword('123456789azerty+*/')
            ->setEnabled(true)
            ->setTeams(new \Doctrine\Common\Collections\ArrayCollection([$team]))
            ->setRoles([Constants::ROLE_COACH]);

        $manager->persist($user);

        $user = new User();
        $user
            ->setEmail('user@mail.com')
            ->setUsername('user@mail.com')
            ->setPlainPassword('123456789azerty+*/')
            ->setEnabled(true)
            ->setRoles([]);

        $manager->persist($user);
        $this->addReference('user', $user);

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
