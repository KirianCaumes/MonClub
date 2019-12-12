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
    public function findMembersByFields($name, $stepsId, $teamsId)
    {
        $query = $this->createQueryBuilder('m')
            ->where('m.firstname LIKE :name OR m.lastname LIKE :name')
            ->andWhere('m.team IN(:teamsId) OR :teamsId = \'\''); //To prevent if teamsId is an empty string

        if ($stepsId) {
            $search = '';
            if (strpos($stepsId, '5') !== false) $search .= ' OR (m.is_inscription_done = TRUE AND m.is_check_gest_hand = TRUE AND m.is_payed = TRUE AND m.is_document_complete = TRUE)';
            if (strpos($stepsId, '4') !== false) $search .= ' OR (m.is_inscription_done = FALSE AND m.is_check_gest_hand = TRUE AND m.is_payed = TRUE AND m.is_document_complete = TRUE)';
            if (strpos($stepsId, '3') !== false) $search .= ' OR (m.is_inscription_done = FALSE AND m.is_check_gest_hand = FALSE AND m.is_payed = TRUE AND m.is_document_complete = TRUE)';
            if (strpos($stepsId, '2') !== false) $search .= ' OR (m.is_inscription_done = FALSE AND m.is_check_gest_hand = FALSE AND m.is_payed = FALSE AND m.is_document_complete = TRUE)';
            if (strpos($stepsId, '1') !== false) $search .= ' OR (m.is_inscription_done = FALSE AND m.is_check_gest_hand = FALSE AND m.is_payed = FALSE AND m.is_document_complete = FALSE)';
            $query->andWhere(substr($search, 4));
        }

        $query
            ->setParameter('name', '%' . $name . '%')
            ->setParameter('teamsId', $teamsId);

        return $query->getQuery()->getResult();
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
