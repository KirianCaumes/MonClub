<?php

namespace App\Form;

use App\Entity\ActivityHistory;
use App\Entity\Document;
use App\Entity\Param\ParamPriceGlobal;
use App\Entity\Param\ParamReductionFamily;
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
use Symfony\Component\Validator\Constraints\NotBlank;

class ParamReductionFamilyType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('number', IntegerType::class, [
                'constraints' => [
                    new GreaterThanOrEqual(['value' => 0]),
                    new LessThan(['value' => 1000])
                ],
            ])
            ->add('discount', IntegerType::class, [
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
            'data_class' => ParamReductionFamily::class,
            'csrf_protection' => false,
            'allow_extra_fields' => true
        ]);
    }
}
