<?php

namespace App\Controller;

use App\Entity\ParamDocumentCategory;
use App\Entity\ParamGlobal;
use App\Entity\ParamPriceLicense;
use App\Entity\ParamPriceTransfer;
use App\Entity\ParamReductionFamily;
use App\Entity\ParamWorkflow;
use App\Entity\Team;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

/**
 * Param controller.
 * @Route("/api/team", name="api_")
 */
class TeamController extends FOSRestController
{
    /**
     * Lists all Teams.
     * @Rest\Get("")
     *
     * @return Response
     */
    public function getTeams()
    {
        return $this->handleView($this->view($this->getDoctrine()->getRepository(Team::class)->findall()));
    }

    /**
     * Get one Team.
     * @Rest\Get("/{id}")
     *
     * @return Response
     */
    public function getOneTeam(int $id)
    {
        return $this->handleView($this->view($this->getDoctrine()->getRepository(Team::class)->findBy(['id' => $id])));
    }
}
