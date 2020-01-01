<?php

namespace App\Controller;

use App\Entity\Member;
use App\Entity\ParamGlobal;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use App\Entity\User;
use App\Form\UserAdminType;
use App\Service\ParamGlobalService;
use Symfony\Component\Security\Core\Security;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * User controller.
 * @Route("/api/user", name="api_")
 */
class UserController extends FOSRestController
{
    /**
     * Get User.
     * @Rest\Get("/me")
     *
     * @return Response
     */
    public function getMe()
    {
        $user = $this->getUser();
        $user->setPassword('');
        $user->setSalt('');
        $user->setConfirmationToken('');
        return $this->handleView($this->view($user, Response::HTTP_OK));
    }

    /**
     * Get info for dashboard.
     * @Rest\Get("/infos")
     *
     * @return Response
     */
    public function getInfos(Security $security, ParamGlobalService $paramGlobalService)
    {
        return $this->handleView($this->view([
            'text' => $security->isGranted('ROLE_ADMIN') ? $paramGlobalService->getParam('text_infos_admin') : $paramGlobalService->getParam('text_infos_user'),
            'infos' => [
                'users' => $security->isGranted('ROLE_ADMIN') ? sizeof($this->getDoctrine()->getRepository(User::class)->findAll()) : null,
                'members' => $security->isGranted('ROLE_ADMIN') ?
                    sizeof($this->getDoctrine()->getRepository(Member::class)->findAll()) : sizeof($this->getDoctrine()->getRepository(Member::class)->findBy(['user' => $this->getUser()])),
                'membersOk' => $security->isGranted('ROLE_ADMIN') ?
                    sizeof($this->getDoctrine()->getRepository(Member::class)->findBy(['is_inscription_done' => true])) : sizeof($this->getDoctrine()->getRepository(Member::class)->findBy(['user' => $this->getUser(), 'is_inscription_done' => true])),
                'membersPending' => $security->isGranted('ROLE_ADMIN') ?
                    sizeof($this->getDoctrine()->getRepository(Member::class)->findBy(['is_inscription_done' => false])) : sizeof($this->getDoctrine()->getRepository(Member::class)->findBy(['user' => $this->getUser(), 'is_inscription_done' => false])),
            ]
        ], Response::HTTP_OK));
    }

    
    /**
     * Lists all users.
     * @IsGranted("ROLE_SUPER_ADMIN")
     * @Rest\Get("")
     *
     * @return Response
     */
    public function getUsers()
    {
        $users = $this->getDoctrine()->getRepository(User::class)->findBy([], ['username' => 'ASC']);
        foreach ($users as $user) { //Hide some informations
            $user->setPassword('');
            $user->setSalt('');
            $user->setConfirmationToken('');
        }
        return $this->handleView($this->view($users));
    }
    
    /**
     * Get one user.
     * @IsGranted("ROLE_SUPER_ADMIN")
     * @Rest\Get("/{id}")
     *
     * @return Response
     */
    public function getOneUser(TranslatorInterface $translator, int $id)
    {
        //Find user by id
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $id]);
        if (!$user) {
            return $this->handleView($this->view(["message" => $translator->trans('user_not_found')]));
        }

        $user->setPassword('');
        $user->setSalt('');
        $user->setConfirmationToken('');

        return $this->handleView($this->view($user));
    }

    /**
     * Edit User.
     * @IsGranted("ROLE_SUPER_ADMIN")
     * @Rest\Put("/{id}")
     *
     * @return Response
     */
    public function putUser(Request $request, TranslatorInterface $translator, int $id)
    {
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $id]);
        if (!$user) {
            return $this->handleView($this->view(["message" => $translator->trans('user_not_found')], Response::HTTP_NOT_FOUND));
        }
        
        $data = json_decode($request->getContent(), true);
        $form = $this->createForm(UserAdminType::class, $user);
        
        $form->submit($data);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $user->setRoles($data['roles']);
            $em->persist($user);
            $em->flush();
            return $this->handleView($this->view($user, Response::HTTP_OK));
        }
        return $this->handleView($this->view($form->getErrors(), Response::HTTP_BAD_REQUEST));
    }
    
}
