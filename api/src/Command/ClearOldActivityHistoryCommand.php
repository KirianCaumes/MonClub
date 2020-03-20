<?php

namespace App\Command;

use App\Entity\ActivityHistory;
use App\Entity\Member;
use App\Entity\User;
use App\Service\MailService;
use App\Service\ParamService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Delete ActivityHistory older than 30 days
 */
class ClearOldActivityHistoryCommand extends Command
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
        //php bin\console app:clear-activity-history
        $this
            ->setName('app:clear-activity-history')
            ->setDescription("Delete ActivityHistory older than 30 days");
    }

    public function execute(InputInterface $input, OutputInterface $output)
    {
        $this->em->getRepository(ActivityHistory::class)->deleteOld();

        $output->writeln('ActivityHistory clear');
    }
}
