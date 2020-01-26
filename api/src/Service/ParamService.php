<?php

namespace App\Service;

use App\Entity\Param\ParamGlobal;
use App\Entity\Param\ParamSeason;
use Doctrine\ORM\EntityManagerInterface;
use Pet;

/**
 * Service to manipulate param
 */
class ParamService
{
    private $em;
    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * Get param global value
     */
    public function getParam(string $str)
    {
        $res = $this->em->getRepository(ParamGlobal::class)->findOneBy(['label' => $str]);
        if ($res) return $res->getValue();
        return null;
    }

    /**
     * Get current season
     */
    public function getCurrentSeason(): ParamSeason
    {
        return $this->em->getRepository(ParamSeason::class)->findOneBy(['is_current' => true]);
    }

    /**
     * Get previous season
     */
    public function getPreviousSeason(): ParamSeason
    {
        $season = $this->em->getRepository(ParamSeason::class)->findOneBy(['is_current' => true]);
        if ($season && $season->getId() > 1) return $this->em->getRepository(ParamSeason::class)->findOneBy(['id' => $season->getId() - 1]);
        return new ParamSeason();
    }
}
