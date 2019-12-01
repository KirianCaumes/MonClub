<?php

namespace App\Controller;

use App\Entity\Param\ParamGlobal;
use App\Entity\ParamPriceLicense;
use App\Entity\ParamPriceTransfer;
use App\Entity\ParamReductionFamily;
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
     * @Rest\Get("/")
     *
     * @return Response
     */
    public function getParam()
    {
        return $this->handleView($this->view([
            'global' => $this->getDoctrine()->getRepository(ParamGlobal::class)->findall(),
            'price' => [
                'license' => $this->getDoctrine()->getRepository(ParamPriceLicense::class)->findall(),
                'transfer' => $this->getDoctrine()->getRepository(ParamPriceTransfer::class)->findall(),
                'discount' => $this->getDoctrine()->getRepository(ParamReductionFamily::class)->findall(),
            ]
        ]));
    }
}
