<?php

namespace App\Repository;

use App\Entity\ActivityHistory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method ActivityHistory|null find($id, $lockMode = null, $lockVersion = null)
 * @method ActivityHistory|null findOneBy(array $criteria, array $orderBy = null)
 * @method ActivityHistory[]    findAll()
 * @method ActivityHistory[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ActivityHistoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ActivityHistory::class);
    }
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
