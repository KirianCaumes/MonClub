<?php

namespace App\Entity\Param;

use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ParamPriceTransferRepository")
 * @ORM\Table(name="param_price_transfer")
 */
class ParamPriceTransfer
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
    private $price;

    /**
     * @Assert\NotBlank(message = "not_blank")
     * @ORM\Column(type="integer")
     */
    private $min_age;

    /**
     * @Assert\NotBlank(message = "not_blank")
     * @ORM\Column(type="integer")
     */
    private $max_age;

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

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(int $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getMinage(): ?int
    {
        return $this->min_age;
    }

    public function setMinage(int $min_age): self
    {
        $this->min_age = $min_age;

        return $this;
    }

    public function getMaxage(): ?int
    {
        return $this->max_age;
    }

    public function setMaxage(int $max_age): self
    {
        $this->max_age = $max_age;

        return $this;
    }
}
