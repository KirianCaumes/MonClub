<?php

namespace App\Repository;

use App\Entity\Param\ParamPriceTransfer;
use App\Entity\Param\ParamSeason;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * Repository for Param Price Transfer
 * @method findOneByAgeInterval    findOneByYearInterval(int $age, ParamSeason $currentSeason)
 */
class ParamPriceTransferRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ParamPriceTransfer::class);
    }

    /**
     * Find ParamPriceTransfer by age
     */
    public function findOneByAgeInterval(int $age, ParamSeason $currentSeason): ?ParamPriceTransfer
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.min_age <= :val')
            ->andWhere('m.max_age >= :val')
            ->andWhere('m.season = :currentSeason')
            ->setParameter('val', $age)
            ->setParameter('currentSeason', $currentSeason)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
