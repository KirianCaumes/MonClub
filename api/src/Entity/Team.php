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
     * @ORM\ManyToMany(targetEntity="Member", mappedBy="teams")
     */
    private $members;

    public function __construct()
    {
        $this->members = new \Doctrine\Common\Collections\ArrayCollection();
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

    public function getMembers(): \Doctrine\Common\Collections\Collection
    {
        return $this->members;
    }

    public function setMembers(\Doctrine\Common\Collections\Collection $members): self
    {
        $this->members = $members;

        return $this;
    }
}
