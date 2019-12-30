<?php

namespace App\Repository;

use App\Entity\ParamPriceLicense;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method ParamPriceLicense|null find($id, $lockMode = null, $lockVersion = null)
 * @method ParamPriceLicense|null findOneBy(array $criteria, array $orderBy = null)
 * @method ParamPriceLicense[]    findAll()
 * @method ParamPriceLicense[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ParamPriceLicenseRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ParamPriceLicense::class);
    }

    public function findOneByYearInterval($year): ?ParamPriceLicense
    {
        return $this->createQueryBuilder('m')
            ->where('m.min_year <= :val')
            ->andWhere('m.max_year >= :val')
            ->setParameter('val', $year)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
