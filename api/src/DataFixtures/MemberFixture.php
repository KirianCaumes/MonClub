<?php

namespace App\DataFixtures;

use App\Entity\Member;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Faker;

class MemberFixture extends Fixture implements OrderedFixtureInterface
{
    /**
     * Load data fixtures with the passed EntityManager
     * @param ObjectManager $manager
     */
    public function load(ObjectManager $manager)
    {
        $faker = Faker\Factory::create('fr_FR');
        $user = $this->getReference('user');
        $paramSeason = $this->getReference('param-season');
        $oldParamSeason = $this->getReference('old-param-season');
        $team = $this->getReference('team');

        for ($i = 0; $i < 25; $i++) {
            $member = new Member();
            $member
                ->setFirstname($faker->firstName())
                ->setLastname($faker->lastName())
                ->setBirthdate($faker->dateTime('2014-01-01 00:00:00'))
                ->setEmail($faker->email())
                ->setPhoneNumber($faker->phoneNumber())
                ->setPostalCode($faker->postcode())
                ->setStreet($faker->country())
                ->setCity($faker->city())
                ->setProfession($faker->jobTitle())
                ->setParentOneFirstname($faker->firstName())
                ->setParentOneLastname($faker->lastName())
                ->setParentOnePhoneNumber($faker->phoneNumber())
                ->setParentOneEmail($faker->email())
                ->setParentOneProfession($faker->jobTitle())
                ->setParentTwoFirstname($faker->firstName())
                ->setParentTwoLastname($faker->lastName())
                ->setParentTwoPhoneNumber($faker->phoneNumber())
                ->setParentTwoEmail($faker->email())
                ->setParentTwoProfession($faker->jobTitle())
                ->setIsEvacuationAllow($faker->boolean())
                ->setIsTransportAllow($faker->boolean())
                ->setIsImageAllow($faker->boolean())
                ->setIsReturnHomeAllow($faker->boolean())
                ->setIsNewsletterAllow($faker->boolean())
                ->setIsAccepted(true)
                ->setIsTransferNeeded(false)
                ->setIsDocumentComplete($i === 0)
                ->setIsPayed($i === 0)
                ->setAmountPayed(null)
                ->setAmountPayedOther(null)
                ->setIsLicenseRenewal(true)
                ->setPaymentNotes(null)
                ->setIsCheckGestHand(false)
                ->setIsInscriptionDone($i === 0)
                ->setGesthandIsPhoto(false)
                ->setGesthandIsPhotoId(false)
                ->setGesthandIsCertificate(false)
                ->setGesthandCertificateDate(null)
                ->setGesthandIsHealthQuestionnaire(false)
                ->setGesthandIsFfhbAuthorization(false)
                ->setGesthandQualificationDate(null)
                ->setCreationDatetime(new \DateTime())
                ->setNotes(null)
                ->setSeason($i < 5 ? $paramSeason : $oldParamSeason)
                ->setUser($i < 2 || $i === 10 ? $user : null)
                ->setTeams(new \Doctrine\Common\Collections\ArrayCollection([$team]));
            if ($i === 0) $this->addReference('member', $member);
            $manager->persist($member);
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
