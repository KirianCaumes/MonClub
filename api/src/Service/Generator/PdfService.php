<?php

namespace App\Service\Generator;

use App\Constants;
use App\Entity\Member;
use App\Entity\Param\ParamPriceGlobal;
use App\Entity\Team;
use App\Entity\User;
use App\Service\DateService;
use App\Service\ParamService;
use App\Service\PriceService;
use Doctrine\ORM\EntityManagerInterface;
use Dompdf\Dompdf;
use Dompdf\Options;
use Twig\Environment;
use Twig\Extra\Intl\IntlExtension;

/**
 * Service to generate PDF files
 */
class PdfService
{
    private $paramService;
    private $twig;

    public function __construct(EntityManagerInterface $em, ParamService $paramService, Environment $twig, PriceService $priceService, DateService $dateService)
    {
        $this->em = $em;
        $this->paramService = $paramService;
        $this->twig = $twig;
        $this->priceService = $priceService;
        $this->dateService = $dateService;
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

    // Generate document "facture".
    public function generateFacture(array $members)
    {
        // $this->twig->addExtension(new IntlExtension());

        $membersWithDetails = [];

        foreach ($members as $key => $member) {
            array_push($membersWithDetails, [
                'data' => $member,
                'basePrice' => $member->getIsReducedPrice() ? $this->priceService->getPriceReduced($member, true) : $this->priceService->getPriceBase($member, true),
                'transferPrice' => $member->getIsTransferNeeded() ? $this->priceService->getPriceTransferNeeded($member) : null,
                'familyReduc' => $this->priceService->getFamilyReduction($member),
                'age' => $this->dateService->getAge((int) $member->getBirthdate()->format('Y'))
            ]);
        }

        $this->file->loadHtml(
            $this->twig->render('pdf/facture.html.twig', [
                'user' => $members[0]->getUser(),
                'members' => $membersWithDetails,
                'paypalFee' => $this->em->getRepository(ParamPriceGlobal::class)->findOneBy(['season' => $this->paramService->getCurrentSeason()])->getPaypalFee(),
                'total' => (function () use ($members) {
                    return array_sum(array_map(function ($member) {
                        return $member->getAmountPayed();
                    }, $members));
                })(),
                'totalOther' => (function () use ($members) {
                    return array_sum(array_map(function ($member) {
                        return $member->getAmountPayedOther();
                    }, $members));
                })()
            ])
        );

        $this->file->render();

        return $this->file->output();
    }
}
