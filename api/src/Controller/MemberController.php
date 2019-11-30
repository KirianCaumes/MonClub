<?php

namespace App\Controller;

use App\Entity\Member;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use App\Entity\Movie;
use App\Form\MovieType;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * Member controller.
 * @Route("/api/member", name="api_")
 */
class MemberController extends FOSRestController
{
    /**
     * Lists all member.
     * @Rest\Get("/")
     *
     * @return Response
     */
    public function getMembers()
    {
        return $this->handleView($this->view($this->getDoctrine()->getRepository(Member::class)->findall()));
    }

    /**
     * Lists all member.
     * @Rest\Get("/me")
     *
     * @return Response
     */
    public function getMyMembers()
    {
        return $this->handleView($this->view($this->getDoctrine()->getRepository(Member::class)->findBy(['user' => $this->getUser()])));
    }

    /**
     * One member.
     * @Rest\Get("/{id}")
     *
     * @return Response
     */
    public function getOneMember(TranslatorInterface $translator, int $id)
    {
        $member = $this->getDoctrine()->getRepository(Member::class)->findOneBy(['id' => $id]);
        if (!$member) return $this->handleView($this->view(["message" => $translator->trans('member_not_found')], Response::HTTP_NOT_FOUND));
        return $this->handleView($this->view($member));
    }

    /**
     * Create Movie.
     * @Rest\Post("/movie")
     *
     * @return Response
     */
    public function postMovieAction(Request $request)
    {
        $movie = new Movie();
        $form = $this->createForm(MovieType::class, $movie);
        $data = json_decode($request->getContent(), true);
        $form->submit($data);
        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($movie);
            $em->flush();
            return $this->handleView($this->view(['status' => 'ok'], Response::HTTP_CREATED));
        }
        return $this->handleView($this->view($form->getErrors(), Response::HTTP_BAD_REQUEST));
    }
}
