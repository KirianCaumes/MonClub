<?php

namespace App\Entity;

use App\Entity\Param\ParamPaymentSolution;
use App\Entity\Param\ParamSeason;
use App\Entity\Param\ParamSex;
use Doctrine\ORM\Mapping as ORM;
use App\Validator\Constraints as MyAssert;
use Symfony\Component\Validator\Constraints as Assert;
use JMS\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass="App\Repository\MemberRepository")
 * @ORM\Table(name="member")
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
     * @Assert\LessThan("now")
     * @MyAssert\Birthdate
     * @ORM\Column(type="date")
     */
    private $birthdate;

    /**
     * @Assert\Email(message = "invalid_email")
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $email;

    /** 
     * @Assert\Length(min = 0, max = 10, minMessage = "invalid_phone", maxMessage = "invalid_phone")
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $phone_number;

    /**
     * @Assert\NotBlank(message = "not_blank")
     * @Assert\Regex(pattern="/^(?:[0-8]\d|9[0-8])\d{3}$/", match=true, message="invalid_postal")
     * @ORM\Column(type="string", length=255)
     */
    private $postal_code;

    /**
     * @Assert\NotBlank(message = "not_blank")
     * @ORM\Column(type="string", length=255)
     */
    private $street;

    /**
     * @Assert\NotBlank(message = "not_blank")
     * @ORM\Column(type="string", length=255)
     */
    private $city;

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
     * @Assert\Email(message = "invalid_email")
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $parent_one_email;

    /**
     * @Assert\Length(min = 0, max = 10, minMessage = "invalid_phone", maxMessage = "invalid_phone")
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
     * @Assert\Email(message = "invalid_email")
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $parent_two_email;

    /**
     * @Assert\Length(min = 0, max = 10, minMessage = "invalid_phone", maxMessage = "invalid_phone")
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
    private $is_non_competitive = false;

    /**
     * @ORM\Column(type="boolean", options={"default":"0"})
     */
    private $is_transfer_needed = false;

    /**
     * @ORM\Column(type="boolean", options={"default":"0"})
     */
    private $is_document_complete = false;

    /**
     * @ORM\Column(type="boolean", options={"default":"0"})
     */
    private $is_payed = false;

    /**
     * @ORM\Column(type="decimal", precision=5, scale=2, nullable=true)
     */
    private $amount_payed;

    /**
     * @Assert\LessThan(propertyPath="amount_payed")
     * @Assert\GreaterThanOrEqual(0)
     * @ORM\Column(type="integer", precision=5, scale=2, nullable=true)
     */
    private $amount_payed_other;

    /**
     * @ORM\Column(type="boolean")
     */
    private $is_license_renewal = false;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"Admin"})
     */
    private $payment_notes;

    /**
     * @ORM\Column(type="boolean", options={"default":"0"})
     */
    private $is_check_gest_hand = false;

    /**
     * @ORM\Column(type="boolean", options={"default":"0"})
     */
    private $is_inscription_done = false;

    /**
     * @Groups({"Admin"})
     * @ORM\Column(type="boolean")
     */
    private $gesthand_is_photo = false;

    /**
     * @Groups({"Admin"})
     * @ORM\Column(type="boolean")
     */
    private $gesthand_is_photo_id = false;

    /**
     * @Groups({"Admin"})
     * @ORM\Column(type="boolean")
     */
    private $gesthand_is_certificate = false;

    /**
     * @Groups({"Admin"})
     * @Assert\Date(message = "invalid_date")
     * @Assert\GreaterThanOrEqual("01-01-1900")
     * @Assert\LessThan("now")
     * @ORM\Column(type="date", nullable=true)
     */
    private $gesthand_certificate_date;

    /**
     * @Groups({"Admin"})
     * @ORM\Column(type="boolean")
     */
    private $gesthand_is_health_questionnaire = false;

    /**
     * @Groups({"Admin"})
     * @ORM\Column(type="boolean")
     */
    private $gesthand_is_ffhb_authorization = false;

    /**
     * @Groups({"Admin"})
     * @Assert\Date(message = "invalid_date")
     * @Assert\GreaterThanOrEqual("01-01-1900")
     * @Assert\LessThan("now")
     * @ORM\Column(type="date", nullable=true)
     */
    private $gesthand_qualification_date;

    /**
     * @Groups({"Admin"})
     * @ORM\Column(type="datetime", options={"default"="CURRENT_TIMESTAMP"})
     */
    private $creation_datetime;

    /**
     * @Groups({"Admin"})
     * @ORM\Column(type="text", nullable=true)
     */
    private $notes;

    /**
     * @Assert\NotBlank(message = "not_blank")
     * @ORM\ManyToOne(targetEntity="App\Entity\Param\ParamSex")
     * @ORM\JoinColumn(name="id_sex", referencedColumnName="id")
     */
    private $sex;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Param\ParamPaymentSolution")
     * @ORM\JoinColumn(name="id_payment_solution", referencedColumnName="id")
     */
    private $payment_solution;

    /**
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(name="id_user", referencedColumnName="id", onDelete="CASCADE", nullable=true)
     */
    private $user;

    /** 
     * @ORM\ManyToMany(targetEntity="Team", inversedBy="members")
     * @ORM\JoinTable(
     *  name="member_teams",
     *  joinColumns={
     *      @ORM\JoinColumn(name="member_id", referencedColumnName="id")
     *  },
     *  inverseJoinColumns={
     *      @ORM\JoinColumn(name="team_id", referencedColumnName="id")
     *  }
     * )
     */
    private $teams;

    /**
     * @ORM\OneToMany(targetEntity="Document", mappedBy="member")
     */
    private $documents;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Param\ParamSeason")
     * @ORM\JoinColumn(name="id_season", referencedColumnName="id")
     */
    private $season;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\PaypalInformation")
     * @ORM\JoinColumn(name="id_paypal_information", referencedColumnName="id")
     */
    private $paypal_information;

    public function __construct()
    {
        // $this->setCreationDatetime(new \DateTime('now', new \DateTimeZone('Europe/Paris')));
        $this->documents = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function __clone()
    {
        if ($this->id) {
            $this->id = null;
            $this->setIsAccepted(false);
            $this->setIsTransferNeeded(false);
            $this->setIsDocumentComplete(false);
            $this->setIsPayed(false);
            $this->setAmountPayed(null);
            $this->setAmountPayedOther(null);
            $this->setIsLicenseRenewal(true);
            $this->setPaymentNotes(null);
            $this->setIsCheckGestHand(false);
            $this->setIsInscriptionDone(false);
            $this->setGesthandIsPhoto(false);
            $this->setGesthandIsPhotoId(false);
            $this->setGesthandIsCertificate(false);
            $this->setGesthandCertificateDate(null);
            $this->setGesthandIsHealthQuestionnaire(false);
            $this->setGesthandIsFfhbAuthorization(false);
            $this->setGesthandQualificationDate(null);
            $this->setCreationDatetime(new \DateTime());
            $this->setNotes(null);
            $this->setPaymentSolution(new ParamPaymentSolution);
            $this->setTeams(new \Doctrine\Common\Collections\ArrayCollection([new Team]));
            $this->setSeason(new ParamSeason);
            $this->setPaypalInformation(new PaypalInformation);
        }
        return $this;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(?string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(?string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getBirthdate(): ?\DateTimeInterface
    {
        return $this->birthdate;
    }

    public function setBirthdate(?\DateTimeInterface $birthdate): self
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

    public function getPostalCode(): ?string
    {
        return $this->postal_code;
    }

    public function setPostalCode(?string $postal_code): self
    {
        $this->postal_code = $postal_code;

        return $this;
    }

    public function getStreet(): ?string
    {
        return $this->street;
    }

    public function setStreet(?string $street): self
    {
        $this->street = $street;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(?string $city): self
    {
        $this->city = $city;

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

    public function setParentOneFirstname(?string $parent_one_firstname): self
    {
        $this->parent_one_firstname = $parent_one_firstname;

        return $this;
    }

    public function getParentOneLastname(): ?string
    {
        return $this->parent_one_lastname;
    }

    public function setParentOneLastname(?string $parent_one_lastname): self
    {
        $this->parent_one_lastname = $parent_one_lastname;

        return $this;
    }

    public function getParentOnePhoneNumber(): ?string
    {
        return $this->parent_one_phone_number;
    }

    public function setParentOnePhoneNumber(?string $parent_one_phone_number): self
    {
        $this->parent_one_phone_number = $parent_one_phone_number;

        return $this;
    }

    public function getParentOneEmail(): ?string
    {
        return $this->parent_one_email;
    }

    public function setParentOneEmail(?string $parent_one_email): self
    {
        $this->parent_one_email = $parent_one_email;

        return $this;
    }

    public function getParentOneProfession(): ?string
    {
        return $this->parent_one_profession;
    }

    public function setParentOneProfession(?string $parent_one_profession): self
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

    public function setParentTwoLastname(?string $parent_two_lastname): self
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

    public function setIsTransportAllow(bool $is_transport_allow): self
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

    public function getIsNonCompetitive(): ?bool
    {
        return $this->is_non_competitive;
    }

    public function setIsNonCompetitive(bool $is_non_competitive): self
    {
        $this->is_non_competitive = $is_non_competitive;

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

    public function getIsDocumentComplete(): ?bool
    {
        return $this->is_document_complete;
    }

    public function setIsDocumentComplete(bool $is_document_complete): self
    {
        $this->is_document_complete = $is_document_complete;

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

    public function getAmountPayed(): ?float
    {
        return $this->amount_payed;
    }

    public function setAmountPayed(?float $amount_payed): self
    {
        $this->amount_payed = $amount_payed;

        return $this;
    }

    public function getAmountPayedOther(): ?int
    {
        return $this->amount_payed_other;
    }

    public function setAmountPayedOther(?int $amount_payed_other): self
    {
        $this->amount_payed_other = $amount_payed_other;

        return $this;
    }

    public function getIsLicenseRenewal(): ?bool
    {
        return $this->is_license_renewal;
    }

    public function setIsLicenseRenewal(bool $is_license_renewal): self
    {
        $this->is_license_renewal = $is_license_renewal;

        return $this;
    }

    public function getPaymentNotes(): ?string
    {
        return $this->payment_notes;
    }

    public function setPaymentNotes(?string $payment_notes): self
    {
        $this->payment_notes = $payment_notes;

        return $this;
    }

    public function getIsCheckGestHand(): ?bool
    {
        return $this->is_check_gest_hand;
    }

    public function setIsCheckGestHand(bool $is_check_gest_hand): self
    {
        $this->is_check_gest_hand = $is_check_gest_hand;

        return $this;
    }

    public function getIsInscriptionDone(): ?bool
    {
        return $this->is_inscription_done;
    }

    public function setIsInscriptionDone(bool $is_inscription_done): self
    {
        $this->is_inscription_done = $is_inscription_done;

        return $this;
    }

    public function getGesthandIsPhoto(): ?bool
    {
        return $this->gesthand_is_photo;
    }

    public function setGesthandIsPhoto(bool $gesthand_is_photo): self
    {
        $this->gesthand_is_photo = $gesthand_is_photo;

        return $this;
    }

    public function getGesthandIsPhotoId(): ?bool
    {
        return $this->gesthand_is_photo_id;
    }

    public function setGesthandIsPhotoId(bool $gesthand_is_photo_id): self
    {
        $this->gesthand_is_photo_id = $gesthand_is_photo_id;

        return $this;
    }

    public function getGesthandIsCertificate(): ?bool
    {
        return $this->gesthand_is_certificate;
    }

    public function setGesthandIsCertificate(bool $gesthand_is_certificate): self
    {
        $this->gesthand_is_certificate = $gesthand_is_certificate;

        return $this;
    }

    public function getGesthandCertificateDate(): ?\DateTimeInterface
    {
        return $this->gesthand_certificate_date;
    }

    public function setGesthandCertificateDate(?\DateTimeInterface $gesthand_certificate_date): self
    {
        $this->gesthand_certificate_date = $gesthand_certificate_date;

        return $this;
    }

    public function getGesthandIsHealthQuestionnaire(): ?bool
    {
        return $this->gesthand_is_health_questionnaire;
    }

    public function setGesthandIsHealthQuestionnaire(bool $gesthand_is_health_questionnaire): self
    {
        $this->gesthand_is_health_questionnaire = $gesthand_is_health_questionnaire;

        return $this;
    }

    public function getGesthandIsFfhbAuthorization(): ?bool
    {
        return $this->gesthand_is_ffhb_authorization;
    }

    public function setGesthandIsFfhbAuthorization(bool $gesthand_is_ffhb_authorization): self
    {
        $this->gesthand_is_ffhb_authorization = $gesthand_is_ffhb_authorization;

        return $this;
    }

    public function getGesthandQualificationDate(): ?\DateTimeInterface
    {
        return $this->gesthand_qualification_date;
    }

    public function setGesthandQualificationDate(?\DateTimeInterface $gesthand_qualification_date): self
    {
        $this->gesthand_qualification_date = $gesthand_qualification_date;

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

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): self
    {
        $this->notes = $notes;

        return $this;
    }

    public function getSex(): ?ParamSex
    {
        return $this->sex;
    }

    public function setSex(?ParamSex $sex): self
    {
        $this->sex = $sex;

        return $this;
    }

    public function getPaymentSolution(): ?ParamPaymentSolution
    {
        return $this->payment_solution;
    }

    public function setPaymentSolution(ParamPaymentSolution $payment_solution): self
    {
        $this->payment_solution = $payment_solution;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser($user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getTeams(): ?\Doctrine\Common\Collections\Collection
    {
        return $this->teams;
    }

    public function setTeams(\Doctrine\Common\Collections\Collection $teams): self
    {
        $this->teams = $teams;

        return $this;
    }

    public function getDocuments(): \Doctrine\Common\Collections\Collection
    {
        return $this->documents;
    }

    public function setDocuments(\Doctrine\Common\Collections\Collection $documents): self
    {
        $this->documents = $documents;

        return $this;
    }

    public function getSeason(): ?ParamSeason
    {
        return $this->season;
    }

    public function setSeason(ParamSeason $season): self
    {
        $this->season = $season;

        return $this;
    }

    public function getPaypalInformation(): ?PaypalInformation
    {
        return $this->paypal_information;
    }

    public function setPaypalInformation(?PaypalInformation $paypal_information): self
    {
        $this->paypal_information = $paypal_information;

        return $this;
    }
}
