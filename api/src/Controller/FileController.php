<?php

namespace App\Controller;

use Dompdf\Dompdf;
use Dompdf\Options;
use App\Constants;
use App\Entity\Document;
use App\Entity\Member;
use App\Entity\ParamDocumentCategory;
use App\Entity\ParamGlobal;
use App\Form\DocumentType;
use App\Form\MemberMajorType;
use App\Form\MemberMinorType;
use App\Service\DateService;
use App\Service\PriceService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Contracts\Translation\TranslatorInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\Validator\Constraints\Image;
use Vich\UploaderBundle\Handler\DownloadHandler;

/**
 * Member controller.
 * @Route("/api/document", name="api_")
 */
class FileController extends FOSRestController
{
    /**
     * Post Document.
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

    /**
     * Generate and get document "attestation payement".
     * @Route("/{memberId}/attestation")
     */
    public function getAttestation(TranslatorInterface $translator, int $memberId)
    {
        //Find member by id
        $member = $this->getDoctrine()->getRepository(Member::class)->findOneBy(['id' => $memberId]);
        if (!$member) return $this->handleView($this->view(["message" => $translator->trans('member_not_found')], Response::HTTP_NOT_FOUND));
        $this->denyAccessUnlessGranted(Constants::READ, $member);

        $paramGlobalRepository = $this->getDoctrine()->getRepository(ParamGlobal::class);

        $pdfOptions = new Options();
        $pdfOptions->set(['enable_remote' => true]);

        $dompdf = new Dompdf($pdfOptions);
        $dompdf->setBasePath(realpath(__DIR__ . '/../../public/'));

        $dompdf->loadHtml(
            $this->renderView('pdf/attestation.html.twig', [
                'member' => $member,
                'president' => [
                    'firstname' => $paramGlobalRepository->findOneBy(['label' => 'president_firstname'])->getValue(),
                    'lastname' => $paramGlobalRepository->findOneBy(['label' => 'president_lastname'])->getValue()
                ]
            ])
        );
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        $dompdf->stream("Attestation_".$member->getFirstname() ." ". $member->getLastname()."_2020-2021.pdf", ["Attachment" => true]);
    }

    /**
     * Get document.
     * @Route("/{memberId}/{documentCategoryId}")
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
}
