<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20191204150714 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE mc_document DROP FOREIGN KEY FK_DAB70E185697F554');
        $this->addSql('ALTER TABLE mc_document ADD CONSTRAINT FK_DAB70E185697F554 FOREIGN KEY (id_category) REFERENCES mc_param_document_category (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE mc_member DROP FOREIGN KEY FK_1FA17806B3CA4B');
        $this->addSql('ALTER TABLE mc_member ADD CONSTRAINT FK_1FA17806B3CA4B FOREIGN KEY (id_user) REFERENCES mc_user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE mc_document DROP FOREIGN KEY FK_DAB70E185697F554');
        $this->addSql('ALTER TABLE mc_document ADD CONSTRAINT FK_DAB70E185697F554 FOREIGN KEY (id_category) REFERENCES mc_param_document_category (id)');
        $this->addSql('ALTER TABLE mc_member DROP FOREIGN KEY FK_1FA17806B3CA4B');
        $this->addSql('ALTER TABLE mc_member ADD CONSTRAINT FK_1FA17806B3CA4B FOREIGN KEY (id_user) REFERENCES mc_user (id)');
    }
}
