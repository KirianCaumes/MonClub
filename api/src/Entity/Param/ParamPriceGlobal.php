<?php

namespace App\Entity\Param;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="param_price_global")
 * @UniqueEntity(fields={"season"})
 */
class ParamPriceGlobal
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @Assert\NotBlank(message = "not_blank")
     * @ORM\Column(type="integer")
     */
    private $reduced_price_before_deadline;

    /**
     * @Assert\NotBlank(message = "not_blank")
     * @ORM\Column(type="integer")
     */
    private $reduced_price_after_deadline;

    /**
     * @Assert\NotBlank(message = "not_blank")
     * @ORM\Column(type="date")
     */
    private $deadline_date;

    /**
     * @Assert\NotBlank(message = "not_blank")
     * @ORM\Column(type="integer")
     */
    private $paypal_fee;
    
    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Param\ParamSeason")
     * @ORM\JoinColumn(name="id_season", referencedColumnName="id")
     */
    private $season;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getReducedPriceBeforeDeadline(): ?int
    {
        return $this->reduced_price_before_deadline;
    }

    public function setReducedPriceBeforeDeadline(int $reduced_price_before_deadline): self
    {
        $this->reduced_price_before_deadline = $reduced_price_before_deadline;

        return $this;
    }

    public function getReducedPriceAfterDeadline(): ?int
    {
        return $this->reduced_price_after_deadline;
    }

    public function setReducedPriceAfterDeadline(int $reduced_price_after_deadline): self
    {
        $this->reduced_price_after_deadline = $reduced_price_after_deadline;

        return $this;
    }

    public function getDeadlineDate(): ?\DateTimeInterface
    {
        return $this->deadline_date;
    }

    public function setDeadlineDate(\DateTimeInterface $deadline_date): self
    {
        $this->deadline_date = $deadline_date;

        return $this;
    }

    public function getPaypalFee(): ?int
    {
        return $this->paypal_fee;
    }

    public function setPaypalFee(int $paypal_fee): self
    {
        $this->paypal_fee = $paypal_fee;

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
}
