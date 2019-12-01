<?php

namespace App\Entity;

use FOS\UserBundle\Model\User as BaseUser;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="mc_user")
 * @UniqueEntity(fields={"username"}, message="already_exist")
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
     *     message = "not_blank",
     * )
     * @Assert\Email(
     *     message = "invalid_email",
     *     checkMX = true
     * )
     */
    protected $username;

    /**
     * @Assert\NotBlank(
     *     message = "not_blank",
     * )
     * 
     */
    protected $plainPassword;

    /**
     * @ORM\Column(type="datetime", options={"default"="CURRENT_TIMESTAMP"})
     */
    private $creation_datetime;

    /**
     * Many Users have Many Teams.
     * @ORM\ManyToMany(targetEntity="Team", inversedBy="users")
     * @ORM\JoinTable(name="mc_users_teams")
     */
    protected $teams;

    public function __construct()
    {
        parent::__construct();
        $this->teams = new \Doctrine\Common\Collections\ArrayCollection();
        $this->setCreationDatetime(new \DateTime('now', new \DateTimeZone('Europe/Paris')));
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

    public function getTeams(): \Doctrine\Common\Collections\ArrayCollection
    {
        return $this->teams;
    }

    public function setTeams(\Doctrine\Common\Collections\ArrayCollection $teams): self
    {
        $this->teams = $teams;

        return $this;
    }

    public function getCreationDatetime(): ?\DateTimeInterface
    {
        return $this->creation_datetime;
    }

    public function setCreationDatetime(\DateTimeInterface $creation_datetime): self
    {
        $this->creation_datetime = $creation_datetime;

        return $this;
    }
}
