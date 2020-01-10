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
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;

/**
 * Team controller.
 * @SWG\Parameter(name="Authorization", in="header", required=true, type="string", default="Bearer ", description="Bearer token")
 * @SWG\Tag(name="Team")
 * @Route("/api/team", name="api_")
 */
class TeamController extends FOSRestController
{
    /**
     * Lists all Teams.
     * @SWG\Response(response=200, description="Returns Teams", @SWG\Schema(type="array", @Model(type=Team::class)))
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
     * @SWG\Response(response=200, description="Returns new Team", @SWG\Schema(@Model(type=Team::class)))
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
     * @SWG\Response(response=200, description="Returns Team", @SWG\Schema(@Model(type=Team::class)))
     * @SWG\Response(response=404, description="Team not found")
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
     * @SWG\Parameter(name="team",in="body", description="New team", format="application/json", @SWG\Schema(@Model(type=Team::class)))
     * @SWG\Response(response=201, description="Returns team created", @SWG\Schema(@Model(type=Team::class)))
     * @SWG\Response(response=400, description="Error in data")
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
     * @SWG\Parameter(name="team",in="body", description="New team", format="application/json", @SWG\Schema(@Model(type=Team::class)))
     * @SWG\Response(response=200, description="Returns team", @SWG\Schema(@Model(type=Team::class)))
     * @SWG\Response(response=400, description="Error in data")
     * @SWG\Response(response=404, description="Team not found")
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
     * @SWG\Response(response=200, description="Team deleted")
     * @SWG\Response(response=404, description="Team not found")
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
