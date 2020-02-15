<?php

namespace App\Repository;

use App\Entity\Param\ParamPriceLicense;
use App\Entity\Param\ParamSeason;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * Repository for Param Price License
 * @method ParamPriceLicense    findOneByYearInterval(int $year, ParamSeason $currentSeason)
 */
class ParamPriceLicenseRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ParamPriceLicense::class);
    }

    /**
     * Find PriceLicense by year interval
     */
    public function findOneByYearInterval(int $year, ParamSeason $currentSeason): ?ParamPriceLicense
    {
        return $this->createQueryBuilder('m')
            ->where('m.min_year <= :val')
            ->andWhere('m.max_year >= :val')
            ->andWhere('m.season = :currentSeason')
            ->setParameter('val', $year)
            ->setParameter('currentSeason', $currentSeason)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
