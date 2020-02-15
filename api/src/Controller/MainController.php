<?php

namespace App\Controller;

use App\Entity\Member;
use App\Entity\User;
use App\Service\DateService;
use App\Service\ParamService;
use App\Service\PriceService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MainController extends AbstractController
{
    /**
     * @Route("/debug", methods={"GET"})
     */
    public function debugPdf(ParamService $paramService, PriceService $priceService, DateService $dateService)
    {
        if ($_ENV['APP_ENV'] !== 'dev') return new Response("UNAUTHORIZED", Response::HTTP_UNAUTHORIZED);
        $user =  $this->getDoctrine()->getRepository(User::class)->findOneBy(['username' => 'kirian.caumes@gmail.com']);
        $members = $this->getDoctrine()->getRepository(Member::class)->findBy(['user' => $user, 'is_payed' => true, 'season' => $paramService->getCurrentSeason()]);
        $membersWithDetails = [];

        foreach ($members as $key => $member) {
            array_push($membersWithDetails, [
                'data' => $member,
                'basePrice' => $member->getIsReducedPrice() ? $priceService->getPriceReduced($member, true) : $priceService->getPriceBase($member, true),
                'transferPrice' => $member->getIsTransferNeeded() ? $priceService->getPriceTransferNeeded($member) : null,
                'familyReduc' => $priceService->getFamilyReduction($member),
                'age' => $dateService->getAge((int) $member->getBirthdate()->format('Y'))
            ]);
        }

        return $this->render('pdf/facture.html.twig', [
            'user' => $user,
            'members' => $membersWithDetails,
            'paypalFee' => intval($paramService->getParam('paypal_fee')),
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
            // 'club' => null,
            // 'address' => null,
            // 'civility' => null,
            // 'member' => new Member(),
            // 'president' => new Member(),
            // 'secretary' => new Member(),
        ]);
    }

    /**
     * @Route("/static/{folder}/{filename}", requirements={"filename"="[0-9a-z_.]*"}, methods={"GET"})
     */
    public function static(string $folder, string $filename)
    {
        $prefix = in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1']) ? __DIR__ . "../../../public/" : '';
        $file = $prefix . "app/static/" . $folder . "/" . $filename;
        if (file_exists($file)) {
            $response = new Response(file_get_contents($file));
            $response->headers->set('Content-Type', \Defr\PhpMimeType\MimeType::get($file));
            return $response;
        } else {
            return new Response("App Not Found.");
        }
    }

    /**
     * @Route("/{filename}", name="index", requirements={"filename"="^(?!api).+"}, defaults={"filename": null}, methods={"GET"})
     */
    public function index(?string $filename)
    {
        $prefix = in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1']) ? __DIR__ . "../../../public/" : '';
        if ($filename && file_exists($prefix . "app/" . $filename)) {
            $response = new Response(file_get_contents($prefix . "app/" . $filename));
            $response->headers->set('Content-Type', \Defr\PhpMimeType\MimeType::get($prefix . "app/" . $filename));
            return $response;
        } else {
            if (file_exists($prefix . "app/index.html")) {
                $response = new Response(file_get_contents($prefix . "app/index.html"));
                $response->headers->set('Content-Type', \Defr\PhpMimeType\MimeType::get($prefix . "app/index.html"));
                return $response;
            } else {
                return new Response("App Not Found.");
            }
        }
    }
}
