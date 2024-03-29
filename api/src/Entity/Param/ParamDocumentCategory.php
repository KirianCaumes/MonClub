<?php

namespace App\Entity\Param;

use Doctrine\ORM\Mapping as ORM;

/**
 * @deprecated No longer used : no more document are uploaded.
 * @ORM\Entity
 * @ORM\Table(name="param_document_category")
 */
class ParamDocumentCategory
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
}
