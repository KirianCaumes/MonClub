<?php

namespace App\Controller;

use App\Entity\ActivityHistory;
use App\Entity\ParamDocumentCategory;
use App\Entity\ParamGlobal;
use App\Entity\ParamPaymentSolution;
use App\Entity\ParamPriceLicense;
use App\Entity\ParamPriceTransfer;
use App\Entity\ParamReductionFamily;
use App\Entity\ParamSeason;
use App\Entity\ParamWorkflow;
use App\Entity\Team;
use App\Entity\User;
use App\Form\ActivityHistoricType;
use DateTime;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

/**
 * Param controller.
 * @Route("/api/param", name="api_")
 */
class ParamController extends FOSRestController
{
    /**
     * Lists all Param Global.
     * @Rest\Get("")
     *
     * @return Response
     */
    public function getParam()
    {
        //Create new historic entry
        $activityHistoric = new ActivityHistory();
        $form = $this->createForm(ActivityHistoricType::class, $activityHistoric);
        $form->submit(['date' => date('Y-m-d'), 'user' => $this->getUser()->getId()]);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($activityHistoric);
            $em->flush();
        }

        return $this->handleView($this->view([
            'teams' => $this->getDoctrine()->getRepository(Team::class)->findall(),
            'workflowStep' => $this->getDoctrine()->getRepository(ParamWorkflow::class)->findall(),
            'global' => $this->getDoctrine()->getRepository(ParamGlobal::class)->findall(),
            'documentCategory' => $this->getDoctrine()->getRepository(ParamDocumentCategory::class)->findall(),
            'roles' => ['ROLE_COACH', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'],
            'price' => [
                'license' => $this->getDoctrine()->getRepository(ParamPriceLicense::class)->findall(),
                'transfer' => $this->getDoctrine()->getRepository(ParamPriceTransfer::class)->findall(),
                'discount' => $this->getDoctrine()->getRepository(ParamReductionFamily::class)->findall(),
                'payment_solution' => $this->getDoctrine()->getRepository(ParamPaymentSolution::class)->findall(),
            ],
            'season' => $this->getDoctrine()->getRepository(ParamSeason::class)->findBy(['is_active' => true]),
            'users' => $this->isGranted('ROLE_ADMIN') ?
                array_map(
                    function ($user) {
                        return ['id' => $user->getId(), 'username' => $user->getUsername()];
                    },
                    $this->getDoctrine()->getRepository(User::class)->findBy([], ['username' => 'ASC'])
                )
                : []
        ]));
    }
}
