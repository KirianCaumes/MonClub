<?php

namespace App\Controller;

use App\Entity\Member;
use App\Entity\ParamGlobal;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\UserBundle\Model\UserManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use App\Entity\User;
use App\Form\UserType;
use FOS\UserBundle\Util\TokenGenerator;
use Symfony\Component\Security\Core\Encoder\BCryptPasswordEncoder;
use App\Service\MailService;
use App\Service\ParamService;
use Symfony\Component\Security\Core\Security;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * User controller.
 * @Route("/api", name="api_")
 */
class PublicController extends FOSRestController
{
    /**
     * Login User.
     * @Rest\Post("/login")
     *
     * @return Response
     */
    public function login(Request $request, UserManagerInterface $userManager, JWTTokenManagerInterface $JWTManager, TranslatorInterface $translator)
    {
        $data = json_decode($request->getContent(), true);
        $user = $userManager->findUserByUsername($data['username']);

        if (!$user) {
            return $this->handleView($this->view(['message' => $translator->trans('username_not_found')], Response::HTTP_UNAUTHORIZED));
        }

        if (!(new BCryptPasswordEncoder(4))->isPasswordValid($user->getPassword(), $data['plainPassword'], 4)) {
            return $this->handleView($this->view(["message" => $translator->trans('username_password_not_match')], Response::HTTP_UNAUTHORIZED));
        }

        return $this->handleView($this->view(["token" => $JWTManager->create($user)], Response::HTTP_OK));
    }

    /**
     * Create User.
     * @Rest\Post("/register")
     *
     * @return Response
     */
    public function register(Request $request, UserManagerInterface $userManager, JWTTokenManagerInterface $JWTManager, TranslatorInterface $translator, ParamService $ParamService)
    {
        //Disable register if needed
        if (!filter_var($ParamService->getParam('is_create_new_user_able'), FILTER_VALIDATE_BOOLEAN)) {
            return $this->handleView($this->view([
                'error' => [
                    'message' => $translator->trans('register_is_disabled'),
                    'code' => Response::HTTP_FORBIDDEN
                ]
            ], Response::HTTP_FORBIDDEN));
        }
        $data = json_decode($request->getContent(), true);
        $user = new User();
        $form = $this->createForm(UserType::class, $user);
        $form->submit($data);

        if ($form->isSubmitted() && $form->isValid()) {
            $user
                ->setEnabled(true)
                ->setRoles(['ROLE_USER']);
            $userManager->updateUser($user, true);

            return $this->handleView($this->view(["token" => $JWTManager->create($user)], Response::HTTP_CREATED));
        }
        return $this->handleView($this->view($form->getErrors(), Response::HTTP_BAD_REQUEST));
    }

    /**
     * Send an email to reset password.
     * @Rest\Post("/reset/mail")
     *
     * @return Response
     */
    public function resetMail(Request $request, UserManagerInterface $userManager, MailService $mailService, TranslatorInterface $translator)
    {
        $data = json_decode($request->getContent(), true);
        $user = $userManager->findUserByUsername($data['username']);

        if (!$user) {
            return $this->handleView($this->view(['message' => $translator->trans('username_not_found')], Response::HTTP_BAD_REQUEST));
        }

        if ($user->isPasswordRequestNonExpired(4)) {
            return $this->handleView($this->view(["message" => $translator->trans('reset_token_already_exists')], Response::HTTP_BAD_REQUEST));
        }

        if (!$user->getConfirmationToken()) {
            $user->setConfirmationToken((new TokenGenerator())->generateToken());
        }

        $mailService->sendReset($user);

        $user->setPasswordRequestedAt(new \DateTime());
        $userManager->updateUser($user, true);

        return $this->handleView($this->view([], Response::HTTP_OK));
    }

    /**
     * Reset password.
     * @Rest\Post("/reset")
     *
     * @return Response
     */
    public function reset(Request $request, UserManagerInterface $userManager, TranslatorInterface $translator)
    {
        $data = json_decode($request->getContent(), true);
        $user = $userManager->findUserByConfirmationToken($data['resetToken']);

        if (!$user) {
            return $this->handleView($this->view(['message' => $translator->trans('reset_token_invalid')], Response::HTTP_BAD_REQUEST));
        }

        $user->setPlainPassword($data['plainPassword']);
        $userManager->updateUser($user, true);

        return $this->handleView($this->view([], Response::HTTP_OK));
    }

    /**
     * Login User for Drive.
     * @Rest\Post("/login/drive")
     *
     * @return Response
     */
    public function loginDrive(Request $request, UserManagerInterface $userManager, JWTTokenManagerInterface $JWTManager, TranslatorInterface $translator)
    {
        $data = json_decode($request->getContent(), true);
        $user = $userManager->findUserByUsername($data['username']);

        if (!$user) {
            return $this->handleView($this->view(["abc" => $data], Response::HTTP_UNAUTHORIZED));
        }

        if (!(new BCryptPasswordEncoder(4))->isPasswordValid($user->getPassword(), $data['plainPassword'], 4)) {
            return $this->handleView($this->view(["def" => null], Response::HTTP_UNAUTHORIZED));
        }

        //Check if admin or super admin
        if (!in_array("ROLE_ADMIN", $user->getRoles()) && !in_array("ROLE_SUPER_ADMIN", $user->getRoles())) {
            return $this->handleView($this->view([], Response::HTTP_UNAUTHORIZED));
        }

        return $this->handleView($this->view([], Response::HTTP_OK));
    }

    /**
     * Post error from front
     * @Rest\Post("/log")
     *
     * @return Response
     */
    public function log(Request $request)
    {
        $data = json_decode($request->getContent(), true);

        if (!is_dir(__DIR__ . '/../../var/log/front/')) mkdir(__DIR__ . '/../../var/log/front/');

        file_put_contents(
            __DIR__ . '/../../var/log/front/' . $data['env'] . '-' . explode('T', $data['datetime'])[0] . '.log',
            '[' . $data['datetime'] . '] ' . $data['error'] . ' : ' . $data['info'] . PHP_EOL,
            FILE_APPEND | LOCK_EX
        );

        return $this->handleView($this->view('ok', Response::HTTP_OK));
    }
}
