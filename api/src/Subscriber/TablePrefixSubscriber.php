<?php

namespace App\Subscriber;

use Doctrine\Common\EventSubscriber;
use \Doctrine\ORM\Event\LoadClassMetadataEventArgs;

class TablePrefixSubscriber implements EventSubscriber
{
    protected $prefix = '';

    public function __construct()
    {
        switch ($_ENV['APP_ENV']) {
            case 'dev':
                $this->prefix = $_ENV['DATABASE_PREFIX_DEV'];
                break;
            case 'staging':
                $this->prefix = $_ENV['DATABASE_PREFIX_STAGING'];
                break;
            case 'prod':
                $this->prefix = $_ENV['DATABASE_PREFIX_PROD'];
                break;
            default:
                $this->prefix = "";
                break;
        }
    }

    public function getSubscribedEvents()
    {
        return ['loadClassMetadata'];
    }

    public function loadClassMetadata(LoadClassMetadataEventArgs $eventArgs)
    {
        $classMetadata = $eventArgs->getClassMetadata();

        if (!$classMetadata->isInheritanceTypeSingleTable() || $classMetadata->getName() === $classMetadata->rootEntityName) {
            $classMetadata->setPrimaryTable([
                'name' => $this->prefix . $classMetadata->getTableName()
            ]);
        }

        foreach ($classMetadata->getAssociationMappings() as $fieldName => $mapping) {
            if ($mapping['type'] == \Doctrine\ORM\Mapping\ClassMetadataInfo::MANY_TO_MANY && $mapping['isOwningSide']) {
                $mappedTableName = $mapping['joinTable']['name'];
                $classMetadata->associationMappings[$fieldName]['joinTable']['name'] = $this->prefix . $mappedTableName;
            }
        }
    }
}
