<?php

namespace App\Entity;

use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ParamPriceLicenseRepository")
 * @ORM\Table(name="mc_param_price_license")
 */
class ParamPriceLicense
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
     * @ORM\Column(type="integer")
     */
    private $price_before_deadline;

    /**
     * @Assert\NotBlank(message = "not_blank")
     * @ORM\Column(type="integer")
     */
    private $price_after_deadline;

    /**
     * @Assert\NotBlank(message = "not_blank")
     * @ORM\Column(type="integer")
     */
    private $min_year;

    /**
     * @Assert\NotBlank(message = "not_blank")
     * @ORM\Column(type="integer")
     */
    private $max_year;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(string $label): self
    {
        $this->label = $label;

        return $this;
    }

    public function getPriceBeforeDeadline(): ?int
    {
        return $this->price_before_deadline;
    }

    public function setPriceBeforeDeadline(int $price_before_deadline): self
    {
        $this->price_before_deadline = $price_before_deadline;

        return $this;
    }

    public function getPriceAfterDeadline(): ?int
    {
        return $this->price_after_deadline;
    }

    public function setPriceAfterDeadline(int $price_after_deadline): self
    {
        $this->price_after_deadline = $price_after_deadline;

        return $this;
    }

    public function getMinYear(): ?int
    {
        return $this->min_year;
    }

    public function setMinYear(int $min_year): self
    {
        $this->min_year = $min_year;

        return $this;
    }

    public function getMaxYear(): ?int
    {
        return $this->max_year;
    }

    public function setMaxYear(int $max_year): self
    {
        $this->max_year = $max_year;

        return $this;
    }
}
