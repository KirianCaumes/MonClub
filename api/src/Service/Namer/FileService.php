<?php

namespace App\Service\Namer;

use App\Service\ParamService;
use Vich\UploaderBundle\Mapping\PropertyMapping;
use Vich\UploaderBundle\Naming\NamerInterface;
use Vich\UploaderBundle\Util\Transliterator;

/**
 * Service to change directory path for file upload
 */
class FileService implements NamerInterface
{
    private $paramService;
    private $transliterator;

    public function __construct(ParamService $paramService, Transliterator $transliterator)
    {
        $this->paramService = $paramService;
        $this->transliterator = $transliterator;
    }

    /**
     * Returns the name of a file
     *
     * @param object          $object  The object the upload is attached to
     * @param PropertyMapping $mapping 
     *
     * @return string 
     */
    public function name($media, PropertyMapping $mapping): string
    {
        $info = pathinfo($mapping->getFile($media)->getClientOriginalName());
        return
            $this->transliterator->transliterate(
                $media->getMember()->getLastname() . '-' . $media->getMember()->getFirstname()
            ) .
            '_' .
            $this->transliterator->transliterate($info['filename']) .
            '_' .
            \uniqid() .
            '.' .
            $info['extension'];
    }
}
