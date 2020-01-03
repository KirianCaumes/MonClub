<?php

namespace App\Controller;

use App\Entity\ActivityHistory;
use App\Entity\Member;
use App\Entity\ParamGlobal;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use App\Entity\User;
use App\Form\UserAdminType;
use App\Service\ParamService;
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
    public function getInfos(Security $security, ParamService $paramService)
    {
        $dateRes = [];
        if ($security->isGranted('ROLE_ADMIN')) {
            //Generate 30 last days
            $datesIntval = [];
            for ($i = 0; $i < 30; $i++) array_push($datesIntval, date('Y-m-d', strtotime('today - ' . $i . ' days')));
            $datesIntval = array_reverse($datesIntval);
    
            $datesDb = $this->getDoctrine()->getRepository(ActivityHistory::class)->findCountByDate(); //Get dates historic from db
            //Bind res from db to each days
            foreach ($datesIntval as $date) {
                $index = array_search(new \DateTime($date), array_column($datesDb, 'date'));
                array_push($dateRes, [
                    'date' => $date,
                    'sum' => $index !== false ? intval($datesDb[$index]['sum']) : 0
                ]);
            }
        }

        return $this->handleView($this->view([
            'text' => $security->isGranted('ROLE_ADMIN') ? $paramService->getParam('text_infos_admin') : $paramService->getParam('text_infos_user'),
            'activity_historic' => $dateRes,
            'infos' => [
                'users' => $security->isGranted('ROLE_ADMIN') ? sizeof($this->getDoctrine()->getRepository(User::class)->findAll()) : null,
                'members' => $security->isGranted('ROLE_ADMIN') ?
                    sizeof($this->getDoctrine()->getRepository(Member::class)->findBy(['season' => $paramService->getCurrentSeason()])) :
                    sizeof($this->getDoctrine()->getRepository(Member::class)->findBy(['user' => $this->getUser(), 'season' => $paramService->getCurrentSeason()])),
                'membersOk' => $security->isGranted('ROLE_ADMIN') ?
                    sizeof($this->getDoctrine()->getRepository(Member::class)->findBy(['is_inscription_done' => true, 'season' => $paramService->getCurrentSeason()])) :
                    sizeof($this->getDoctrine()->getRepository(Member::class)->findBy(['user' => $this->getUser(), 'is_inscription_done' => true, 'season' => $paramService->getCurrentSeason()])),
                'membersPending' => $security->isGranted('ROLE_ADMIN') ?
                    sizeof($this->getDoctrine()->getRepository(Member::class)->findBy(['is_inscription_done' => false, 'season' => $paramService->getCurrentSeason()])) :
                    sizeof($this->getDoctrine()->getRepository(Member::class)->findBy(['user' => $this->getUser(), 'is_inscription_done' => false, 'season' => $paramService->getCurrentSeason()])),
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
