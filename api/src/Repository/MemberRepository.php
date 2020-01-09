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
    public function findMembersByFields($name, $stepsId, $teamsId, $seasonId)
    {
        $query = $this->createQueryBuilder('m');
        if ($teamsId) $query->join('m.teams', 'c');
        if ($seasonId) $query->join('m.season', 'd');
        $query->where('m.firstname LIKE :name OR m.lastname LIKE :name');
        if ($teamsId) $query->andWhere('c.id IN(:teamsId)');
        if ($seasonId) $query->andWhere('d.id = :seasonId');

        if ($stepsId) {
            $search = '';
            if (strpos($stepsId, '5') !== false) $search .= ' OR (m.is_inscription_done = TRUE AND m.is_check_gest_hand = TRUE AND m.is_payed = TRUE AND m.is_document_complete = TRUE)';
            if (strpos($stepsId, '4') !== false) $search .= ' OR (m.is_inscription_done = FALSE AND m.is_check_gest_hand = TRUE AND m.is_payed = TRUE AND m.is_document_complete = TRUE)';
            if (strpos($stepsId, '3') !== false) $search .= ' OR (m.is_inscription_done = FALSE AND m.is_check_gest_hand = FALSE AND m.is_payed = TRUE AND m.is_document_complete = TRUE)';
            if (strpos($stepsId, '2') !== false) $search .= ' OR (m.is_inscription_done = FALSE AND m.is_check_gest_hand = FALSE AND m.is_payed = FALSE AND m.is_document_complete = TRUE)';
            if (strpos($stepsId, '1') !== false) $search .= ' OR (m.is_inscription_done = FALSE AND m.is_check_gest_hand = FALSE AND m.is_payed = FALSE AND m.is_document_complete = FALSE)';
            $query->andWhere(substr($search, 4));
        }

        $query->setParameter('name', '%' . $name . '%');
        if ($teamsId) $query->setParameter('teamsId', $teamsId);
        if ($seasonId) $query->setParameter('seasonId', $seasonId);
        $query->orderBy('m.lastname', 'ASC');

        return $query->getQuery()->getResult();
    }

    /**
     * @return Member[] Returns an array of Member objects
     */
    public function findMembersOngoing($currentSeason)
    {
        return $this->createQueryBuilder('m')
            ->where('m.season = :currentSeason')
            ->andWhere('m.is_payed = false OR m.is_document_complete = false')
            ->setParameter('currentSeason', $currentSeason)
            ->getQuery()
            ->getResult();
    }

    /**
     * @return Member[] Returns an array of Member objects
     */
    public function findByTeamsAndSeason($teams, $currentSeason)
    {
        return $this->createQueryBuilder('m')
            ->join('m.teams', 'c')
            ->where('c.id IN(:teamId)')
            ->andWhere('m.season = :currentSeason')
            ->orderBy('m.lastname', 'ASC')
            ->setParameter('teamId', (function () use ($teams) {
                $teamsId = [];
                foreach ($teams as $team) {
                    array_push($teamsId, $team->getId());
                }
                return implode(',', $teamsId);
            })())
            ->setParameter('currentSeason', $currentSeason)
            ->getQuery()
            ->getResult();
    }
}
