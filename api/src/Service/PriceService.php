<?php

namespace App\Service;

use App\Entity\Member;
use App\Entity\Param\ParamPriceGlobal;
use App\Entity\Param\ParamPriceLicense;
use App\Entity\Param\ParamPriceTransfer;
use App\Entity\Param\ParamReductionFamily;
use App\Entity\Param\ParamSeason;
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
        $this->currentParamGlobalPrice = $this->em->getRepository(ParamPriceGlobal::class)->findOneBy(['season' => $this->paramService->getCurrentSeason()]);
        $this->currentSeason = $this->paramService->getCurrentSeason();
    }

    /**
     * Calcul price for a given member
     */
    public function getPrice(Member $member, ParamSeason $season = null, bool $useCreationDt = false)
    {
        //Overide default season if provided
        if ($season) {
            $this->currentSeason = $season;
            $this->currentParamGlobalPrice = $this->em->getRepository(ParamPriceGlobal::class)->findOneBy(['season' => $season]);
        }
        $price = 0;

        //Get price license
        if ($member->getIsReducedPrice()) {
            $price += $this->getPriceReduced($member, $useCreationDt);
        } else { //Else : normal case
            $price += $this->getPriceBase($member, $useCreationDt);
        }

        //Check if transfer needed
        if ($member->getIsTransferNeeded()) {
            $price += $this->getPriceTransferNeeded($member);
        }

        //Check families reduction
        $price -= $this->getFamilyReduction($member);

        return $price;
    }

    /**
     * Get position from member 
     */
    public function getPosition(Member $member): int
    {
        $members = $this->em->getRepository(Member::class)->findBy(['user' => $member->getUser(), 'season' => $member->getSeason()], ['id' => 'ASC']);
        foreach ($members as $key => $mbr) {
            if ($mbr === $member) {
                return $key;
            }
        }
        return null;
    }

    /**
     * Get price for a price reduced member 
     */
    public function getPriceReduced(Member $member, bool $useCreationDt = false): int
    {
        if (
            ($useCreationDt ? $member->getCreationDatetime() : new \DateTime())
            <=
            $this->currentParamGlobalPrice->getDeadlineDate()
        ) {
            return $this->currentParamGlobalPrice->getReducedPriceBeforeDeadline();
        } else {
            return $this->currentParamGlobalPrice->getReducedPriceAfterDeadline();
        }
    }

    /**
     * Get price for a price reduced member 
     */
    public function getPriceBase(Member $member, bool $useCreationDt = false): int
    {
        $paramPriceLicense = $this->em->getRepository(ParamPriceLicense::class)->findOneByYearInterval(
            (int) $member->getBirthdate()->format('Y'),
            $this->currentSeason
        );
        if (
            ($useCreationDt ? $member->getCreationDatetime() : new \DateTime())
            <=
            $this->currentParamGlobalPrice->getDeadlineDate()
        ) {
            return $paramPriceLicense->getPriceBeforeDeadline();
        } else {
            return $paramPriceLicense->getPriceAfterDeadline();
        }
    }

    /**
     * Get price for a transfer needed member 
     */
    public function getPriceTransferNeeded(Member $member): int
    {
        $val = $this->em->getRepository(ParamPriceTransfer::class)->findOneByAgeInterval(
            $this->dateService->getAge((int) $member->getBirthdate()->format('Y')),
            $this->currentSeason
        );
        if ($val) return $val->getPrice();
        return 0;
    }

    /**
     * Get price for a transfer needed member 
     */
    public function getFamilyReduction(Member $member): int
    {
        $val = $this->em->getRepository(ParamReductionFamily::class)->findOneBy(['number' => ($this->getPosition($member) + 1), 'season' => $this->currentSeason]);
        if ($val) return $val->getDiscount();
        return 0;
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

        $total -= $this->em->getRepository(ParamReductionFamily::class)->findOneBy(['number' => sizeof($members), 'season' => $this->paramService->getCurrentSeason()])->getDiscount();

        return ['each' => $prices, 'total' => $total];
    }
}
