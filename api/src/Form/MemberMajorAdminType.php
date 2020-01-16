<?php

namespace App\Form;

use App\Entity\Member;
use App\Entity\ParamPaymentSolution;
use App\Entity\ParamSeason;
use App\Entity\ParamSex;
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
use Symfony\Component\Validator\Constraints\Callback;
use Symfony\Component\Validator\Constraints\GreaterThanOrEqual;
use Symfony\Component\Validator\Constraints\LessThan;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Type;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

class MemberMajorAdminType extends AbstractType
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
            ->add('is_document_complete')
            ->add('is_payed')
            ->add('amount_payed', NumberType::class, [
                'scale' => 2,
                'constraints' => [
                    new Type([
                        'type' => 'float',
                    ]),
                    new GreaterThanOrEqual([
                        'value' => 0,
                    ]),
                    new LessThan([
                        'value' => 1000
                    ])
                ],
            ])
            ->add('amount_payed_other', NumberType::class, [
                'scale' => 2,
                'constraints' => [
                    new Type([
                        'type' => 'float',
                    ]),
                    new GreaterThanOrEqual([
                        'value' => 0,
                    ]),
                    new LessThan([
                        'value' => 1000
                    ])
                ],
            ])            
            ->add('is_check_gest_hand')
            ->add('is_inscription_done', CheckboxType::class, [
                'constraints' => [
                    new Callback([$this, 'checkIsInscriptionDone'])
                ]
            ])
            ->add('gesthand_is_photo')
            ->add('gesthand_is_photo_id')
            ->add('gesthand_is_certificate')
            ->add('gesthand_certificate_date', DateTimeType::class, [
                'widget' => 'single_text',
                'format' => 'yyyy-MM-dd',
            ])
            ->add('gesthand_is_health_questionnaire')
            ->add('gesthand_is_ffhb_authorization')
            ->add('gesthand_qualification_date', DateTimeType::class, [
                'widget' => 'single_text',
                'format' => 'yyyy-MM-dd',
            ])
            ->add('creation_datetime', DateTimeType::class, [
                'disabled' => true,
            ])
            ->add('notes')
            ->add('sex', EntityType::class, [
                'class' => ParamSex::class
            ])
            ->add('payment_solution', EntityType::class, [
                'class' => ParamPaymentSolution::class,
            ])
            ->add('user', EntityType::class, [
                'class' => User::class
            ])
            ->add('teams', EntityType::class, [
                'class' => Team::class,
                'multiple' => true
            ])
            ->add('season', EntityType::class, [
                'class' => ParamSeason::class,
                'constraints' => [
                    new NotBlank(['message' => 'not_blank']),
                ]
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

    public static function checkIsInscriptionDone($is_inscription_done, ExecutionContextInterface $context, $payload)
    {
        $root = $context->getRoot();
        if ($root instanceof \Symfony\Component\Form\Form) {
            $is_document_complete = $root->getViewData()->getIsDocumentComplete();
            $is_payed = $root->getViewData()->getIsPayed();
            $is_check_gest_hand = $root->getViewData()->getIsCheckGestHand();
            if ($is_inscription_done && (!$is_document_complete || !$is_payed || !$is_check_gest_hand)) {
                $context->buildViolation('invalid_is_inscription_done')->atPath('is_inscription_done')->addViolation();
            }
        }
    }
}
