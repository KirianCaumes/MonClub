<?php

namespace App\Command;

use App\Entity\Member;
use App\Entity\User;
use App\Service\MailService;
use App\Service\ParamService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Generate mail to warn user to renew gesthand certificate
 */
class RenewGesthandCertificate extends Command
{
    private $em;
    private $paramService;
    private $mailService;

    public function __construct(EntityManagerInterface $entityManager, ParamService $paramService, MailService $mailService)
    {
        $this->em = $entityManager;
        $this->paramService = $paramService;
        $this->mailService = $mailService;

        parent::__construct();
    }


    protected function configure()
    {
        //php bin\console app:mail
        $this
            ->setName('app:renewCertificate')
            ->setDescription("Generate mail to warn user eto renew gesthand certificate");
    }

    public function execute(InputInterface $input, OutputInterface $output)
    {
        $members = $this->em->getRepository(Member::class)->findAll();
        $membersToSend = [];
        $datetime = new \DateTime();
        $datetimeString = $datetime->format('y-m-d');
       //$dateToday = \substr($datetimeString ,3, 5);
        $sendDate = '02-12';


        foreach ($members as $member) {
            if (!in_array($member, $membersToSend) && preg_match("^()\d\d([-/.])(02)\2(12)$^" ,$datetimeString)) array_push($membersToSend, $member);
        }

        foreach ($membersToSend as $member) {
            $gesthandCertifDate = $member->getGesthandCertificateDate();
            $this->mailService->sendWarningGesthandCertificat($member,$gesthandCertifDate);
        }

        $output->writeln(sizeof($membersToSend) . ' email(s) were sent.' .'date: '. $datetimeString .' compare: '.$sendDate );
    }
}
