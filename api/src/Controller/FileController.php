<?php

namespace App\Controller;

use App\Constants;
use App\Entity\Document;
use App\Entity\Member;
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
     * @Rest\Post("/")
     *
     * @return Response
     */
    public function postDocument(Request $request, TranslatorInterface $translator)
    {
        $document = new Document();
        $form = $this->createForm(DocumentType::class, $document);
        $form->submit($request->files->all());

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($document);
            $em->flush();
            return $this->handleView($this->view($document, Response::HTTP_CREATED));
        }
        return $this->handleView($this->view($form->getErrors(), Response::HTTP_BAD_REQUEST));
    }
    
    /**
     * Get document.
     * @Route("/{id}")
     */
    public function downloadImageAction(DownloadHandler $downloadHandler, int $id): Response
    {
        $document = $this->getDoctrine()->getRepository(Document::class)->findOneBy(['id' => $id]);        
        return $downloadHandler->downloadObject($document, 'documentFile', null, $document->getDocument()->getOriginalName(), false);
    }
}
