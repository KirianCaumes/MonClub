<?php

namespace App\Entity;

use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="team")
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
     * @Assert\NotBlank(message = "not_blank")
     * @ORM\Column(type="string", length=255)
     */
    private $label;

    /**
     * @Assert\NotBlank(message = "not_blank")
     * @ORM\Column(type="string", length=255)
     */
    private $label_google_contact;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $max_number_members;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $member_years;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $referent_parent;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $coaches;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $trainers;

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

    public function setLabel(?string $label): self
    {
        $this->label = $label;

        return $this;
    }

    public function getLabelGoogleContact(): ?string
    {
        return $this->label_google_contact;
    }

    public function setLabelGoogleContact(?string $label_google_contact): self
    {
        $this->label_google_contact = $label_google_contact;

        return $this;
    }

    public function getMaxNumberMembers(): ?int
    {
        return $this->max_number_members;
    }

    public function setMaxNumberMembers(?int $max_number_members): self
    {
        $this->max_number_members = $max_number_members;

        return $this;
    }

    public function getMemberYears(): ?string
    {
        return $this->member_years;
    }

    public function setMemberYears(?string $member_years): self
    {
        $this->member_years = $member_years;

        return $this;
    }

    public function getReferentParent(): ?string
    {
        return $this->referent_parent;
    }

    public function setReferentParent(?string $referent_parent): self
    {
        $this->referent_parent = $referent_parent;

        return $this;
    }

    public function getCoaches(): ?string
    {
        return $this->coaches;
    }

    public function setCoaches(?string $coaches): self
    {
        $this->coaches = $coaches;

        return $this;
    }

    public function getTrainers(): ?string
    {
        return $this->trainers;
    }

    public function setTrainers(?string $trainers): self
    {
        $this->trainers = $trainers;

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
