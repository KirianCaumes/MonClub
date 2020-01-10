<?php

namespace App\Controller;

use Dompdf\Dompdf;
use Dompdf\Options;
use App\Constants;
use App\Entity\Document;
use App\Entity\Member;
use App\Entity\ParamDocumentCategory;
use App\Entity\Team;
use App\Form\DocumentType;
use App\Service\ParamService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Contracts\Translation\TranslatorInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Vich\UploaderBundle\Handler\DownloadHandler;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;

/**
 * Member controller.
 * @SWG\Parameter(name="Authorization", in="header", required=true, type="string", default="Bearer ", description="Bearer token")
 * @SWG\Tag(name="File")
 * @Route("/api/document", name="api_")
 */
class FileController extends FOSRestController
{
    /**
     * Generate and get csv for GoogleContact.
     * @SWG\Response(response=200, description="Returns CSV", @SWG\Schema(type="file"))
     * @IsGranted("ROLE_ADMIN")
     * @Route("/google/contact", methods={"GET"})
     */
    public function getGoogleContact(ParamService $paramService)
    {
        $fp = fopen('php://output', 'w');

        $head = ['Name', 'Given Name', 'Additional Name', 'Family Name', 'Yomi Name', 'Given Name Yomi', 'Additional Name Yomi', 'Family Name Yomi', 'Name Prefix', 'Name Suffix', 'Initials', 'Nickname', 'Short Name', 'Maiden Name', 'Birthday', 'Gender', 'Location', 'Billing Information', 'Directory Server', 'Mileage', 'Occupation', 'Hobby', 'Sensitivity', 'Priority', 'Subject', 'Notes', 'Language', 'Photo', 'Group Membership', 'E-mail 1 - Type', 'E-mail 1 - Value', 'E-mail 2 - Type', 'E-mail 2 - Value', 'E-mail 3 - Type', 'E-mail 3 - Value', 'E-mail 4 - Type', 'E-mail 4 - Value', 'Phone 1 - Type', 'Phone 1 - Value', 'Phone 2 - Type', 'Phone 2 - Value', 'Phone 3 - Type', 'Phone 3 - Value', 'Address 1 - Type', 'Address 1 - Formatted', 'Address 1 - Street', 'Address 1 - City', 'Address 1 - PO Box', 'Address 1 - Region', 'Address 1 - Postal Code', 'Address 1 - Country', 'Address 1 - Extended Address', 'Website 1 - Type', 'Website 1 - Value'];

        $members = $this->getDoctrine()->getRepository(Member::class)->findBy(['season' => $paramService->getCurrentSeason()]);

        fputcsv($fp, $head);

        foreach ($members as $member) {
            $data = [];
            foreach ($head as $row) $data[$row] = null;
            $data['Name'] = ucwords($member->getFirstName()) . ' ' . ucwords($member->getLastName());
            $data['Given Name'] = ucwords($member->getFirstName());
            $data['Family Name'] = ucwords($member->getLastName());
            $data['Birthday'] = $member->getBirthdate() ? $member->getBirthdate()->format('d/m/Y') : null;
            $data['Gender'] = $member->getSex() ? $member->getSex()->getLabel() : null;
            $data['Group Membership'] = (function () use ($member) {
                $teams = [];
                foreach ($member->getTeams() as $team) array_push($teams, $team->getLabelGoogleContact());
                return implode(' ::: ', $teams);
            })();
            $data['E-mail 1 - Type'] = 'Emails';
            $data['E-mail 1 - Value'] = (function () use ($member) {
                $mails = array_filter([$member->getEmail(), $member->getParentOneEmail(), $member->getParentTwoEmail()]);
                return implode('>,<', $mails);
            })();
            $data['E-mail 2 - Type'] = 'Membre';
            $data['E-mail 2 - Value'] = $member->getEmail();
            $data['E-mail 3 - Type'] = 'Parent 1';
            $data['E-mail 3 - Value'] = $member->getParentOneEmail();
            $data['E-mail 4 - Type'] = 'Parent 2';
            $data['E-mail 4 - Value'] = $member->getParentTwoEmail();
            $data['Phone 1 - Type'] = 'Membre';
            $data['Phone 1 - Value'] = $member->getPhoneNumber();
            $data['Phone 2 - Type'] = 'Parent 1';
            $data['Phone 2 - Value'] = $member->getParentOnePhoneNumber();
            $data['Phone 3 - Type'] = 'Parent 2';
            $data['Phone 3 - Value'] = $member->getParentTwoPhoneNumber();
            $data['Address 1 - Street'] = $member->getStreet();
            $data['Address 1 - City'] = $member->getCity();
            $data['Address 1 - Postal Code'] = $member->getPostalCode();


            fputcsv($fp, $data);
        }

        return $this->handleView($this->view(''));
    }

    /**
     * Generate and get Excel with tracking informations.
     * @SWG\Response(response=200, description="Returns Xlsx", @SWG\Schema(type="file"))
     * @IsGranted("ROLE_ADMIN")
     * @Route("/excel/tracking", methods={"GET"})
     */
    public function getExcelTracking(ParamService $paramService)
    {
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $sheet->fromArray(['Année de naissance', 'Nom', 'Prénom', 'Photo', 'Certificat', 'date certificat', 'identité PHOTO / CI', 'attestation quest santé', 'autorisation FFHB', 'date FINALISATION/valid/qualif', 'e-mail', 'père', 'mère', 'validation @ mail'], null, 'A1');

        $members = $this->getDoctrine()->getRepository(Member::class)->findBy(['season' => $paramService->getCurrentSeason()]);
        $row = 2;
        foreach ($members as $key => $member) {
            $sheet->setCellValue('A' . $row, ($member->getBirthdate() ? $member->getBirthdate()->format('Y') : ''));
            $sheet->setCellValue('B' . $row, ($member->getLastname()));
            $sheet->setCellValue('C' . $row, ($member->getFirstname()));
            $sheet->setCellValue('D' . $row, ($member->getGesthandIsPhoto() ? 'Ok' : ''));
            $sheet->setCellValue('E' . $row, ($member->getGesthandIsCertificate() ? 'Ok' : ''));
            $sheet->setCellValue('F' . $row, ($member->getGesthandCertificateDate() ? $member->getGesthandCertificateDate()->format('d/m/Y') : ''));
            $sheet->setCellValue('G' . $row, ($member->getGesthandIsPhoto() ? 'Ok' : ''));
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
                    if (
                        $member->getIsDocumentComplete() &&
                        !$member->getIsPayed() &&
                        !$member->getIsCheckGestHand() &&
                        !$member->getIsInscriptionDone()
                    ) {
                        return Constants::COLORS[1];
                    } else if (
                        $member->getIsDocumentComplete() &&
                        $member->getIsPayed() &&
                        !$member->getIsCheckGestHand() &&
                        !$member->getIsInscriptionDone()
                    ) {
                        return Constants::COLORS[2];
                    } else if (
                        $member->getIsDocumentComplete() &&
                        $member->getIsPayed() &&
                        $member->getIsCheckGestHand() &&
                        !$member->getIsInscriptionDone()
                    ) {
                        return Constants::COLORS[3];
                    } else if (
                        $member->getIsDocumentComplete() &&
                        $member->getIsPayed() &&
                        $member->getIsCheckGestHand() &&
                        $member->getIsInscriptionDone()
                    ) {
                        return Constants::COLORS[4];
                    } else {
                        return Constants::COLORS[0];
                    }
                })());
            $row++;
        }

        //Add legends
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

        //Resize auto columns
        for ($col = 'A'; $col !== 'O'; $col++) $sheet->getColumnDimension($col)->setAutoSize(true);

        //Add borders: HS
        $sheet->getStyle('A1:N' . $row)->applyFromArray(['borders' => ['allborders' => ['style' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_DOUBLE, 'color' => ['argb' => '0000']]]]);

        //Freeze first row
        $sheet->freezePane('C2');

        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);

        //Return
        $response = new StreamedResponse(
            function () use ($writer) {
                $writer->save('php://output');
            }
        );
        $response->headers->set('Content-Type', 'application/vnd.ms-excel');
        $response->headers->set('Content-Disposition', 'attachment;filename="excel_suivis.xls"');
        $response->headers->set('Cache-Control', 'max-age=0');

        return $response;
    }

    /**
     * Generate and get excel 'infos general'.
     * @SWG\Response(response=200, description="Returns Xlsx", @SWG\Schema(type="file"))
     * @IsGranted("ROLE_ADMIN")
     * @Route("/excel/general", methods={"GET"})
     */
    public function getExcelGeneral(ParamService $paramService)
    {
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();

        $teams = $this->getDoctrine()->getRepository(Team::class)->findAll();
        foreach ($teams as $index => $team) {
            if ($index > 0) $spreadsheet->createSheet();
            $spreadsheet->setActiveSheetIndex($index);
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setTitle($team->getLabel());

            $sheet->fromArray(['Nom', 'Prenom', 'Date naissance', 'Email', 'Email Parent 1', 'Email Parent 2', 'Adresse', 'Ville', 'Code postal', 'Tel', 'Tel Parent 1', 'Tel Parent 2', 'Prof. Parent 1', 'Prof. Parent 2'], null, 'A1');

            $members = $this->getDoctrine()->getRepository(Member::class)->findByTeamsAndSeason([$team], $paramService->getCurrentSeason());

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
                        if (
                            $member->getIsDocumentComplete() &&
                            !$member->getIsPayed() &&
                            !$member->getIsCheckGestHand() &&
                            !$member->getIsInscriptionDone()
                        ) {
                            return Constants::COLORS[1];
                        } else if (
                            $member->getIsDocumentComplete() &&
                            $member->getIsPayed() &&
                            !$member->getIsCheckGestHand() &&
                            !$member->getIsInscriptionDone()
                        ) {
                            return Constants::COLORS[2];
                        } else if (
                            $member->getIsDocumentComplete() &&
                            $member->getIsPayed() &&
                            $member->getIsCheckGestHand() &&
                            !$member->getIsInscriptionDone()
                        ) {
                            return Constants::COLORS[3];
                        } else if (
                            $member->getIsDocumentComplete() &&
                            $member->getIsPayed() &&
                            $member->getIsCheckGestHand() &&
                            $member->getIsInscriptionDone()
                        ) {
                            return Constants::COLORS[4];
                        } else {
                            return Constants::COLORS[0];
                        }
                    })());
                $row++;
            }

            //Add legends
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

            //Resize auto columns
            for ($col = 'A'; $col !== 'O'; $col++) $sheet->getColumnDimension($col)->setAutoSize(true);

            //Add borders: HS
            $sheet->getStyle('A1:N' . $row)->applyFromArray(['borders' => ['allborders' => ['style' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_DOUBLE, 'color' => ['argb' => '0000']]]]);

            //Freeze first row
            $sheet->freezePane('A2');
        }

        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);

        //Return
        $response = new StreamedResponse(
            function () use ($writer) {
                $writer->save('php://output');
            }
        );
        $response->headers->set('Content-Type', 'application/vnd.ms-excel');
        $response->headers->set('Content-Disposition', 'attachment;filename="excel_suivis.xls"');
        $response->headers->set('Cache-Control', 'max-age=0');

        return $response;
    }

    /**
     * Generate and get document "attestation payment".
     * @SWG\Response(response=200, description="Returns document", @SWG\Schema(type="file"))
     * @Route("/{memberId}/attestation", methods={"GET"})
     */
    public function getAttestation(TranslatorInterface $translator, ParamService $paramService, int $memberId)
    {
        //Find member by id
        $member = $this->getDoctrine()->getRepository(Member::class)->findOneBy(['id' => $memberId]);
        if (!$member) return $this->handleView($this->view(["message" => $translator->trans('member_not_found')], Response::HTTP_NOT_FOUND));

        //Check if user is payed
        if (!$member->getIsPayed()) {
            return $this->handleView($this->view([
                'error' => [
                    'message' => $translator->trans('member_not_payed'),
                    'code' => Response::HTTP_FORBIDDEN
                ]
            ], Response::HTTP_FORBIDDEN));
        }

        $this->denyAccessUnlessGranted(Constants::READ, $member);

        $pdfOptions = new Options();
        $pdfOptions->set(['enable_remote' => true]);

        $dompdf = new Dompdf($pdfOptions);
        $dompdf->setBasePath(realpath(__DIR__ . '/../../public/'));

        $dompdf->loadHtml(
            $this->renderView('pdf/attestation.html.twig', [
                'member' => $member,
                'season' => $paramService->getCurrentSeason(),
                'president' => [
                    'firstname' => $paramService->getParam('president_firstname'),
                    'lastname' => $paramService->getParam('president_lastname')
                ]
            ])
        );
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        $dompdf->stream("Attestation_" . $member->getFirstname() . " " . $member->getLastname() . "_" . $paramService->getCurrentSeason()->getLabel(), ["Attachment" => true]);
    }

    /**
     * Get document.
     * @SWG\Response(response=200, description="Returns document", @SWG\Schema(type="file"))
     * @Route("/{memberId}/{documentCategoryId}", methods={"GET"})
     */
    public function downloadDocument(DownloadHandler $downloadHandler, TranslatorInterface $translator, int $memberId, int $documentCategoryId): Response
    {
        //Find member by id
        $member = $this->getDoctrine()->getRepository(Member::class)->findOneBy(['id' => $memberId]);
        if (!$member) return $this->handleView($this->view(["message" => $translator->trans('member_not_found')], Response::HTTP_NOT_FOUND));
        $this->denyAccessUnlessGranted(Constants::READ, $member);

        //Find document categoru by id
        $documentCategory = $this->getDoctrine()->getRepository(ParamDocumentCategory::class)->findOneBy(['id' => $documentCategoryId]);
        if (!$documentCategory) return $this->handleView($this->view(["message" => $translator->trans('not_found')], Response::HTTP_NOT_FOUND));

        //Return document
        $document = $this->getDoctrine()->getRepository(Document::class)->findOneBy(['member' => $member, 'category' => $documentCategory]);
        return $downloadHandler->downloadObject($document, 'documentFile', null, $document->getDocument()->getOriginalName(), false);
    }

    /**
     * Post Document.
     * @SWG\Parameter(name="file", in="formData", description="file", type="file")))
     * @SWG\Response(response=201, description="Returns Document created", @SWG\Schema(@Model(type=Member::class)))
     * @SWG\Response(response=400, description="Error in data")
     * @SWG\Response(response=404, description="Member or DocumentCategory not found")
     * @Rest\Post("/{memberId}/{documentCategoryId}")
     *
     * @return Response
     */
    public function postDocument(Request $request, TranslatorInterface $translator, int $memberId, int $documentCategoryId)
    {
        //Find member by id
        $member = $this->getDoctrine()->getRepository(Member::class)->findOneBy(['id' => $memberId]);
        if (!$member) return $this->handleView($this->view(["message" => $translator->trans('member_not_found')], Response::HTTP_NOT_FOUND));
        $this->denyAccessUnlessGranted(Constants::READ, $member);

        //Find document categoru by id
        $documentCategory = $this->getDoctrine()->getRepository(ParamDocumentCategory::class)->findOneBy(['id' => $documentCategoryId]);
        if (!$documentCategory) return $this->handleView($this->view(["message" => $translator->trans('not_found')], Response::HTTP_NOT_FOUND));

        //Save document
        $document = new Document();
        $form = $this->createForm(DocumentType::class, $document);
        $form->submit($request->files->all());

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            //Check if doc with current category for current user exists
            $docs = $this->getDoctrine()->getRepository(Document::class)->findBy(['member' => $member, 'category' => $documentCategory]);
            if ($docs) {
                foreach ($docs as $doc) $em->remove($doc);
                $em->flush();
            }

            $document->setMember($member);
            $document->setCategory($documentCategory);
            $em->persist($document);
            $em->flush();
            return $this->handleView($this->view($document, Response::HTTP_CREATED));
        }
        return $this->handleView($this->view($form->getErrors(), Response::HTTP_BAD_REQUEST));
    }

    /**
     * Delete Document.
     * @SWG\Response(response=200, description="Document deleted")
     * @SWG\Response(response=404, description="Member, DocumentCategory, or Member not found not found")
     * @Rest\Delete("/{memberId}/{documentCategoryId}")
     *
     * @return Response
     */
    public function deleteDocument(Request $request, TranslatorInterface $translator, int $memberId, int $documentCategoryId)
    {
        //Find member by id
        $member = $this->getDoctrine()->getRepository(Member::class)->findOneBy(['id' => $memberId]);
        if (!$member) return $this->handleView($this->view(["message" => $translator->trans('member_not_found')], Response::HTTP_NOT_FOUND));
        $this->denyAccessUnlessGranted(Constants::READ, $member);

        //Find document categoru by id
        $documentCategory = $this->getDoctrine()->getRepository(ParamDocumentCategory::class)->findOneBy(['id' => $documentCategoryId]);
        if (!$documentCategory) return $this->handleView($this->view(["message" => $translator->trans('not_found')], Response::HTTP_NOT_FOUND));

        //Find document
        $document = $this->getDoctrine()->getRepository(Document::class)->findOneBy(['member' => $member, 'category' => $documentCategory]);
        if (!$document) return $this->handleView($this->view(["message" => $translator->trans('document_not_found')], Response::HTTP_NOT_FOUND));

        $em = $this->getDoctrine()->getManager();
        $em->remove($document);
        $em->flush();
        return $this->handleView($this->view([]));
    }
}
