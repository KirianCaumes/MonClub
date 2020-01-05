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
use App\Service\ParamService;
use App\Service\PriceService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Contracts\Translation\TranslatorInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\StreamedResponse;
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
     * Generate and get csv for GoogleContact.
     * @IsGranted("ROLE_ADMIN")
     * @Route("/google-contact")
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
     * Generate and get document "attestation payment".
     * @Route("/{memberId}/attestation")
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
