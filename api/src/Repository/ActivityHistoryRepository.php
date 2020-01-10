<?php

namespace App\Repository;

use App\Entity\ActivityHistory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * Repository for Activity History
 * @method []    findCountByDate()
 */
class ActivityHistoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ActivityHistory::class);
    }

    /**
     * Get number connexion from each days
     */
    public function findCountByDate()
    {
        return $this->createQueryBuilder("a")
            ->select("a.date, count(1) as sum")
            ->groupBy("a.date")
            ->orderBy('a.date', 'asc')
            ->setMaxResults(30)
            ->getQuery()
            ->getResult();
    }
}
