<?php

namespace App\Validator\Constraints;

use App\Entity\Param\ParamPriceLicense;
use App\Entity\Param\ParamPriceTransfer;
use App\Service\DateService;
use App\Service\ParamService;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class BirthdateValidator extends ConstraintValidator
{
    private $em;
    private $paramService;
    private $dateService;
    private $translatorInterface;

    public function __construct(EntityManagerInterface $em, ParamService $paramService, DateService $dateService, TranslatorInterface $translatorInterface)
    {
        $this->em = $em;
        $this->paramService = $paramService;
        $this->dateService = $dateService;
        $this->translatorInterface = $translatorInterface;
    }

    public function validate($value, Constraint $constraint)
    {
        if (!$constraint instanceof Birthdate) throw new UnexpectedTypeException($constraint, Birthdate::class);

        if (null === $value || '' === $value) return;

        if (!$value instanceof \DateTime) throw new UnexpectedValueException($value, 'DateTime');

        $member = $this->context->getObject();

        $currentSeason = $member->getSeason() ? $member->getSeason() : $this->paramService->getCurrentSeason();

        $paramPriceLicense = $this->em->getRepository(ParamPriceLicense::class)->findOneByYearInterval(
            (int) $value->format('Y'),
            $currentSeason
        );

        $paramPriceTransfer = $this->em->getRepository(ParamPriceTransfer::class)->findOneByAgeInterval(
            $this->dateService->getAge((int) $value->format('Y')),
            $currentSeason
        );

        if (!$paramPriceLicense || !$paramPriceTransfer) {
            $this->context
                ->buildViolation(
                    $this->translatorInterface->trans(
                        $this->dateService->isMajor($value->format('Y-m-d')) ?
                            $constraint->tooOld :
                            $constraint->tooYoung
                    )
                )
                ->setParameter('{{ date }}', $value->format('d/m/Y'))
                ->addViolation();
        }
    }
}
