<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TeamRepository")
 * @ORM\Table(name="mc_team")
 */
class Team
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $label;

    /**
     * Many Teams have Many Users.
     * @ORM\ManyToMany(targetEntity="User", mappedBy="teams")
     */
    protected $users;

    public function __construct()
    {
        $this->teams = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabal(string $label): self
    {
        $this->label = $label;

        return $this;
    }
    public function getUsers(): \Doctrine\Common\Collections\ArrayCollection
    {
        return $this->users;
    }

    public function setUsers(\Doctrine\Common\Collections\ArrayCollection $users): self
    {
        $this->users = $users;

        return $this;
    }
}
