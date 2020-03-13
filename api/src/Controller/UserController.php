<?php

namespace App\Controller;

use App\Constants;
use App\Entity\ActivityHistory;
use App\Entity\Member;
use App\Entity\Param\ParamGlobal;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\Controller\Annotations as Rest;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\User;
use App\Form\User\UserAdminNewType;
use App\Form\User\UserAdminType;
use App\Service\MailService;
use App\Service\ParamService;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\UserBundle\Util\TokenGenerator;
use Symfony\Component\Security\Core\Security;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Translation\TranslatorInterface;
use Swagger\Annotations as SWG;
use FOS\RestBundle\Controller\Annotations\QueryParam;
use Nelmio\ApiDocBundle\Annotation\Model;

/**
 * User controller.
 * @SWG\Parameter(name="Authorization", in="header", required=true, type="string", default="Bearer ", description="Bearer token")
 * @SWG\Tag(name="User")
 * @Route("/api/user", name="api_")
 */
class UserController extends AbstractFOSRestController
{
    /**
     * Get User.
     * @SWG\Response(response=200, description="Returns current User", @SWG\Schema(@Model(type=User::class)))
     * @Rest\Get("/me")
     *
     * @return Response
     */
    public function getMe()
    {
        return $this->handleView($this->view($this->getUser(), Response::HTTP_OK));
    }

    /**
     * Get info for dashboard.
     * @SWG\Response(response=200, description="Returns infos for dashboard", @SWG\Schema(@Model(type="object")))
     * @Rest\Get("/infos")
     *
     * @return Response
     */
    public function getInfos(Security $security, ParamService $paramService)
    {
        $dateRes = [];
        if ($security->isGranted(Constants::ROLE_ADMIN)) {
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

        $currentSeason = $paramService->getCurrentSeason();

        return $this->handleView($this->view([
            'text' => $security->isGranted(Constants::ROLE_ADMIN) ? $paramService->getParam('text_infos_admin') : $paramService->getParam('text_infos_user'),
            'activity_historic' => $dateRes,
            'infos' => [
                'users' => $security->isGranted(Constants::ROLE_ADMIN) ? sizeof($this->getDoctrine()->getRepository(User::class)->findAll()) : null,
                'members' => $security->isGranted(Constants::ROLE_ADMIN) ?
                    sizeof($this->getDoctrine()->getRepository(Member::class)->findBy(['season' => $currentSeason])) :
                    sizeof($this->getDoctrine()->getRepository(Member::class)->findBy(['user' => $this->getUser(), 'season' => $currentSeason])),
                'membersOk' => $security->isGranted(Constants::ROLE_ADMIN) ?
                    sizeof($this->getDoctrine()->getRepository(Member::class)->findBy(['is_inscription_done' => true, 'season' => $currentSeason])) :
                    sizeof($this->getDoctrine()->getRepository(Member::class)->findBy(['user' => $this->getUser(), 'is_inscription_done' => true, 'season' => $currentSeason])),
                'membersPending' => $security->isGranted(Constants::ROLE_ADMIN) ?
                    sizeof($this->getDoctrine()->getRepository(Member::class)->findBy(['is_inscription_done' => false, 'season' => $currentSeason])) :
                    sizeof($this->getDoctrine()->getRepository(Member::class)->findBy(['user' => $this->getUser(), 'is_inscription_done' => false, 'season' => $currentSeason])),
            ],
            'members' => $this->getDoctrine()->getRepository(Member::class)->findBy(['user' => $this->getUser(), 'season' => $currentSeason])
        ], Response::HTTP_OK));
    }


    /**
     * Lists all users.
     * @QueryParam(name="name", nullable=true, description="String of username to filter")
     * @QueryParam(name="isEnabled", nullable=true, description="Is User enabled")
     * @QueryParam(name="roles", nullable=true, description="Roles to filter (ex: 'ROLE_ADMIN,ROLE_SUPER_ADMIN')")
     * @SWG\Response(response=200, description="Returns Users", @SWG\Schema(type="array", @Model(type=User::class)))
     * @IsGranted("ROLE_ADMIN")
     * @Rest\Get("")
     *
     * @return Response
     */
    public function getUsers(ParamFetcher $paramFetcher)
    {
        $users = $this->getDoctrine()->getRepository(User::class)->findBy([], ['username' => 'ASC']);

        $name = $paramFetcher->get('name');
        $isEnabled = filter_var($paramFetcher->get('isEnabled'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        $roles = explode(",", $paramFetcher->get('roles'));

        $usersFinal = [];

        foreach ($users as $key => $user) {
            if (
                ($name === '' || $name === null || strpos($user->getUserName(), $name) !== false) && //If username match
                ($paramFetcher->get('isEnabled') === '' || $paramFetcher->get('isEnabled') === null || $isEnabled === null || $user->isEnabled() === $isEnabled) && //If enabled match
                (!array_filter($roles) || count(array_intersect($roles, $user->getRoles())) == count($roles)) //If roles match
            ) {
                array_push($usersFinal, $user);
            }
        }

        return $this->handleView($this->view($usersFinal));
    }

    /**
     * Get one empty User.
     * @SWG\Response(response=200, description="Returns new User", @SWG\Schema(@Model(type=User::class)))
     * @IsGranted("ROLE_ADMIN")
     * @Rest\Get("/new")
     *
     * @return Response
     */
    public function getNewUser()
    {
        $user = new User();
        $user->setEnabled(true);
        return $this->handleView($this->view(['user' => $user, 'members' => []]));
    }

    /**
     * Get one user.
     * @SWG\Response(response=200, description="Returns User", @SWG\Schema(@Model(type=User::class)))
     * @SWG\Response(response=404, description="User not found")
     * @IsGranted("ROLE_ADMIN")
     * @Rest\Get("/{id}")
     *
     * @return Response
     */
    public function getOneUser(TranslatorInterface $translator, int $id)
    {
        //Find user by id
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $id]);
        if (!$user) {
            return $this->handleView($this->view(["message" => $translator->trans('user_not_found')], Response::HTTP_NOT_FOUND));
        }

        $members = $this->getDoctrine()->getRepository(Member::class)->findBy(['user' => $user]);

        return $this->handleView($this->view(['user' => $user, 'members' => $members]));
    }

    /**
     * Create User.
     * @SWG\Parameter(name="user",in="body", description="New user", format="application/json", @SWG\Schema(@Model(type=User::class)))
     * @SWG\Response(response=200, description="Returns User", @SWG\Schema(@Model(type=User::class)))
     * @SWG\Response(response=400, description="Error in data")
     * @IsGranted("ROLE_ADMIN")
     * @Rest\Post("")
     *
     * @return Response
     */
    public function postUser(Request $request, MailService $mailService)
    {
        $user = new User();
        $user->setPlainPassword(substr(str_shuffle("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-=+?"), 0, 10) . '=+?'); //Temp random password

        $data = json_decode($request->getContent(), true);

        $form = $this->createForm(UserAdminNewType::class, $user);

        $form->submit($data);

        if ($form->isSubmitted() && $form->isValid()) {
            $user->setRoles($data['roles']);
            $user->setConfirmationToken((new TokenGenerator())->generateToken());
            $user->setPasswordRequestedAt(new \DateTime());
            $mailService->sendUserCreatedByAdmin($user);

            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();
            return $this->handleView($this->view($user, Response::HTTP_OK));
        }
        return $this->handleView($this->view($form->getErrors(), Response::HTTP_BAD_REQUEST));
    }

    /**
     * Edit User.
     * @SWG\Parameter(name="user",in="body", description="New user", format="application/json", @SWG\Schema(@Model(type=User::class)))
     * @SWG\Response(response=200, description="Returns User", @SWG\Schema(@Model(type=User::class)))
     * @SWG\Response(response=400, description="Error in data")
     * @SWG\Response(response=404, description="User not found")
     * @IsGranted("ROLE_ADMIN")
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
