<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Vich\UploaderBundle\Entity\File as EmbeddedFile;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
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

    public function __construct()
    {
        $this->document = new EmbeddedFile();
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
}
