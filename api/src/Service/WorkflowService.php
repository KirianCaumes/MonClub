<?php

namespace App\Service;

use App\Entity\Member;
use App\Entity\ParamWorkflow;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Service to return worflow for a member
 */
class WorkflowService
{
    private $em;
    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * Calcul price for a given member
     */
    public function getWorkflow(Member $member)
    {
        $workflow = $this->em->getRepository(ParamWorkflow::class)->findAll();
        if (!$workflow) return [];

        return [
            [
                'label' => $workflow[0]->getLabel(),
                'description' => $workflow[0]->getDescription(),
                'isCompleted' => true,
                'isActive' => !$member->getIsDocumentComplete(),
                'isError' => false
            ],
            [
                'label' => $workflow[1]->getLabel(),
                'description' => $workflow[1]->getDescription(),
                'isCompleted' => $member->getIsDocumentComplete(),
                'isActive' => !$member->getIsPayed() && !(!$member->getIsPayed() && $member->getIsCheckGestHand()),
                'isError' => !$member->getIsDocumentComplete() && $member->getIsPayed()
            ],
            [
                'label' => $workflow[2]->getLabel(),
                'description' => $workflow[2]->getDescription(),
                'isCompleted' => $member->getIsPayed(),
                'isActive' => $member->getIsDocumentComplete() && !$member->getIsCheckGestHand() && !(!$member->getIsCheckGestHand() && $member->getIsInscriptionDone()),
                'isError' => !$member->getIsPayed() && $member->getIsCheckGestHand()
            ],
            [
                'label' => $workflow[3]->getLabel(),
                'description' => $workflow[3]->getDescription(),
                'isCompleted' => $member->getIsCheckGestHand(),
                'isActive' => $member->getIsPayed() && !$member->getIsInscriptionDone(),
                'isError' => !$member->getIsCheckGestHand() && $member->getIsInscriptionDone()
            ],
            [
                'label' => $workflow[4]->getLabel(),
                'description' => $workflow[4]->getDescription(),
                'isCompleted' => $member->getIsInscriptionDone() && !($member->getIsCheckGestHand() && !$member->getIsInscriptionDone()),
                'isActive' => $member->getIsCheckGestHand() && !$member->getIsInscriptionDone(),
                'isError' => false
            ]
        ];
    }
}
