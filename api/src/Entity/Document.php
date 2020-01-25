<?php

namespace App\Entity;

use App\Entity\Param\ParamDocumentCategory;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Entity\File as EmbeddedFile;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 * @ORM\Table(name="document")
 * @Vich\Uploadable
 */
class Document
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /** 
     * @Vich\UploadableField(mapping="doc", fileNameProperty="document.name", size="document.size", mimeType="document.mimeType", originalName="document.originalName", dimensions="document.dimensions")
     * @Assert\NotBlank(message = "not_blank")
     * @Assert\File(maxSize = "10M", mimeTypes = {"application/pdf", "application/x-pdf", "image/png", "image/jpeg"}, mimeTypesMessage= "mimeTypesMessage")
     * @var File
     */
    private $documentFile;

    /**
     * @ORM\Embedded(class="Vich\UploaderBundle\Entity\File") 
     * @var EmbeddedFile
     */
    private $document;

    /**
     * @ORM\Column(type="datetime")
     *
     * @var \DateTime
     */
    private $updatedAt;

    /**
     * @ORM\ManyToOne(targetEntity="Member", inversedBy="documents")
     * @ORM\JoinColumn(name="id_member", referencedColumnName="id", onDelete="CASCADE")
     */
    private $member;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Param\ParamDocumentCategory")
     * @ORM\JoinColumn(name="id_category", referencedColumnName="id", onDelete="CASCADE")
     */
    private $category;

    public function __construct()
    {
        $this->document = new EmbeddedFile();
    }

    public function __clone()
    {
        if ($this->id) {
            $this->id = null;
            $this->documentFile = null;
            $this->document = new EmbeddedFile();
        }
        return $this;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @param File $imageFile
     */
    public function setDocumentFile(?File $documentFile = null)
    {
        $this->documentFile = $documentFile;

        if ($documentFile) $this->updatedAt = new \DateTime();
    }

    public function getDocumentFile(): ?File
    {
        return $this->documentFile;
    }

    public function setDocument(EmbeddedFile $document)
    {
        $this->document = $document;
    }

    public function getDocument(): ?EmbeddedFile
    {
        return $this->document;
    }

    public function getMember(): ?Member
    {
        return $this->member;
    }

    public function setMember(Member $member): self
    {
        $this->member = $member;

        return $this;
    }

    public function getCategory(): ?ParamDocumentCategory
    {
        return $this->category;
    }

    public function setCategory(ParamDocumentCategory $category): self
    {
        $this->category = $category;

        return $this;
    }
}
