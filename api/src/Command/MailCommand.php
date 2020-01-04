<?php

namespace App\Command;

use App\Entity\Member;
use App\Service\MailService;
use App\Service\ParamService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class MailCommand extends Command
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
            ->setName('app:mail')
            ->setDescription("Generate mail to remind member who have action to do");
    }

    public function execute(InputInterface $input, OutputInterface $output)
    {
        $members = $this->em->getRepository(Member::class)->findMembersOngoing($this->paramService->getCurrentSeason());
        $usersToSend = [];
        foreach ($members as $member) {
            if (!in_array($member->getUser(), $usersToSend)) array_push($usersToSend, $member->getUser());
            // switch ($member->getCreationDatetime()->diff(new \DateTime())->format('%a')) {
            //     case 15:
            //         if (!in_array($member->getUser(), $usersToSend)) array_push($usersToSend, $member->getUser());
            //         break;
            //     case 45:
            //         if (!in_array($member->getUser(), $usersToSend)) array_push($usersToSend, $member->getUser());
            //         break;
            //     default:
            //         break;
            // }
        }
        foreach ($usersToSend as $user) {
            $this->mailService->sendMemberReminder($user);
        }
        $output->writeln(sizeof($usersToSend) . ' email(s) were sent.');
    }
}
