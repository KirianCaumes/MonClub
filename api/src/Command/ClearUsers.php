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
 * Generate mail to warn user enable account
 */
class ClearUsers extends Command
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
            ->setName('app:userWarning')
            ->setDescription("Generate mail to warn user enable account");
    }

    public function execute(InputInterface $input, OutputInterface $output)
    {
        //$members = $this->em->getRepository(Member::class)->findMembersOngoing($this->paramService->getCurrentSeason());
        $users = $this->em->getRepository(User::class)->findAll($this->paramService->getCurrentSeason());
        $usersToSend = [];

        foreach ($users as $user) {
            switch ($user->getCreationDatetime()->diff(new \DateTime())->format('%a')) {
                case 90:
                    if (!in_array($user, $usersToSend)) array_push($usersToSend, $user);
                    break;
                case 105:
                    $user ->setEnabled('false');
                    break;
                default:
                    break;
            }
        }

        foreach ($usersToSend as $user) {
            $inactivityDate = $user->getCreationDatetime()->diff(new \DateTime())->format('%a');
            $this->mailService->sendMemberReminder($user,$inactivityDate);

        }

        $output->writeln(sizeof($usersToSend) . ' email(s) were sent.');
    }
}
