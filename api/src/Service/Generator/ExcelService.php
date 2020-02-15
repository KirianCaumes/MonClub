<?php

namespace App\Service\Generator;

use App\Constants;
use App\Entity\Member;
use App\Entity\Param\ParamPriceTransfer;
use App\Entity\Team;
use App\Entity\User;
use App\Service\DateService;
use App\Service\ParamService;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Service to generate Excel files
 */
class ExcelService
{
    private $em;
    private $spreadsheet;
    private $dateService;
    private $paramService;

    public function __construct(EntityManagerInterface $em, ParamService $paramService, DateService $dateService)
    {
        $this->em = $em;
        $this->dateService = $dateService;
        $this->paramService = $paramService;
        $this->spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
    }

    // Add legends
    private function addLegend($sheet, $row)
    {
        $sheet->getStyle('A' . ($row + 1))->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB(Constants::COLORS[0]);
        $sheet->setCellValue('B' . ($row + 1), "Le licencié n'a rien fait");
        $sheet->getStyle('A' . ($row + 2))->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB(Constants::COLORS[1]);
        $sheet->setCellValue('B' . ($row + 2), "Le licencié est inscris et à envoyé ses docs");
        $sheet->getStyle('A' . ($row + 3))->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB(Constants::COLORS[2]);
        $sheet->setCellValue('B' . ($row + 3), "Le licencié a payé");
        $sheet->getStyle('A' . ($row + 4))->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB(Constants::COLORS[3]);
        $sheet->setCellValue('B' . ($row + 4), "Le licencié est bien inscirs sur Gesthand");
        $sheet->getStyle('A' . ($row + 5))->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB(Constants::COLORS[4]);
        $sheet->setCellValue('B' . ($row + 5), "Les licencié est inscris");

        return $sheet;
    }

    // Set general style
    private function setGeneralStyle($sheet, $row)
    {
        //Resize auto columns
        for ($col = 'A'; $col !== 'O'; $col++) $sheet->getColumnDimension($col)->setAutoSize(true);

        //Add borders: HS
        $sheet->getStyle('A1:N' . $row)->applyFromArray(['borders' => ['allborders' => ['style' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_DOUBLE, 'color' => ['argb' => '0000']]]]);

        return $sheet;
    }

    // Generate excel 'infos general'.
    public function generateExcelGeneral()
    {
        $teams = $this->em->getRepository(Team::class)->findAll();
        foreach ($teams as $index => $team) {
            if ($index > 0) $this->spreadsheet->createSheet();
            $this->spreadsheet->setActiveSheetIndex($index);
            $sheet = $this->spreadsheet->getActiveSheet();
            $sheet->setTitle($team->getLabel());

            $sheet->fromArray(['', 'Saison ' . $this->paramService->getCurrentSeason()->getLabel(), 'MAX ' . $team->getMaxNumberMembers(), 'Coachs : ' . $team->getCoaches(), 'Entraineurs : ' . $team->getTrainers()], null, 'A1');
            $sheet->fromArray(['', 'Effectif ' . $team->getLabel(), $team->getMemberYears(), 'Parent référent : ' . $team->getReferentParent()], null, 'A2');
            $sheet->getStyle('D2')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('F1C232');

            $sheet->fromArray(['', 'Nom', 'Prenom', 'Date naissance', 'Email', 'Email Parent 1', 'Email Parent 2', 'Adresse', 'Ville', 'Code postal', 'Tel', 'Tel Parent 1', 'Tel Parent 2', 'Prof. Parent 1', 'Prof. Parent 2', 'Evacuation', 'Transport', 'Image', 'Retour maison', 'Newsletter'], null, 'A4');
            $sheet->getStyle('A4:U4')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('E5B8B7');

            $members = $this->em->getRepository(Member::class)->findByTeamsAndSeason([$team], $this->paramService->getCurrentSeason());

            $row = 5;
            foreach ($members as $index => $member) {
                $sheet->setCellValue('A' . $row, $index);
                $sheet->setCellValue('B' . $row, ucwords($member->getLastname()));
                $sheet->setCellValue('C' . $row, ucwords($member->getFirstName()));
                $sheet->setCellValue('D' . $row, ($member->getBirthdate() ? $member->getBirthdate()->format('d/m/Y') : ''));
                $sheet->setCellValue('E' . $row, ($member->getEmail() ? $member->getEmail() : ''));
                $sheet->setCellValue('F' . $row, ($member->getParentOneEmail() ? $member->getParentOneEmail() : ''));
                $sheet->setCellValue('G' . $row, ($member->getParentTwoEmail() ? $member->getParentTwoEmail() : ''));
                $sheet->setCellValue('H' . $row, ($member->getStreet() ? $member->getStreet() : ''));
                $sheet->setCellValue('I' . $row, ($member->getCity() ? $member->getCity() : ''));
                $sheet->setCellValue('J' . $row, ($member->getPostalCode() ? $member->getPostalCode() : ''));
                $sheet->setCellValue('K' . $row, ($member->getPhoneNumber() ? $member->getPhoneNumber() : ''));
                $sheet->setCellValue('L' . $row, ($member->getParentOnePhoneNumber() ? $member->getParentOnePhoneNumber() : ''));
                $sheet->setCellValue('M' . $row, ($member->getParentTwoPhoneNumber() ? $member->getParentTwoPhoneNumber() : ''));
                $sheet->setCellValue('N' . $row, ($member->getParentOneProfession() ? $member->getParentOneProfession() : ''));
                $sheet->setCellValue('O' . $row, ($member->getParentTwoProfession() ? $member->getParentTwoProfession() : ''));
                $sheet->setCellValue('P' . $row, ($member->getIsEvacuationAllow() ? 'Oui' : 'Non'));
                $sheet->setCellValue('R' . $row, ($member->getIsTransportAllow() ? 'Oui' : 'Non'));
                $sheet->setCellValue('S' . $row, ($member->getIsImageAllow() ? 'Oui' : 'Non'));
                $sheet->setCellValue('T' . $row, ($member->getIsReturnHomeAllow() ? 'Oui' : 'Non'));
                $sheet->setCellValue('U' . $row, ($member->getIsNewsLetterAllow() ? 'Oui' : 'Non'));

                $sheet->getStyle('A' . $row . ':U' . $row)->getFill()
                    ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
                    ->getStartColor()->setARGB((function () use ($member) {
                        if ($member->getIsDocumentComplete() && !$member->getIsPayed() && !$member->getIsCheckGestHand() && !$member->getIsInscriptionDone()) {
                            return Constants::COLORS[1];
                        } else if ($member->getIsDocumentComplete() && $member->getIsPayed() && !$member->getIsCheckGestHand() && !$member->getIsInscriptionDone()) {
                            return Constants::COLORS[2];
                        } else if ($member->getIsDocumentComplete() && $member->getIsPayed() && $member->getIsCheckGestHand() &&  !$member->getIsInscriptionDone()) {
                            return Constants::COLORS[3];
                        } else if ($member->getIsDocumentComplete() && $member->getIsPayed() && $member->getIsCheckGestHand() && $member->getIsInscriptionDone()) {
                            return Constants::COLORS[4];
                        } else {
                            return Constants::COLORS[0];
                        }
                    })());
                $row++;
            }

            //Add legends
            $sheet = $this->addLegend($sheet, $row);

            //Set styles
            $sheet = $this->setGeneralStyle($sheet, $row);

            //Freeze first row
            $sheet->freezePane('A5');
        }

        return new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($this->spreadsheet);
    }

    // Generate Excel with tracking informations.
    public function generateExcelSuivis()
    {
        $sheet = $this->spreadsheet->getActiveSheet();

        $sheet->fromArray(['Année de naissance', 'Nom', 'Prénom', 'Photo', 'Certificat', 'date certificat', 'identité PHOTO / CI', 'attestation quest santé', 'autorisation FFHB', 'date FINALISATION/valid/qualif', 'e-mail', 'père', 'mère', 'validation @ mail'], null, 'A1');

        $members = $this->em->getRepository(Member::class)->findBy(['season' => $this->paramService->getCurrentSeason()]);
        $row = 2;
        foreach ($members as $key => $member) {
            $sheet->setCellValue('A' . $row, ($member->getBirthdate() ? $member->getBirthdate()->format('Y') : ''));
            $sheet->setCellValue('B' . $row, ucwords($member->getLastname()));
            $sheet->setCellValue('C' . $row, ucwords($member->getFirstName()));
            $sheet->setCellValue('D' . $row, ($member->getGesthandIsPhoto() ? 'Ok' : ''));
            $sheet->setCellValue('E' . $row, ($member->getGesthandIsCertificate() ? 'Ok' : ''));
            $sheet->setCellValue('F' . $row, ($member->getGesthandCertificateDate() ? $member->getGesthandCertificateDate()->format('d/m/Y') : ''));
            $sheet->setCellValue('G' . $row, ($member->getGesthandIsPhotoId() ? 'Ok' : ''));
            $sheet->setCellValue('H' . $row, ($member->getGesthandIsHealthQuestionnaire() ? 'Ok' : ''));
            $sheet->setCellValue('I' . $row, ($member->getGesthandIsFfhbAuthorization() ? 'Ok' : ''));
            $sheet->setCellValue('J' . $row, ($member->getGesthandQualificationDate() ? $member->getGesthandQualificationDate()->format('d/m/Y') : ''));
            $sheet->setCellValue('K' . $row, (function () use ($member) {
                $mails = array_filter([$member->getEmail(), $member->getParentOneEmail(), $member->getParentTwoEmail()]);
                return implode(' / ', $mails);
            })());
            $sheet->setCellValue('L' . $row, ($member->getParentOneProfession() ? $member->getParentOneProfession() : ''));
            $sheet->setCellValue('M' . $row, ($member->getParentTwoProfession() ? $member->getParentTwoProfession() : ''));
            $sheet->setCellValue('N' . $row, '');

            $sheet->getStyle('A' . $row . ':J' . $row)->getFill()
                ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
                ->getStartColor()->setARGB((function () use ($member) {
                    if ($member->getIsDocumentComplete() && !$member->getIsPayed() && !$member->getIsCheckGestHand() && !$member->getIsInscriptionDone()) {
                        return Constants::COLORS[1];
                    } else if ($member->getIsDocumentComplete() && $member->getIsPayed() && !$member->getIsCheckGestHand() && !$member->getIsInscriptionDone()) {
                        return Constants::COLORS[2];
                    } else if ($member->getIsDocumentComplete() && $member->getIsPayed() && $member->getIsCheckGestHand() &&  !$member->getIsInscriptionDone()) {
                        return Constants::COLORS[3];
                    } else if ($member->getIsDocumentComplete() && $member->getIsPayed() && $member->getIsCheckGestHand() && $member->getIsInscriptionDone()) {
                        return Constants::COLORS[4];
                    } else {
                        return Constants::COLORS[0];
                    }
                })());
            $row++;
        }

        //Add legends
        $sheet = $this->addLegend($sheet, $row);

        //Set styles
        $sheet = $this->setGeneralStyle($sheet, $row);

        //Freeze first row
        $sheet->freezePane('C2');

        return new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($this->spreadsheet);
    }

    // Generate excel 'CalculHand'.
    public function generateExcelCalculhand()
    {
        $sheet = $this->spreadsheet->getActiveSheet();

        $sheet->fromArray(['Equipe', 'Année de Naissance', 'Nom', 'Prénom', 'N° de Licence / Famille', 'Renouvellement de Licence', 'Exception (Loisir/Chômeur/Etudiant)', 'Date d\'inscription', 'Montant Licence', 'Sponsoring Super U', 'Montant frais de mutation', 'Montant Total de la licence', 'Encaissement', 'Commentaires'], null, 'A1');

        $members = $this->em->getRepository(Member::class)->findBy(['season' => $this->paramService->getCurrentSeason()]);
        $row = 2;
        foreach ($members as $key => $member) {
            $sheet->setCellValue('A' . $row, (function () use ($member) {
                $teams = [];
                foreach ($member->getTeams() as $team) array_push($teams, $team->getLabel());
                return implode(' / ', $teams);
            })());
            $sheet->setCellValue('B' . $row, ($member->getBirthdate() ? $member->getBirthdate()->format('Y') : ''));
            $sheet->setCellValue('C' . $row, ucwords($member->getLastname()));
            $sheet->setCellValue('D' . $row, ucwords($member->getFirstName()));
            $sheet->setCellValue('E' . $row, (function () use ($member) {
                if (!$member->getUser()) return '';
                $members = $this->em->getRepository(Member::class)->findBy(['user' => $member->getUser(), 'season' => $this->paramService->getCurrentSeason()]);
                $position = 1;
                foreach ($members as $key => $mbr) {
                    if ($mbr === $member) {
                        $position = $key + 1;
                        break;
                    }
                }
                return $position;
            })());
            $sheet->setCellValue('F' . $row, ($member->getIsLicenseRenewal() ? 'OUI' : 'NON'));
            $sheet->setCellValue('G' . $row, ($member->getIsReducedPrice() || $member->getIsNonCompetitive()  ? 'OUI' : 'NON'));
            $sheet->setCellValue('H' . $row, ($member->getCreationDatetime() ? $member->getCreationDatetime()->format('d/m/Y') : ''));
            $sheet->setCellValue('I' . $row, ($member->getAmountPayed() ? $member->getAmountPayed() : ''));
            $sheet->setCellValue('J' . $row, ($member->getAmountPayedOther() ? $member->getAmountPayedOther() : ''));
            $sheet->setCellValue('K' . $row, (function () use ($member) {
                if (!$member->getIsTransferNeeded()) return '';
                return $this->em->getRepository(ParamPriceTransfer::class)->findOneByAgeInterval(
                    $this->dateService->getAge((int) $member->getBirthdate()->format('Y')),
                    $this->paramService->getCurrentSeason()
                )->getPrice();
            })());
            $sheet->setCellValue('L' . $row, (function () use ($member) {
                $total = ($member->getAmountPayed() ? $member->getAmountPayed() : 0) - ($member->getAmountPayedOther() ? $member->getAmountPayedOther() : 0);
                return $total > 0 ? $total : '';
            })());
            $sheet->setCellValue('M' . $row, null);
            $sheet->setCellValue('N' . $row, ($member->getPaymentNotes() ? $member->getPaymentNotes() : ''));

            // $sheet->getStyle('A' . $row . ':O' . $row)->getFill()
            //     ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
            //     ->getStartColor()->setARGB((function () use ($member) {
            //         if ($member->getIsDocumentComplete() && !$member->getIsPayed() && !$member->getIsCheckGestHand() && !$member->getIsInscriptionDone()) {
            //             return Constants::COLORS[1];
            //         } else if ($member->getIsDocumentComplete() && $member->getIsPayed() && !$member->getIsCheckGestHand() && !$member->getIsInscriptionDone()) {
            //             return Constants::COLORS[2];
            //         } else if ($member->getIsDocumentComplete() && $member->getIsPayed() && $member->getIsCheckGestHand() &&  !$member->getIsInscriptionDone()) {
            //             return Constants::COLORS[3];
            //         } else if ($member->getIsDocumentComplete() && $member->getIsPayed() && $member->getIsCheckGestHand() && $member->getIsInscriptionDone()) {
            //             return Constants::COLORS[4];
            //         } else {
            //             return Constants::COLORS[0];
            //         }
            //     })());
            $row++;
        }

        //Add legends
        // $sheet = $this->addLegend($sheet, $row);

        //Set styles
        $sheet = $this->setGeneralStyle($sheet, $row);

        //Freeze first row
        $sheet->freezePane('A2');

        return new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($this->spreadsheet);
    }
}
