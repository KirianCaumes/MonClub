<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\UserBundle\Model\UserManagerInterface;
use Symfony\Component\Validator\Validation;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Validator\Constraints as Assert;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use App\Entity\User;

/**
 * Movie controller.
 * @Route("/api", name="api_")
 */
class UserController extends FOSRestController
{
    /**
     * Create User.
     * @Rest\Post("/register")
     *
     * @return Response
     */
    public function register(Request $request, UserManagerInterface $userManager, JWTTokenManagerInterface $JWTManager)
    {
        $data = json_decode($request->getContent(), true);
        $validator = Validation::createValidator();
        $constraint = new Assert\Collection(array(
            // 'username' => new Assert\Length(array('min' => 1)),
            'password' => new Assert\Length(array('min' => 1)),
            'email' => new Assert\Email(),
        ));
        $violations = $validator->validate($data, $constraint);
        if ($violations->count() > 0) {
            return $this->handleView($this->view(["error" => (string) $violations], Response::HTTP_INTERNAL_SERVER_ERROR));
        }
        // $username = $data['username'];
        $password = $data['password'];
        $email = $data['email'];
        $user = new User();
        $user
            // ->setUsername($email)
            ->setPlainPassword($password)
            ->setEmail($email)
            ->setEnabled(true)
            ->setRoles(['ROLE_USER'])
            ->setSuperAdmin(false);
        try {
            $userManager->updateUser($user, true);
        } catch (\Exception $e) {
            return $this->handleView($this->view(["error" => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR));
        }

        return $this->handleView(
            $this->view(
                [
                    "token" => $JWTManager->create($user)
                ],
                Response::HTTP_CREATED
            )
        );
    }
}
