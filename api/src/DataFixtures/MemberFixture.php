<?php

namespace App\DataFixtures;

use App\Entity\Member;
use App\Entity\Param\ParamPaymentSolution;
use App\Entity\Param\ParamSeason;
use App\Entity\PaypalInformation;
use App\Entity\Team;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Faker;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class MemberFixture extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $faker = Faker\Factory::create('fr_FR');

        for ($i = 0; $i < 10; $i++) {
            $member = new Member();
            $member->setFirstname($faker->name());
            $member->setLastname($faker->name());
            $member->setBirthdate($faker->dateTime());
            $member->setEmail($faker->email());
            $member->setPhoneNumber($faker->phoneNumber());
            $member->setPostalCode($faker->postcode());
            $member->setStreet($faker->country());
            $member->setCity($faker->city());
            $member->setProfession($faker->jobTitle());
            $member->setParentOneFirstname($faker->name());
            $member->setParentOneLastname($faker->name());
            $member->setParentOnePhoneNumber($faker->phoneNumber());
            $member->setParentOneEmail($faker->email());
            $member->setParentOneProfession($faker->jobTitle());
            $member->setParentTwoFirstname($faker->name());
            $member->setParentTwoLastname($faker->name());
            $member->setParentTwoPhoneNumber($faker->phoneNumber());
            $member->setParentTwoEmail($faker->email());
            $member->setParentTwoProfession($faker->jobTitle());
            $member->setIsEvacuationAllow($faker->boolean());
            $member->setIsTransportAllow($faker->boolean());
            $member->setIsImageAllow($faker->boolean());
            $member->setIsReturnHomeAllow($faker->boolean());
            $member->setIsNewsletterAllow($faker->boolean());
            $member->setIsAccepted(true);
            $member->setIsTransferNeeded(false);
            $member->setIsDocumentComplete(false);
            $member->setIsPayed(false);
            $member->setAmountPayed(null);
            $member->setAmountPayedOther(null);
            $member->setIsLicenseRenewal(true);
            $member->setPaymentNotes(null);
            $member->setIsCheckGestHand(false);
            $member->setIsInscriptionDone(false);
            $member->setGesthandIsPhoto(false);
            $member->setGesthandIsPhotoId(false);
            $member->setGesthandIsCertificate(false);
            $member->setGesthandCertificateDate(null);
            $member->setGesthandIsHealthQuestionnaire(false);
            $member->setGesthandIsFfhbAuthorization(false);
            $member->setGesthandQualificationDate(null);
            $member->setCreationDatetime(new \DateTime());
            $member->setNotes(null);
            // $member->setPaymentSolution(new ParamPaymentSolution);
            // $member->setTeams(new \Doctrine\Common\Collections\ArrayCollection([new Team]));
            // $member->setSeason(new ParamSeason);
            // $member->setPaypalInformation(new PaypalInformation);
            $manager->persist($member);
        }

        $manager->flush();
    }
}
