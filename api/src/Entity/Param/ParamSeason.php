<?php

namespace App\Entity\Param;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="param_season")
 */
class ParamSeason
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
     * @ORM\Column(type="boolean", options={"default":"0"})
     */
    private $is_active = false;

    /**
     * @ORM\Column(type="boolean", options={"default":"0"})
     */
    private $is_current = false;

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

    public function getIsActive(): ?bool
    {
        return $this->is_active;
    }

    public function setIsActive(bool $is_active): self
    {
        $this->is_active = $is_active;

        return $this;
    }

    public function getIsCurrent(): ?bool
    {
        return $this->is_current;
    }

    public function setIsCurrent(bool $is_current): self
    {
        $this->is_current = $is_current;

        return $this;
    }
}
