<?php

namespace App\Form;

use App\Entity\Member;
use App\Entity\ParamDocumentCategory;
use App\Entity\Team;
use App\Entity\User;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;

class MemberMajorType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('firstname')
            ->add('lastname')
            ->add('birthdate', DateType::class, [
                'widget' => 'single_text',
                'format' => 'yyyy-MM-dd',
            ])
            ->add('email', EmailType::class, [
                'constraints' => [
                    new NotBlank(['message' => 'not_blank']),
                ]
            ])
            ->add('phone_number', TextType::class, [
                'constraints' => [
                    new NotBlank(['message' => 'not_blank']),
                ]
            ])
            ->add('postal_code')
            ->add('street')
            ->add('city')
            ->add('profession')
            ->add('parent_one_firstname', TextType::class, [
                'disabled' => true,
            ])
            ->add('parent_one_lastname', TextType::class, [
                'disabled' => true,
            ])
            ->add('parent_one_email', TextType::class, [
                'disabled' => true,
            ])
            ->add('parent_one_phone_number', TextType::class, [
                'disabled' => true,
            ])
            ->add('parent_one_profession', TextType::class, [
                'disabled' => true,
            ])
            ->add('parent_two_firstname', TextType::class, [
                'disabled' => true,
            ])
            ->add('parent_two_lastname', TextType::class, [
                'disabled' => true,
            ])
            ->add('parent_two_email', TextType::class, [
                'disabled' => true,
            ])
            ->add('parent_two_phone_number', TextType::class, [
                'disabled' => true,
            ])
            ->add('parent_two_profession', TextType::class, [
                'disabled' => true,
            ])
            ->add('is_evacuation_allow')
            ->add('is_transport_allow')
            ->add('is_image_allow')
            ->add('is_return_home_allow', CheckboxType::class, [
                'disabled' => true,
            ])
            ->add('is_newsletter_allow')
            ->add('is_accepted')
            ->add('is_reduced_price')
            ->add('is_non_competitive')
            ->add('is_transfer_needed')
            ->add('is_document_complete', CheckboxType::class, [
                'disabled' => true,
            ])
            ->add('is_payed', CheckboxType::class, [
                'disabled' => true,
            ])
            ->add('amount_payed', NumberType::class, [
                'disabled' => true,
            ])
            ->add('is_check_gest_hand', CheckboxType::class, [
                'disabled' => true,
            ])
            ->add('is_inscription_done', CheckboxType::class, [
                'disabled' => true,
            ])            
            ->add('creation_datetime', DateTimeType::class, [
                'disabled' => true,
            ])
            ->add('payment_solution', EntityType::class, [
                'class' => ParamDocumentCategory::class,
                'disabled' => true,
            ])
            ->add('user', EntityType::class, [
                'class' => User::class,
                'disabled' => true,
            ])
            ->add('teams', EntityType::class, [
                'class' => Team::class,
                'multiple' => true,
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
