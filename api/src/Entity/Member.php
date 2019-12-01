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
     * @Assert\NotBlank(message = "not_blank")
     * @ORM\Column(type="string", length=255)
     */
    private $firstname;

    /**
     * @Assert\NotBlank(message = "not_blank")
     * @ORM\Column(type="string", length=255)
     */
    private $lastname;

    /**
     * @Assert\NotBlank(message = "not_blank")
     * @Assert\Date(message = "invalid_date")
     * @ORM\Column(type="date")
     */
    private $birthdate;

    /**
     * @Assert\Email(
     *     message = "invalid_email",
     *     checkMX = true
     * )
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
     * @Assert\Email(
     *     message = "invalid_email",
     *     checkMX = true
     * )
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
     * @Assert\Email(
     *     message = "invalid_email",
     *     checkMX = true
     * )
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
    private $is_evacuation_allow = false;

    /**
     * @ORM\Column(type="boolean", options={"default":"0"})
     */
    private $is_transport_allow = false;

    /**
     * @ORM\Column(type="boolean", options={"default":"0"})
     */
    private $is_image_allow = false;

    /**
     * @ORM\Column(type="boolean", options={"default":"0"})
     */
    private $is_return_home_allow = false;

    /**
     * @ORM\Column(type="boolean", options={"default":"0"})
     */
    private $is_newsletter_allow = false;

    /**
     * @Assert\IsTrue(message="invalid_must_be_true")
     * @ORM\Column(type="boolean", options={"default":"0"})
     */
    private $is_accepted = false;

    /**
     * @ORM\Column(type="boolean", options={"default":"0"})
     */
    private $is_reduced_price = false;
    
    /**
     * @ORM\Column(type="boolean", options={"default":"0"})
     */
    private $is_transfer_needed = false;

    /**
     * @ORM\Column(type="boolean", options={"default":"0"})
     */
    private $is_payed = false;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $price;

    /**
     * @ORM\Column(type="datetime", options={"default"="CURRENT_TIMESTAMP"})
     */
    private $creation_datetime;

    /**
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(name="id_user", referencedColumnName="id")
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity="Team")
     * @ORM\JoinColumn(name="id_team", referencedColumnName="id")
     */
    private $team;

    public function __construct(){
        $this->setCreationDatetime(new \DateTime('now', new \DateTimeZone('Europe/Paris')));
    }

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

    public function getIsReducedPrice(): ?bool
    {
        return $this->is_reduced_price;
    }

    public function setIsReducedPrice(bool $is_reduced_price): self
    {
        $this->is_reduced_price = $is_reduced_price;

        return $this;
    }    

    public function getIsTransferNeeded(): ?bool
    {
        return $this->is_transfer_needed;
    }

    public function setIsTransferNeeded(bool $is_transfer_needed): self
    {
        $this->is_transfer_needed = $is_transfer_needed;

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
    
    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(int $price): self
    {
        $this->price = $price;

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
    
    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getTeam(): ?Team
    {
        return $this->team;
    }

    public function setTeam(Team $team): self
    {
        $this->team = $team;

        return $this;
    }
}
