<?php

namespace App\Controller;

use App\Entity\Team;
use App\Form\TeamType;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Translation\TranslatorInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

/**
 * Param controller.
 * @Route("/api/team", name="api_")
 */
class TeamController extends FOSRestController
{
    /**
     * Lists all Teams.
     * @IsGranted("ROLE_ADMIN")
     * @Rest\Get("")
     *
     * @return Response
     */
    public function getTeams()
    {
        return $this->handleView($this->view($this->getDoctrine()->getRepository(Team::class)->findBy([], ['label' => 'ASC'])));
    }

    /**
     * Get one empty Team.
     * @IsGranted("ROLE_ADMIN")
     * @Rest\Get("/new")
     *
     * @return Response
     */
    public function getNewTeam()
    {
        return $this->handleView($this->view(new Team()));
    }

    /**
     * Get one Team.
     * @IsGranted("ROLE_ADMIN")
     * @Rest\Get("/{id}")
     *
     * @return Response
     */
    public function getOneTeam(int $id, TranslatorInterface $translator)
    {
        $team = $this->getDoctrine()->getRepository(Team::class)->findOneBy(['id' => $id]);
        if (!$team) {
            return $this->handleView($this->view(["message" => $translator->trans('team_not_found')], Response::HTTP_NOT_FOUND));
        }
        return $this->handleView($this->view($team, Response::HTTP_OK));
    }

    /**
     * Create Team.
     * @IsGranted("ROLE_ADMIN")
     * @Rest\Post("")
     *
     * @return Response
     */
    public function postTeam(Request $request, TranslatorInterface $translator)
    {
        $team = new Team();
        $data = json_decode($request->getContent(), true);
        $form = $this->createForm(TeamType::class, $team);
        $form->submit($data);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($team);
            $em->flush();
            return $this->handleView($this->view($team, Response::HTTP_CREATED));
        }
        return $this->handleView($this->view($form->getErrors(), Response::HTTP_BAD_REQUEST));
    }

    /**
     * Edit Team.
     * @IsGranted("ROLE_ADMIN")
     * @Rest\Put("/{id}")
     *
     * @return Response
     */
    public function putTeam(Request $request, TranslatorInterface $translator, int $id)
    {
        $team = $this->getDoctrine()->getRepository(Team::class)->findOneBy(['id' => $id]);
        if (!$team) {
            return $this->handleView($this->view(["message" => $translator->trans('team_not_found')], Response::HTTP_NOT_FOUND));
        }
        
        $data = json_decode($request->getContent(), true);
        $form = $this->createForm(TeamType::class, $team);
        $form->submit($data);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($team);
            $em->flush();
            return $this->handleView($this->view($team, Response::HTTP_OK));
        }
        return $this->handleView($this->view($form->getErrors(), Response::HTTP_BAD_REQUEST));
    }
    

    /**
     * Delete Team.
     * @IsGranted("ROLE_ADMIN")
     * @Rest\Delete("/{id}")
     *
     * @return Response
     */
    public function deleteTeam(Request $request, TranslatorInterface $translator, int $id)
    {
        $team = $this->getDoctrine()->getRepository(Team::class)->findOneBy(['id' => $id]);
        if (!$team) {
            return $this->handleView($this->view(["message" => $translator->trans('team_not_found')], Response::HTTP_NOT_FOUND));
        }
        
        $em = $this->getDoctrine()->getManager();
        $em->remove($team);
        $em->flush();
        return $this->handleView($this->view([], Response::HTTP_OK));
    }
}
