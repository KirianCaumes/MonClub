<?php

namespace App\Service\Namer;

use App\Service\ParamService;
use Vich\UploaderBundle\Naming\DirectoryNamerInterface;
use Vich\UploaderBundle\Mapping\PropertyMapping;
use Matko\MediaBundle\Entity\Media;

/**
 * Service to change directory path for file upload
 */
class DirectoryService implements DirectoryNamerInterface
{
    private $paramService;

    public function __construct(ParamService $paramService)
    {
        $this->paramService = $paramService;
    }
    
    /**
     * Returns the name of a directory where files will be uploaded
     *
     * @param Media $media
     * @param PropertyMapping $mapping 
     *
     * @return string 
     */
    public function directoryName($media, PropertyMapping $mapping): string
    {
        return mb_ereg_replace("([^\w\s\d\-_~,;\[\]\(\).])", '', $this->paramService->getCurrentSeason()->getLabel()) . '/';
    }
}
