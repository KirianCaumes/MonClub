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
            ->orderBy('a.date', 'desc')
            ->setMaxResults(30)
            ->getQuery()
            ->getResult();
    }

    /**
     * Delete entity older than 30 days
     */
    public function deleteOld()
    {
        $date = date('Y-m-d', strtotime('today - 30 days'));
        var_dump("cc");

        return $this->createQueryBuilder("a")
            ->delete(ActivityHistory::class, 'b')
            ->where("b.date < :date")
            ->setParameter('date', $date)
            ->getQuery()
            ->getResult();
    }
}
