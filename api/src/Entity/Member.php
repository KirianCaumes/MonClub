<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\MemberRepository")
 * @ORM\Table(name="mc_member")
 */
class Member
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
    private $firstname;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $lastname;

    /**
     * @ORM\Column(type="date")
     */
    private $birthdate;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $phone_number;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $profession;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $parent_one_firstname;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $parent_one_lastname;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $parent_one_email;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $parent_one_phone_number;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $parent_one_profession;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $parent_two_firstname;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $parent_two_lastname;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $parent_two_email;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $parent_two_phone_number;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $parent_two_profession;

    /**
     * @ORM\Column(type="boolean", options={"default":"0"})
     */
    private $is_evacuation_allow;

    /**
     * @ORM\Column(type="boolean", options={"default":"0"})
     */
    private $is_transport_allow;

    /**
     * @ORM\Column(type="boolean", options={"default":"0"})
     */
    private $is_image_allow;

    /**
     * @ORM\Column(type="boolean", options={"default":"0"})
     */
    private $is_return_home_allow;

    /**
     * @ORM\Column(type="boolean", options={"default":"0"})
     */
    private $is_newsletter_allow;

    /**
     * @ORM\Column(type="boolean", options={"default":"0"})
     */
    private $is_accepted;

    /**
     * @ORM\Column(type="boolean", options={"default":"0"})
     */
    private $is_payed;

    /**
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(name="id_user", referencedColumnName="id")
     */
    private $user;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getBirthdate(): ?\DateTimeInterface
    {
        return $this->birthdate;
    }

    public function setBirthdate(\DateTimeInterface $birthdate): self
    {
        $this->birthdate = $birthdate;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getPhoneNumber(): ?string
    {
        return $this->phone_number;
    }

    public function setPhoneNumber(?string $phone_number): self
    {
        $this->phone_number = $phone_number;

        return $this;
    }

    public function getProfession(): ?string
    {
        return $this->profession;
    }

    public function setProfession(?string $profession): self
    {
        $this->profession = $profession;

        return $this;
    }

    public function getParentOneFirstname(): ?string
    {
        return $this->parent_one_firstname;
    }

    public function setParentOneFirstname(string $parent_one_firstname): self
    {
        $this->parent_one_firstname = $parent_one_firstname;

        return $this;
    }

    public function getParentOneLastname(): ?string
    {
        return $this->parent_one_lastname;
    }

    public function setParentOneLastname(string $parent_one_lastname): self
    {
        $this->parent_one_lastname = $parent_one_lastname;

        return $this;
    }

    public function getParentOnePhoneNumber(): ?string
    {
        return $this->parent_one_phone_number;
    }

    public function setParentOnePhoneNumber(string $parent_one_phone_number): self
    {
        $this->parent_one_phone_number = $parent_one_phone_number;

        return $this;
    }

    public function getParentOneEmail(): ?string
    {
        return $this->parent_one_email;
    }

    public function setParentOneEmail(string $parent_one_email): self
    {
        $this->parent_one_email = $parent_one_email;

        return $this;
    }

    public function getParentOneProfession(): ?string
    {
        return $this->parent_one_profession;
    }

    public function setParentOneProfession(string $parent_one_profession): self
    {
        $this->parent_one_profession = $parent_one_profession;

        return $this;
    }

    public function getParentTwoFirstname(): ?string
    {
        return $this->parent_two_firstname;
    }

    public function setParentTwoFirstname(?string $parent_two_firstname): self
    {
        $this->parent_two_firstname = $parent_two_firstname;

        return $this;
    }

    public function getParentTwoLastname(): ?string
    {
        return $this->parent_two_lastname;
    }

    public function setParentTwoLastname(string $parent_two_lastname): self
    {
        $this->parent_two_lastname = $parent_two_lastname;

        return $this;
    }

    public function getParentTwoPhoneNumber(): ?string
    {
        return $this->parent_two_phone_number;
    }

    public function setParentTwoPhoneNumber(?string $parent_two_phone_number): self
    {
        $this->parent_two_phone_number = $parent_two_phone_number;

        return $this;
    }

    public function getParentTwoEmail(): ?string
    {
        return $this->parent_two_email;
    }

    public function setParentTwoEmail(?string $parent_two_email): self
    {
        $this->parent_two_email = $parent_two_email;

        return $this;
    }

    public function getParentTwoProfession(): ?string
    {
        return $this->parent_two_profession;
    }

    public function setParentTwoProfession(?string $parent_two_profession): self
    {
        $this->parent_two_profession = $parent_two_profession;

        return $this;
    }

    public function getIsEvacuationAllow(): ?bool
    {
        return $this->is_evacuation_allow;
    }

    public function setIsEvacuationAllow(bool $is_evacuation_allow): self
    {
        $this->is_evacuation_allow = $is_evacuation_allow;

        return $this;
    }

    public function getIsTransportAllow(): ?bool
    {
        return $this->is_transport_allow;
    }

    public function setAllowTransportAllow(bool $is_transport_allow): self
    {
        $this->is_transport_allow = $is_transport_allow;

        return $this;
    }

    public function getIsImageAllow(): ?bool
    {
        return $this->is_image_allow;
    }

    public function setIsImageAllow(bool $is_image_allow): self
    {
        $this->is_image_allow = $is_image_allow;

        return $this;
    }

    public function getIsReturnHomeAllow(): ?bool
    {
        return $this->is_return_home_allow;
    }

    public function setIsReturnHomeAllow(bool $is_return_home_allow): self
    {
        $this->is_return_home_allow = $is_return_home_allow;

        return $this;
    }

    public function getIsNewsLetterAllow(): ?bool
    {
        return $this->is_newsletter_allow;
    }

    public function setIsNewsletterAllow(bool $is_newsletter_allow): self
    {
        $this->is_newsletter_allow = $is_newsletter_allow;

        return $this;
    }

    public function getIsAccepted(): ?bool
    {
        return $this->is_accepted;
    }

    public function setIsAccepted(bool $is_accepted): self
    {
        $this->is_accepted = $is_accepted;

        return $this;
    }

    public function getIsPayed(): ?bool
    {
        return $this->is_payed;
    }

    public function setIsPayed(?bool $is_payed): self
    {
        $this->is_payed = $is_payed;

        return $this;
    }
    
    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
