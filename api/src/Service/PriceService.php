<?php

namespace App\Service;

use App\Entity\Member;
use App\Entity\Param\ParamPriceLicense;
use App\Entity\Param\ParamPriceTransfer;
use App\Entity\Param\ParamReductionFamily;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Service to get price to pay
 */
class PriceService
{
    private $em;
    private $dateService;
    private $paramService;
    public function __construct(EntityManagerInterface $em, DateService $dateService, ParamService $paramService)
    {
        $this->em = $em;
        $this->dateService = $dateService;
        $this->paramService = $paramService;
    }

    /**
     * Calcul price for a given member
     */
    public function getPrice(Member $member)
    {
        $birthYear = (int) $member->getBirthdate()->format('Y');
        $age = $this->dateService->getAge($birthYear);
        $priceDeadline = $this->paramService->getParam('price_deadline');
        $price = 0;

        //Get price license
        if ($member->getIsReducedPrice()) {
            if ((new \DateTime() <= (new \DateTime($priceDeadline)))) {
                $price += $this->paramService->getParam('reduced_price_before_deadline');
            } else {
                $price += $this->paramService->getParam('reduced_price_after_deadline');
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
        $members = $this->em->getRepository(Member::class)->findBy(['user' => $member->getUser(), 'season' => $this->paramService->getCurrentSeason()]);
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
        if (!$members) return ['each' => [], 'total' => null];
        $prices = [];
        $total = 0;
        foreach ($members as $member) {
            array_push($prices, [
                'id' => $member->getId(),
                'name' => ucwords($member->getLastName()) . ' ' . ucwords($member->getFirstName()),
                'price' => $this->getPrice($member),
                'price_other' => $member->getAmountPayedOther()
            ]);
            $total += $this->getPrice($member);
        }

        $total -= $this->em->getRepository(ParamReductionFamily::class)->findOneBy(['number' => sizeof($members)])->getDiscount();

        return ['each' => $prices, 'total' => $total];
    }
}
