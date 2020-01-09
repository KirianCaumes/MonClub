<?php

namespace App\Entity;

use FOS\UserBundle\Model\User as BaseUser;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;
use Rollerworks\Component\PasswordStrength\Validator\Constraints as RollerworksPassword;

/**
 * @ORM\Entity
 * @ORM\Table(name="user")
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
     * @Assert\NotBlank(message = "not_blank")
     * @Assert\Email(message = "invalid_email")
     */
    protected $username;

    /**
     * @RollerworksPassword\Blacklist(message="password_blacklisted")
     * @RollerworksPassword\PasswordStrength(minLength=10, minStrength=4)
     */
    protected $plainPassword;

    /**
     * @ORM\Column(type="datetime", options={"default"="CURRENT_TIMESTAMP"})
     */
    private $creation_datetime;

    /**
     * Many Users have Many Teams.
     * @ORM\ManyToMany(targetEntity="Team")
     * @ORM\JoinTable(
     *      name="users_teams",
     *      joinColumns={@ORM\JoinColumn(name="user_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="team_id", referencedColumnName="id")}
     * )
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

    public function getTeams(): \Doctrine\Common\Collections\Collection
    {
        return $this->teams;
    }

    public function setTeams(\Doctrine\Common\Collections\Collection $teams): self
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
