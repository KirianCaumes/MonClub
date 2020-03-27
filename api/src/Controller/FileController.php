<?php

namespace App\Controller;

use Dompdf\Dompdf;
use Dompdf\Options;
use App\Constants;
use App\Entity\Document;
use App\Entity\Member;
use App\Entity\Param\ParamDocumentCategory;
use App\Entity\Team;
use App\Form\DocumentType;
use App\Service\Generator\CsvService;
use App\Service\Generator\ExcelService;
use App\Service\Generator\PdfService;
use App\Service\ParamService;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\Controller\Annotations\QueryParam;
use Symfony\Component\Routing\Annotation\Route;
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
class FileController extends AbstractFOSRestController
{
    /**
     * Generate and get csv for GoogleContact.
     * @SWG\Response(response=200, description="Returns CSV", @SWG\Schema(type="file"))
     * @IsGranted("ROLE_ADMIN")
     * @Route("/google/contact", methods={"GET"})
     */
    public function getGoogleContact(CsvService $csvService)
    {
        $response = new StreamedResponse(
            function () use ($csvService) {
                return $csvService->generateCsvGoogleContact();
            }
        );

        return $response;
    }

    /**
     * Generate and get Excel with tracking informations.
     * @SWG\Response(response=200, description="Returns Xlsx", @SWG\Schema(type="file"))
     * @IsGranted("ROLE_ADMIN")
     * @Route("/excel/tracking", methods={"GET"})
     */
    public function getExcelTracking(ExcelService $excelService)
    {
        $response = new StreamedResponse(
            function () use ($excelService) {
                $excelService->generateExcelSuivis()->save('php://output');
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
    public function getExcelGeneral(ExcelService $excelService)
    {
        $response = new StreamedResponse(
            function () use ($excelService) {
                $excelService->generateExcelGeneral()->save('php://output');
            }
        );
        $response->headers->set('Content-Type', 'application/vnd.ms-excel');
        $response->headers->set('Content-Disposition', 'attachment;filename="excel_general.xls"');
        $response->headers->set('Cache-Control', 'max-age=0');

        return $response;
    }

    /**
     * Generate and get excel 'calculhand v3'.
     * @SWG\Response(response=200, description="Returns Xlsx", @SWG\Schema(type="file"))
     * @IsGranted("ROLE_ADMIN")
     * @Route("/excel/calculhand", methods={"GET"})
     */
    public function getExcelCalculHand(ExcelService $excelService)
    {
        $response = new StreamedResponse(
            function () use ($excelService) {
                $excelService->generateExcelCalculhand()->save('php://output');
            }
        );
        $response->headers->set('Content-Type', 'application/vnd.ms-excel');
        $response->headers->set('Content-Disposition', 'attachment;filename="excel_general.xls"');
        $response->headers->set('Cache-Control', 'max-age=0');

        return $response;
    }

    /**
     * Generate and get document "attestation payment".
     * @SWG\Response(response=200, description="Returns document", @SWG\Schema(type="file"))
     * @Route("/{memberId}/attestation", methods={"GET"})
     */
    public function getAttestation(TranslatorInterface $translator, PdfService $pdfService, int $memberId)
    {
        //Find member by id
        $member = $this->getDoctrine()->getRepository(Member::class)->findOneBy(['id' => $memberId]);
        if (!$member) return $this->handleView($this->view(["message" => $translator->trans('member_not_found')], Response::HTTP_NOT_FOUND));
        
        $this->denyAccessUnlessGranted(Constants::READ_DOCUMENT, $member);

        // Check if user is payed
        if (!$member->getIsPayed() || !$member->getIsInscriptionDone()) {
            return $this->handleView($this->view([
                'error' => [
                    'message' => $translator->trans('member_not_payed_or_done'),
                    'code' => Response::HTTP_FORBIDDEN
                ]
            ], Response::HTTP_FORBIDDEN));
        }

        // $this->denyAccessUnlessGranted(Constants::READ, $member);

        $response = new StreamedResponse(
            function () use ($pdfService, $member) {
                $pdfService->generateAttestation($member, $_ENV['APP_ENV'] !== 'test');
            }
        );

        return $response;
    }

    /**
     * Generate and get document "lettre de non opposition".
     * @QueryParam(name="address", nullable=true, description="String of address")
     * @QueryParam(name="club", nullable=true, description="Club name")
     * @SWG\Response(response=200, description="Returns document", @SWG\Schema(type="file"))
     * @Route("/{memberId}/non-objection", methods={"GET"})
     */
    public function getNonObjection(TranslatorInterface $translator, ParamFetcher $paramFetcher, PdfService $pdfService, int $memberId)
    {
        //Find member by id
        $member = $this->getDoctrine()->getRepository(Member::class)->findOneBy(['id' => $memberId]);
        if (!$member) return $this->handleView($this->view(["message" => $translator->trans('member_not_found')], Response::HTTP_NOT_FOUND));

        $this->denyAccessUnlessGranted(Constants::READ_DOCUMENT, $member);

        $response = new StreamedResponse(
            function () use ($pdfService, $member, $paramFetcher) {
                $pdfService->generateNonObjection($member, $paramFetcher->get('address'), $paramFetcher->get('club'), $_ENV['APP_ENV'] !== 'test');
            }
        );

        return $response;
    }

    /**
     * Generate and get document "récapitulatif".
     * @SWG\Response(response=200, description="Returns document", @SWG\Schema(type="file"))
     * @Route("/{memberId}/facture", methods={"GET"})
     */
    public function getFacture(TranslatorInterface $translator, PdfService $pdfService, int $memberId)
    {
        //Find member by id
        $member = $this->getDoctrine()->getRepository(Member::class)->findOneBy(['id' => $memberId]);
        if (!$member) return $this->handleView($this->view(["message" => $translator->trans('member_not_found')], Response::HTTP_NOT_FOUND));

        $this->denyAccessUnlessGranted(Constants::READ_DOCUMENT, $member);

        $response = new StreamedResponse(
            function () use ($pdfService, $member) {
                $pdfService->generateFacture([$member], $_ENV['APP_ENV'] !== 'test');
            }
        );

        return $response;
    }

    /**
     * Get document.
     * @deprecated No longer used : no more document are uploaded.
     * @SWG\Response(response=200, description="Returns document", @SWG\Schema(type="file"))
     * @Route("/{memberId}/{documentCategoryId}", methods={"GET"})
     */
    public function downloadDocument(DownloadHandler $downloadHandler, TranslatorInterface $translator, int $memberId, int $documentCategoryId): Response
    {
        //Find member by id
        $member = $this->getDoctrine()->getRepository(Member::class)->findOneBy(['id' => $memberId]);
        if (!$member) return $this->handleView($this->view(["message" => $translator->trans('member_not_found')], Response::HTTP_NOT_FOUND));
        
        $this->denyAccessUnlessGranted(Constants::READ_DOCUMENT, $member);

        //Find document category by id
        $documentCategory = $this->getDoctrine()->getRepository(ParamDocumentCategory::class)->findOneBy(['id' => $documentCategoryId]);
        if (!$documentCategory) return $this->handleView($this->view(["message" => $translator->trans('not_found')], Response::HTTP_NOT_FOUND));

        //Return document
        $document = $this->getDoctrine()->getRepository(Document::class)->findOneBy(['member' => $member, 'category' => $documentCategory]);
        if (!$document) return $this->handleView($this->view(["message" => $translator->trans('document_not_found')], Response::HTTP_NOT_FOUND));

        return $downloadHandler->downloadObject($document, 'documentFile', null, $document->getDocument()->getOriginalName(), false);
    }

    /**
     * Post Document.
     * @deprecated No longer used : no more document are uploaded.
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
        
        $this->denyAccessUnlessGranted(Constants::READ_DOCUMENT, $member);

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
     * @deprecated No longer used : no more document are uploaded.
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
        
        $this->denyAccessUnlessGranted(Constants::READ_DOCUMENT, $member);

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
