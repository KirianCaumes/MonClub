<?php

namespace App\Repository;

use App\Entity\ParamPriceTransfer;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * Repository for Param Price Transfer
 * @method findOneByAgeInterval    findOneByYearInterval(int $age)
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
    public function findOneByAgeInterval($age): ?ParamPriceTransfer
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.min_age <= :val')
            ->andWhere('m.max_age >= :val')
            ->setParameter('val', $age)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
