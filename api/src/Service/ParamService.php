<?php

namespace App\Service;

use App\Entity\ParamGlobal;
use App\Entity\ParamSeason;
use Doctrine\ORM\EntityManagerInterface;

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
    public function getCurrentSeason():ParamSeason
    {
        return $this->em->getRepository(ParamSeason::class)->findOneBy(['is_current' => true]);
    }
}
