<?php

namespace App\Repository;

use App\Entity\ParamPriceTransfer;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method ParamPriceTransfer|null find($id, $lockMode = null, $lockVersion = null)
 * @method ParamPriceTransfer|null findOneBy(array $criteria, array $orderBy = null)
 * @method ParamPriceTransfer[]    findAll()
 * @method ParamPriceTransfer[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ParamPriceTransferRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ParamPriceTransfer::class);
    }

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
