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

        for ($i = 0; $i < 10; $i++) {
            $member = new Member();
            $member
                ->setFirstname($faker->name())
                ->setLastname($faker->name())
                ->setBirthdate($faker->dateTime())
                ->setEmail($faker->email())
                ->setPhoneNumber($faker->phoneNumber())
                ->setPostalCode($faker->postcode())
                ->setStreet($faker->country())
                ->setCity($faker->city())
                ->setProfession($faker->jobTitle())
                ->setParentOneFirstname($faker->name())
                ->setParentOneLastname($faker->name())
                ->setParentOnePhoneNumber($faker->phoneNumber())
                ->setParentOneEmail($faker->email())
                ->setParentOneProfession($faker->jobTitle())
                ->setParentTwoFirstname($faker->name())
                ->setParentTwoLastname($faker->name())
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
                ->setIsDocumentComplete(false)
                ->setIsPayed(false)
                ->setAmountPayed(null)
                ->setAmountPayedOther(null)
                ->setIsLicenseRenewal(true)
                ->setPaymentNotes(null)
                ->setIsCheckGestHand(false)
                ->setIsInscriptionDone(false)
                ->setGesthandIsPhoto(false)
                ->setGesthandIsPhotoId(false)
                ->setGesthandIsCertificate(false)
                ->setGesthandCertificateDate(null)
                ->setGesthandIsHealthQuestionnaire(false)
                ->setGesthandIsFfhbAuthorization(false)
                ->setGesthandQualificationDate(null)
                ->setCreationDatetime(new \DateTime())
                ->setNotes(null)
                ->setSeason($paramSeason)
                ->setUser($user);
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
        return 4;
    }
}
