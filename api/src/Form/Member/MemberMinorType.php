<?php

namespace App\Form\Member;

use App\Entity\Member;
use App\Entity\Param\ParamPaymentSolution;
use App\Entity\Param\ParamSeason;
use App\Entity\Param\ParamSex;
use App\Entity\PaypalInformation;
use App\Entity\Team;
use App\Entity\User;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;

class MemberMinorType extends AbstractType
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
            ->add('email')
            ->add('phone_number')
            ->add('postal_code')
            ->add('street')
            ->add('city')
            ->add('profession')
            ->add('parent_one_firstname', TextType::class, [
                'constraints' => [new NotBlank(['message' => 'not_blank'])]
            ])
            ->add('parent_one_lastname', TextType::class, [
                'constraints' => [new NotBlank(['message' => 'not_blank'])]
            ])
            ->add('parent_one_email', TextType::class, [
                'constraints' => [new NotBlank(['message' => 'not_blank'])]
            ])
            ->add('parent_one_phone_number', TextType::class, [
                'constraints' => [new NotBlank(['message' => 'not_blank'])]
            ])
            ->add('parent_one_profession')
            ->add('parent_two_firstname')
            ->add('parent_two_lastname')
            ->add('parent_two_email')
            ->add('parent_two_phone_number')
            ->add('parent_two_profession')
            ->add('is_evacuation_allow')
            ->add('is_transport_allow')
            ->add('is_image_allow')
            ->add('is_return_home_allow')
            ->add('is_newsletter_allow')
            ->add('is_accepted')
            ->add('is_reduced_price')
            ->add('is_non_competitive')
            ->add('is_transfer_needed')
            ->add('is_certificate', CheckboxType::class, [
                'disabled' => true,
            ])
            ->add('is_justificative', CheckboxType::class, [
                'disabled' => true,
            ])
            ->add('is_certificate_old')
            ->add('is_document_complete', CheckboxType::class, [
                'disabled' => true,
            ])
            ->add('is_payed', CheckboxType::class, [
                'disabled' => true,
            ])
            ->add('amount_payed', NumberType::class, [
                'disabled' => true,
            ])
            ->add('amount_payed_other', NumberType::class, [
                'disabled' => true,
            ])
            ->add('is_license_renewal')
            ->add('payment_notes', TextType::class, [
                'disabled' => true,
            ])
            ->add('is_check_gest_hand', CheckboxType::class, [
                'disabled' => true,
            ])
            ->add('is_inscription_done', CheckboxType::class, [
                'disabled' => true,
            ])
            ->add('gesthand_is_photo', CheckboxType::class, [
                'disabled' => true,
            ])
            ->add('gesthand_is_photo_id', CheckboxType::class, [
                'disabled' => true,
            ])
            ->add('gesthand_is_certificate', CheckboxType::class, [
                'disabled' => true,
            ])
            ->add('gesthand_certificate_date', DateTimeType::class, [
                'disabled' => true,
            ])
            ->add('gesthand_is_health_questionnaire', CheckboxType::class, [
                'disabled' => true,
            ])
            ->add('gesthand_is_ffhb_authorization', CheckboxType::class, [
                'disabled' => true,
            ])
            ->add('gesthand_qualification_date', DateTimeType::class, [
                'disabled' => true,
            ])
            ->add('creation_datetime', DateTimeType::class, [
                'disabled' => true,
            ])
            ->add('notes', TextType::class, [
                'disabled' => true,
            ])
            ->add('sex', EntityType::class, [
                'class' => ParamSex::class
            ])
            ->add('payment_solution', EntityType::class, [
                'class' => ParamPaymentSolution::class,
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
            ->add('season', EntityType::class, [
                'class' => ParamSeason::class,
                'disabled' => true,
            ])
            ->add('paypal_information', EntityType::class, [
                'class' => PaypalInformation::class,
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
