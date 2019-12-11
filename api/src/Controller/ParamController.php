<?php

namespace App\Controller;

use App\Entity\ParamDocumentCategory;
use App\Entity\ParamGlobal;
use App\Entity\ParamPriceLicense;
use App\Entity\ParamPriceTransfer;
use App\Entity\ParamReductionFamily;
use App\Entity\Team;
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
        return $this->handleView($this->view([
            'teams' => $this->getDoctrine()->getRepository(Team::class)->findall(),
            'step' => [['id' => 1, 'label' => 'Créé'], ['id' => 2, 'label' => 'Docments complets'], ['id' => 3, 'label' => 'Payé'], ['id' => 4, 'label' => 'Gest\'hand'], ['id' => 5, 'label' => 'Inscris']],
            'global' => $this->getDoctrine()->getRepository(ParamGlobal::class)->findall(),
            'documentCategory' => $this->getDoctrine()->getRepository(ParamDocumentCategory::class)->findall(),
            'price' => [
                'license' => $this->getDoctrine()->getRepository(ParamPriceLicense::class)->findall(),
                'transfer' => $this->getDoctrine()->getRepository(ParamPriceTransfer::class)->findall(),
                'discount' => $this->getDoctrine()->getRepository(ParamReductionFamily::class)->findall(),
            ]
        ]));
    }
}
