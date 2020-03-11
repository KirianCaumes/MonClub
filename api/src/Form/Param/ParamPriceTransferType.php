<?php

namespace App\Form\Param;

use App\Entity\ActivityHistory;
use App\Entity\Document;
use App\Entity\Param\ParamPriceGlobal;
use App\Entity\Param\ParamPriceTransfer;
use App\Entity\Param\ParamSeason;
use App\Entity\User;
use JMS\Serializer\Annotation\Type;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\GreaterThanOrEqual;
use Symfony\Component\Validator\Constraints\LessThan;

class ParamPriceTransferType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('label')
            ->add('price', IntegerType::class, [
                'constraints' => [
                    new GreaterThanOrEqual(['value' => 0]),
                    new LessThan(['value' => 1000])
                ],
            ])
            ->add('min_age', IntegerType::class, [
                'constraints' => [
                    new GreaterThanOrEqual(['value' => 0]),
                    new LessThan(['value' => 1000])
                ],
            ])
            ->add('max_age', IntegerType::class, [
                'constraints' => [
                    new GreaterThanOrEqual(['value' => 0]),
                    new LessThan(['value' => 1000])
                ],
            ])
            ->add('season', EntityType::class, [
                'class' => ParamSeason::class,
                'disabled' => true,
            ])
            ->add('save', SubmitType::class);
    }
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => ParamPriceTransfer::class,
            'csrf_protection' => false,
            'allow_extra_fields' => true
        ]);
    }
}
