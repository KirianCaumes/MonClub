<?php

namespace App\Service\Generator;

use App\Constants;
use App\Entity\Member;
use App\Entity\Team;
use App\Service\ParamService;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Service to generate Excel files
 */
class ExcelService
{
    private $em;
    private $spreadsheet;
    private $paramService;

    public function __construct(EntityManagerInterface $em, ParamService $paramService)
    {
        $this->em = $em;
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

            $sheet->fromArray(['Nom', 'Prenom', 'Date naissance', 'Email', 'Email Parent 1', 'Email Parent 2', 'Adresse', 'Ville', 'Code postal', 'Tel', 'Tel Parent 1', 'Tel Parent 2', 'Prof. Parent 1', 'Prof. Parent 2'], null, 'A1');

            $members = $this->em->getRepository(Member::class)->findByTeamsAndSeason([$team], $this->paramService->getCurrentSeason());

            $row = 2;
            foreach ($members as $member) {
                $sheet->setCellValue('A' . $row, ($member->getLastname()));
                $sheet->setCellValue('B' . $row, ($member->getFirstname()));
                $sheet->setCellValue('C' . $row, ($member->getBirthdate() ? $member->getBirthdate()->format('d/m/Y') : ''));
                $sheet->setCellValue('D' . $row, ($member->getEmail() ? $member->getEmail() : ''));
                $sheet->setCellValue('E' . $row, ($member->getParentOneEmail() ? $member->getParentOneEmail() : ''));
                $sheet->setCellValue('F' . $row, ($member->getParentTwoEmail() ? $member->getParentTwoEmail() : ''));
                $sheet->setCellValue('G' . $row, ($member->getStreet() ? $member->getStreet() : ''));
                $sheet->setCellValue('H' . $row, ($member->getCity() ? $member->getCity() : ''));
                $sheet->setCellValue('I' . $row, ($member->getPostalCode() ? $member->getPostalCode() : ''));
                $sheet->setCellValue('J' . $row, ($member->getPhoneNumber() ? $member->getPhoneNumber() : ''));
                $sheet->setCellValue('K' . $row, ($member->getParentOnePhoneNumber() ? $member->getParentOnePhoneNumber() : ''));
                $sheet->setCellValue('L' . $row, ($member->getParentTwoPhoneNumber() ? $member->getParentTwoPhoneNumber() : ''));
                $sheet->setCellValue('M' . $row, ($member->getParentOneProfession() ? $member->getParentOneProfession() : ''));
                $sheet->setCellValue('N' . $row, ($member->getParentTwoProfession() ? $member->getParentTwoProfession() : ''));

                $sheet->getStyle('A' . $row . ':N' . $row)->getFill()
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
            $sheet->freezePane('A2');
        }

        return new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($this->spreadsheet);
    }

    // Generate Excel with tracking informations.
    public function generateExcelSuivis() {
        $sheet = $this->spreadsheet->getActiveSheet();

        $sheet->fromArray(['Année de naissance', 'Nom', 'Prénom', 'Photo', 'Certificat', 'date certificat', 'identité PHOTO / CI', 'attestation quest santé', 'autorisation FFHB', 'date FINALISATION/valid/qualif', 'e-mail', 'père', 'mère', 'validation @ mail'], null, 'A1');

        $members = $this->em->getRepository(Member::class)->findBy(['season' => $this->paramService->getCurrentSeason()]);
        $row = 2;
        foreach ($members as $key => $member) {
            $sheet->setCellValue('A' . $row, ($member->getBirthdate() ? $member->getBirthdate()->format('Y') : ''));
            $sheet->setCellValue('B' . $row, ($member->getLastname()));
            $sheet->setCellValue('C' . $row, ($member->getFirstname()));
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
}
