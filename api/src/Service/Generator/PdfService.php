<?php

namespace App\Service\Generator;

use App\Constants;
use App\Entity\Member;
use App\Entity\Team;
use App\Service\ParamService;
use Doctrine\ORM\EntityManagerInterface;
use Dompdf\Dompdf;
use Dompdf\Options;
use Twig\Environment;

/**
 * Service to generate PDF files
 */
class PdfService
{
    private $paramService;
    private $twig;

    public function __construct(EntityManagerInterface $em, ParamService $paramService, Environment $twig)
    {
        $this->em = $em;
        $this->paramService = $paramService;
        $this->twig = $twig;
        $this->file = $this->getFile();
    }

    //Init pdf
    private function getFile()
    {
        $pdfOptions = new Options();
        $pdfOptions->set(['enable_remote' => true]);

        $dompdf = new Dompdf($pdfOptions);
        $dompdf->setBasePath(realpath(__DIR__ . '/../../../public/'));
        $dompdf->setPaper('A4', 'portrait');

        return $dompdf;
    }

    // Generate document "attestation payment".
    public function generateAttestation(Member $member)
    {
        $this->file->loadHtml(
            $this->twig->render('pdf/attestation.html.twig', [
                'member' => $member,
                'season' => $this->paramService->getCurrentSeason(),
                'president' => [
                    'firstname' => $this->paramService->getParam('president_firstname'),
                    'lastname' => $this->paramService->getParam('president_lastname')
                ]
            ])
        );

        $this->file->render();

        return $this->file->stream(
            "Attestation_" . $member->getFirstname() . " " . $member->getLastname() . "_" . $this->paramService->getCurrentSeason()->getLabel(),
            ["Attachment" => true]
        );
    }

    // Generate "lettre de non opposition".
    public function generateNonObjection(Member $member, String $address, String $club)
    {
        $this->file->loadHtml(
            $this->twig->render('pdf/nonObjection.html.twig', [
                'member' => $member,
                'address' => $address,
                'club' => $club,
                'civility' => $member->getSex()->getCivility(),
                'president' => [
                    'firstname' => $this->paramService->getParam('president_firstname'),
                    'lastname' => $this->paramService->getParam('president_lastname')
                ],
                'secretary' => [
                    'firstname' => $this->paramService->getParam('secretary_firstname'),
                    'lastname' => $this->paramService->getParam('secretary_lastname')
                ]
            ])
        );

        $this->file->render();

        return $this->file->stream(
            "Lettre-de-non-objection_" . $member->getFirstname() . " " . $member->getLastname() . "_" . $this->paramService->getCurrentSeason()->getLabel(),
            ["Attachment" => true]
        );
    }
}
