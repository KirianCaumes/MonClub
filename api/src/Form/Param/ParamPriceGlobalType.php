<?php

namespace App\Form;

use App\Entity\ActivityHistory;
use App\Entity\Document;
use App\Entity\Param\ParamPriceGlobal;
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

class ParamPriceGlobalType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('reduced_price_before_deadline', IntegerType::class, [
                'constraints' => [
                    new GreaterThanOrEqual(['value' => 0]),
                    new LessThan(['value' => 1000])
                ],
            ])
            ->add('reduced_price_after_deadline', IntegerType::class, [
                'constraints' => [
                    new GreaterThanOrEqual(['value' => 0]),
                    new LessThan(['value' => 1000])
                ],
            ])
            ->add('deadline_date', DateTimeType::class, [
                'widget' => 'single_text',
                'format' => 'yyyy-MM-dd',
            ])
            ->add('paypal_fee', IntegerType::class, [
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
            'data_class' => ParamPriceGlobal::class,
            'csrf_protection' => false,
            'allow_extra_fields' => true
        ]);
    }
}
