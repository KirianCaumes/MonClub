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
                'isActive' => false,
                'isError' => false,
                'message' => $workflow[0]->getMessage(),
            ],
            [
                'label' => $workflow[1]->getLabel(),
                'description' => $workflow[1]->getDescription(),
                'isCompleted' => $member->getIsDocumentComplete(),
                'isActive' => (!$member->getIsDocumentComplete() && !$member->getIsPayed() && !$member->getIsCheckGestHand() && !$member->getIsInscriptionDone()) || (!$member->getIsDocumentComplete() && $member->getIsPayed()),
                'isError' => !$member->getIsDocumentComplete() && $member->getIsPayed(),
                'message' => $workflow[1]->getMessage(),
            ],
            [
                'label' => $workflow[2]->getLabel(),
                'description' => $workflow[2]->getDescription(),
                'isCompleted' => $member->getIsPayed(),
                'isActive' => ($member->getIsDocumentComplete() && !$member->getIsPayed() && !$member->getIsCheckGestHand() && !$member->getIsInscriptionDone()) || (!$member->getIsPayed() && $member->getIsCheckGestHand()),
                'isError' => !$member->getIsPayed() && $member->getIsCheckGestHand(),
                'message' => $workflow[2]->getMessage(),
            ],
            [
                'label' => $workflow[3]->getLabel(),
                'description' => $workflow[3]->getDescription(),
                'isCompleted' => $member->getIsCheckGestHand(),
                'isActive' => ($member->getIsDocumentComplete() && $member->getIsPayed() && !$member->getIsCheckGestHand() && !$member->getIsInscriptionDone()) || (!$member->getIsCheckGestHand() && $member->getIsInscriptionDone()),
                'isError' => !$member->getIsCheckGestHand() && $member->getIsInscriptionDone(),
                'message' => $workflow[3]->getMessage(),
            ],
            [
                'label' => $workflow[4]->getLabel(),
                'description' => $workflow[4]->getDescription(),
                'isCompleted' => $member->getIsInscriptionDone() && !($member->getIsCheckGestHand() && !$member->getIsInscriptionDone()),
                'isActive' => $member->getIsDocumentComplete() && $member->getIsPayed() && $member->getIsCheckGestHand() && !$member->getIsInscriptionDone(),
                'isError' => false,
                'message' => $workflow[4]->getMessage(),
            ]
        ];
    }
}
