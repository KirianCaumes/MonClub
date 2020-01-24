<?php

namespace App\Service\Namer;

use Vich\UploaderBundle\Naming\DirectoryNamerInterface;
use Vich\UploaderBundle\Mapping\PropertyMapping;
use Vich\UploaderBundle\Util\Transliterator;

/**
 * Service to change directory path for file upload
 */
class DirectoryService implements DirectoryNamerInterface
{
    private $transliterator;

    public function __construct(Transliterator $transliterator)
    {
        $this->transliterator = $transliterator;
    }
    /**
     * Returns the name of a directory where files will be uploaded
     *
     * @param object $media
     * @param PropertyMapping $mapping 
     *
     * @return string 
     */
    public function directoryName($media, PropertyMapping $mapping): string
    {
        return $this->transliterator->transliterate($media->getCategory()->getLabel()) . '/';
    }
}
