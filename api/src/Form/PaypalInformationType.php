<?php

namespace App\Form;

use App\Entity\PaypalInformation;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PaypalInformationType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('id_payment')
            ->add('creation_datetime', DateTimeType::class, [
                'widget' => 'single_text',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ])
            ->add('amount')
            ->add('currency')
            ->add('email')
            ->add('country')
            ->add('firstname')
            ->add('lastname')
            ->add('data')
            ->add('save', SubmitType::class);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => PaypalInformation::class,
            'csrf_protection' => false,
        ]);
    }
}
