<?php

namespace App\Command;

use App\Entity\Member;
use App\Service\MailService;
use App\Service\ParamService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Generate mail to warn user to renew gesthand certificate
 */
class MailRenewCertificateCommand extends Command
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
        //php bin\console app:renew-certificate
        $this
            ->setName('app:renew-certificate')
            ->setDescription("Generate mail to warn user to renew gesthand certificate");
    }

    public function execute(InputInterface $input, OutputInterface $output)
    {
        if ((new \DateTime())->format('d-m') === $this->paramService->getParam('data_mail_renew_certif')) { //01-05
            $members = $this->em->getRepository(Member::class)->findBy(['season' => $this->paramService->getCurrentSeason()]);
            $usersToSend = [];

            foreach ($members as $member) {
                if (!in_array($member->getUser(), $usersToSend)) array_push($usersToSend, $member->getUser());
            }

            foreach ($usersToSend as $user) {
                $this->mailService->sendMailRenewCertificate($user);
            }

            $output->writeln(sizeof($usersToSend) . ' email(s) were sent.');
        } else {
            $output->writeln('Emails will be send on: ' . $this->paramService->getParam('data_mail_renew_certif'));
        }
    }
}
