<?php

namespace App\Repository;

use App\Entity\Member;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method Member|null find($id, $lockMode = null, $lockVersion = null)
 * @method Member|null findOneBy(array $criteria, array $orderBy = null)
 * @method Member[]    findAll()
 * @method Member[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MemberRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Member::class);
    }

    /**
     * @return Member[] Returns an array of Member objects
     */
    public function findMembersByFields($name, $stepId, $teamsId)
    {
        return $this->createQueryBuilder('m')
            ->where('m.firstname LIKE :name')
            ->orWhere('m.lastname LIKE :name')
            ->andWhere('m.team IN(:teamsId)')
            ->orWhere(':teamsId = \'\'') //To prevent if teamsId is an empty string
            ->setParameter('name', '%' . $name . '%')
            ->setParameter('teamsId', $teamsId)
            ->getQuery()
            ->getResult();
    }

    /**
     * @return Member[] Returns an array of Member objects
     */
    // public function findMembersByFields($name, $stepId, $teamsId)
    // {
    //     $query = $this->getEntityManager()->getConnection()->prepare('
    //         SELECT * 
    //         FROM mc_member
    //         WHERE 
    //             (firstname LIKE :name OR lastname LIKE :name) AND 
    //             id_team IN (:teamsId)
    //     ');
    //      $query->execute(['name'=> '%' . $name . '%', 'teamsId'=> $teamsId]);

    //      return $query->fetchAll();
    // }
}
