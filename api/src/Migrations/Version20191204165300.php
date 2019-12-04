<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20191204165300 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE mc_document DROP FOREIGN KEY FK_DAB70E1856D34F95');
        $this->addSql('ALTER TABLE mc_document ADD CONSTRAINT FK_DAB70E1856D34F95 FOREIGN KEY (id_member) REFERENCES mc_member (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE mc_document DROP FOREIGN KEY FK_DAB70E1856D34F95');
        $this->addSql('ALTER TABLE mc_document ADD CONSTRAINT FK_DAB70E1856D34F95 FOREIGN KEY (id_member) REFERENCES mc_member (id)');
    }
}
