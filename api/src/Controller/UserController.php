<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\UserBundle\Model\UserManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use App\Entity\User;
use App\Form\UserType;
use FOS\UserBundle\Mailer\Mailer;
use FOS\UserBundle\Mailer\MailerInterface;
use FOS\UserBundle\Util\TokenGenerator;
use Swift_Mailer;
use Symfony\Component\Security\Core\Encoder\BCryptPasswordEncoder;
use App\Service\MailService;

/**
 * User controller.
 * @Route("/api", name="api_")
 */
class UserController extends FOSRestController
{
    /**
     * Login User.
     * @Rest\Post("/login")
     *
     * @return Response
     */
    public function login(Request $request, UserManagerInterface $userManager, JWTTokenManagerInterface $JWTManager)
    {
        $data = json_decode($request->getContent(), true);
        $user = $userManager->findUserByUsername($data['username']);

        if (!$user) {
            return $this->handleView($this->view(['error' => 'Username doesnt exists'], Response::HTTP_UNAUTHORIZED));
        }

        if (!(new BCryptPasswordEncoder(4))->isPasswordValid($user->getPassword(), $data['plainPassword'], 4)) {
            return $this->handleView($this->view(["error" => 'Username and password doesn\'t match'], Response::HTTP_UNAUTHORIZED));
        }

        return $this->handleView($this->view(["token" => $JWTManager->create($user)], Response::HTTP_OK));
    }

    /**
     * Create User.
     * @Rest\Post("/register")
     *
     * @return Response
     */
    public function register(Request $request, UserManagerInterface $userManager, JWTTokenManagerInterface $JWTManager)
    {
        $data = json_decode($request->getContent(), true);
        $user = new User();
        $form = $this->createForm(UserType::class, $user);
        $form->submit($data);

        if ($form->isSubmitted() && $form->isValid()) {
            $user
                ->setEnabled(true)
                ->setRoles(['ROLE_SUPER_USER'])
                ->setSuperAdmin(false);
            $userManager->updateUser($user, true);

            return $this->handleView($this->view(["token" => $JWTManager->create($user)], Response::HTTP_CREATED));
        }
        return $this->handleView($this->view($form->getErrors(), Response::HTTP_BAD_REQUEST));
    }

    /**
     * Send an email to reset password.
     * @Rest\Post("/reset-mail")
     *
     * @return Response
     */
    public function resetMail(Request $request, UserManagerInterface $userManager, MailService $mailService)
    {
        $data = json_decode($request->getContent(), true);
        $user = $userManager->findUserByUsername($data['username']);

        if (!$user) {
            return $this->handleView($this->view(['error' => 'Username doesnt exists'], Response::HTTP_BAD_REQUEST));
        }

        if ($user->isPasswordRequestNonExpired(4)) {
            return $this->handleView($this->view(["error" => 'There is already a valid token request'], Response::HTTP_BAD_REQUEST));
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
    public function reset(Request $request, UserManagerInterface $userManager)
    {
        $data = json_decode($request->getContent(), true);
        $user = $userManager->findUserByConfirmationToken($data['resetToken']);

        if (!$user) {
            return $this->handleView($this->view(['error' => 'Invalid token'], Response::HTTP_BAD_REQUEST));
        }

        $user->setPlainPassword($data['plainPassword']);
        $userManager->updateUser($user, true);

        return $this->handleView($this->view([], Response::HTTP_OK));
    }
}
