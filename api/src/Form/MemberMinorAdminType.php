<?php

namespace App\Form;

use App\Entity\Member;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;

class MemberMinorAdminType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('firstname')
            ->add('lastname')
            ->add('birthdate', DateTimeType::class, [
                'widget' => 'single_text',
                'format' => 'yyyy-MM-dd',
            ])
            ->add('email', EmailType::class, [
                'required' => false,
            ])
            ->add('phone_number', TextType::class, [
                'required' => false,
            ])
            ->add('profession', TextType::class, [
                'required' => false,
            ])
            ->add('parent_one_firstname', TextType::class, [
                'constraints' => [
                    new NotBlank(['message' => 'not_blank']),
                ]
            ])
            ->add('parent_one_lastname', TextType::class, [
                'constraints' => [
                    new NotBlank(['message' => 'not_blank']),
                ]
            ])
            ->add('parent_one_email', TextType::class, [
                'constraints' => [
                    new NotBlank(['message' => 'not_blank']),
                ]
            ])
            ->add('parent_one_phone_number', TextType::class, [
                'constraints' => [
                    new NotBlank(['message' => 'not_blank']),
                ]
            ])
            ->add('parent_one_profession', TextType::class, [
                'required' => false
            ])
            ->add('parent_two_firstname', TextType::class, [
                'required' => false
            ])
            ->add('parent_two_lastname', TextType::class, [
                'required' => false
            ])
            ->add('parent_two_email', TextType::class, [
                'required' => false
            ])
            ->add('parent_two_phone_number', TextType::class, [
                'required' => false
            ])
            ->add('parent_two_profession', TextType::class, [
                'required' => false
            ])
            ->add('is_evacuation_allow', CheckboxType::class)
            ->add('is_transport_allow', CheckboxType::class)
            ->add('is_image_allow', CheckboxType::class)
            ->add('is_return_home_allow', CheckboxType::class)
            ->add('is_accepted', CheckboxType::class)
            ->add('is_reduced_price', CheckboxType::class)
            ->add('is_transfer_needed', CheckboxType::class)
            ->add('is_payed', CheckboxType::class)
            ->add('is_document_complete', CheckboxType::class)
            ->add('amount_payed', IntegerType::class, [
                'disabled' => true,
            ])
            ->add('is_check_gest_hand', CheckboxType::class)
            ->add('is_inscription_done', CheckboxType::class)
            ->add('creation_datetime', DateTimeType::class, [
                'disabled' => true,
            ])
            ->add('save', SubmitType::class);
    }
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Member::class,
            'csrf_protection' => false,
            'allow_extra_fields' => true
        ]);
    }
}
