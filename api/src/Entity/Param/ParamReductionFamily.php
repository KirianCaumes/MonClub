<?php

namespace App\Entity\Param;

use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="param_reduction_family")
 */
class ParamReductionFamily
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
    private $number;

    /**
     * @Assert\NotBlank(message = "not_blank")
     * @ORM\Column(type="integer")
     */
    private $discount;
    
    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Param\ParamSeason")
     * @ORM\JoinColumn(name="id_season", referencedColumnName="id")
     */
    private $season;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNumber(): ?int
    {
        return $this->number;
    }

    public function setNumber(int $number): self
    {
        $this->number = $number;

        return $this;
    }

    public function getDiscount(): ?int
    {
        return $this->discount;
    }

    public function setDiscount(int $discount): self
    {
        $this->discount = $discount;

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
