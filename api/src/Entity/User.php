<?php

namespace App\Entity;

use FOS\UserBundle\Model\User as BaseUser;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="mc_user")
 * @UniqueEntity(fields={"username"})
 */
class User extends BaseUser
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;    

    /**
     * @Assert\NotBlank(
     *     message = "Email invalide.",
     * )
     * @Assert\Email(
     *     message = "Email invalide.",
     *     checkMX = true
     * )
     */
    protected $username;
    
    /**
     * @Assert\NotBlank(
     *     message = "Mot de passe invalide.",
     * )
     * 
     */
    protected $plainPassword;

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Overridden so that email is now optional
     *
     * @param string $email
     * @return User
     */
    public function setUsername($username)
    {
        $this->username = $username;
        $this->email = $username;

        return $this;
    }
}
