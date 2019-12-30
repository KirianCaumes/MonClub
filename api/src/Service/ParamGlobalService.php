<?php

namespace App\Service;

use App\Entity\ParamGlobal;
use Doctrine\ORM\EntityManagerInterface;

class ParamGlobalService
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
}
