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
use App\Form\User\UserNewPasswordType;
use App\Form\User\UserType;
use FOS\UserBundle\Util\TokenGenerator;
use Symfony\Component\Security\Core\Encoder\BCryptPasswordEncoder;
use App\Service\MailService;
use App\Service\ParamService;
use Symfony\Contracts\Translation\TranslatorInterface;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;

/**
 * User controller.
 * @SWG\Tag(name="Public")
 * @Route("/api", name="api_")
 */
class PublicController extends FOSRestController
{
    /**
     * Login User.
     * @SWG\Parameter(name="user",in="body", description="Log User", format="application/json", @SWG\Schema(
     *      type="object",
     *      @SWG\Property(property="username", type="string"),
     *      @SWG\Property(property="plainPassword", type="string"),
     * )))
     * @SWG\Response(response=200, description="User is logged", @SWG\Schema(
     *      type="object",
     *      @SWG\Property(property="token", type="string")
     * ))
     * @SWG\Response(response=401, description="Wrong password")
     * @SWG\Response(response=404, description="User not found")
     * @Rest\Post("/login")
     *
     * @return Response
     */
    public function login(Request $request, UserManagerInterface $userManager, JWTTokenManagerInterface $JWTManager, TranslatorInterface $translator)
    {
        $data = json_decode($request->getContent(), true);
        $user = $userManager->findUserByUsername($data['username']);

        if (!$user) {
            return $this->handleView($this->view(['message' => $translator->trans('username_not_found')], Response::HTTP_NOT_FOUND));
        }

        if (!(new BCryptPasswordEncoder(4))->isPasswordValid($user->getPassword(), $data['plainPassword'], 4)) {
            return $this->handleView($this->view(["message" => $translator->trans('username_password_not_match')], Response::HTTP_UNAUTHORIZED));
        }

        return $this->handleView($this->view(["token" => $JWTManager->create($user)], Response::HTTP_OK));
    }

    /**
     * Create User.
     * @SWG\Parameter(name="user",in="body", description="Register User", format="application/json", @SWG\Schema(
     *      type="object",
     *      @SWG\Property(property="username", type="string"),
     *      @SWG\Property(property="plainPassword", type="object", 
     *          @SWG\Property(property="first", type="string"),
     *          @SWG\Property(property="second", type="string"),
     *      )),
     * )))
     * @SWG\Response(response=201, description="User is registered", @SWG\Schema(
     *      type="object",
     *      @SWG\Property(property="token", type="string")
     * ))
     * @SWG\Response(response=400, description="Error in data")
     * @SWG\Response(response=403, description="Feature disabled")
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
     * @SWG\Parameter(name="user", in="body", description="Reset password by sending email with token", format="application/json", @SWG\Schema(
     *      type="object",
     *      @SWG\Property(property="username", type="string")
     * )))
     * @SWG\Response(response=200, description="Login user")
     * @SWG\Response(response=400, description="User not found")
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
     * @SWG\Parameter(name="member", in="body", description="Reset password by reset token", format="application/json", @SWG\Schema(
     *      type="object",
     *      @SWG\Property(property="resetToken", type="string")
     * )))
     * @SWG\Response(response=200, description="User's password changed")
     * @SWG\Response(response=400, description="User not found")
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

        if (!$user->isPasswordRequestNonExpired(intval($_ENV['JWT_TOKENTTL']))) {
            return $this->handleView($this->view(["message" => $translator->trans('reset_token_expired')], Response::HTTP_BAD_REQUEST));
        }

        $data = json_decode($request->getContent(), true);
        $form = $this->createForm(UserNewPasswordType::class, $user);
        $form->submit($data);

        if ($form->isSubmitted() && $form->isValid()) {
            $user->setConfirmationToken(null);
            $user->setPasswordRequestedAt(null);
            $userManager->updateUser($user, true);
            return $this->handleView($this->view([], Response::HTTP_CREATED));
        }
        return $this->handleView($this->view($form->getErrors(), Response::HTTP_BAD_REQUEST));
    }

    /**
     * Login User for Drive.
     * @SWG\Parameter(name="user",in="body", description="Log User for drive", format="application/json", @SWG\Schema(
     *      type="object",
     *      @SWG\Property(property="username", type="string"),
     *      @SWG\Property(property="plainPassword", type="string"),
     * )))
     * @SWG\Response(response=200, description="User is logged")
     * @SWG\Response(response=401, description="Wrong password")
     * @SWG\Response(response=404, description="User not found")
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
     * @SWG\Parameter(name="error",in="body", description="Append error in log", format="application/json", @SWG\Schema(
     *      type="object",
     *      @SWG\Property(property="env", type="string"),
     *      @SWG\Property(property="datetime", type="string"),
     *      @SWG\Property(property="error", type="string"),
     *      @SWG\Property(property="info", type="string"),
     * )))
     * @SWG\Response(response=200, description="Log added")
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
