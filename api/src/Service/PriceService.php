<?php

namespace App\Service;

use App\Entity\Member;
use App\Entity\ParamGlobal;
use App\Entity\ParamPriceLicense;
use App\Entity\ParamPriceTransfer;
use App\Entity\ParamReductionFamily;
use Doctrine\ORM\EntityManagerInterface;

class PriceService
{
    private $em;
    private $dateService;
    public function __construct(EntityManagerInterface $em, DateService $dateService)
    {
        $this->em = $em;
        $this->dateService = $dateService;
    }

    /**
     * Calcul price for a given member
     */
    public function getPrice(Member $member)
    {
        $birthYear = (int) $member->getBirthdate()->format('Y');
        $age = $this->dateService->getAge($birthYear);
        $paramGlobalRepository = $this->em->getRepository(ParamGlobal::class);
        $priceDeadline = $paramGlobalRepository->findOneBy(['label' => 'price_deadline'])->getValue();
        $price = 0;

        //Get price license
        if ($member->getIsReducedPrice()) {
            if ((new \DateTime() <= (new \DateTime($priceDeadline)))) {
                $price += $paramGlobalRepository->findOneBy(['label' => 'reduced_price_before_deadline'])->getValue();
            } else {
                $price += $paramGlobalRepository->findOneBy(['label' => 'reduced_price_after_deadline'])->getValue();
            }
        } else { //Else : normal case
            $paramPriceLicense = $this->em->getRepository(ParamPriceLicense::class)->findOneByYearInterval($birthYear);
            if ((new \DateTime() <= (new \DateTime($priceDeadline)))) {
                if ($paramPriceLicense) $price += $paramPriceLicense->getPriceBeforeDeadline();
            } else {
                if ($paramPriceLicense) $price += $paramPriceLicense->getPriceAfterDeadline();
            }
        }

        //Check if transfer needed
        if ($member->getIsTransferNeeded()) {
            $price += $this->em->getRepository(ParamPriceTransfer::class)->findOneByAgeInterval($age)->getPrice();
        }

        //Check families reduction
        $members = $this->em->getRepository(Member::class)->findBy(['user' => $member->getUser()]);
        $position = 1;
        foreach ($members as $key => $mbr) {
            if ($mbr === $member) {
                $position = $key + 1;
                break;
            }
        }
        $reducFamily = $this->em->getRepository(ParamReductionFamily::class)->findOneBy(['number' => $position]);
        if ($reducFamily) {
            $price -= $reducFamily->getDiscount();
        }

        return $price;
    }

    /**
     * Calcul price for a list of members
     */
    public function getPrices(array $members)
    {
        $prices = [];
        $total = 0;
        foreach ($members as $member) {
            array_push($prices, ['name' => ucwords($member->getLastName()) . ' ' . ucwords($member->getFirstName()), 'price' => $this->getPrice($member)]);
            $total += $this->getPrice($member);
        }

        $total -= $this->em->getRepository(ParamReductionFamily::class)->findOneBy(['number' => sizeof($members)])->getDiscount();

        return ['each' => $prices, 'total' => $total];
    }
}
