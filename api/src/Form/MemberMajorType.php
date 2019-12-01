<?php

namespace App\Form;

use App\Entity\Member;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
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
                'invalid_message' => 'invalid_date',
                'widget' => 'single_text',
                'format' => 'yyyy-MM-dd',
            ])
            ->add('email', EmailType::class, [
                'invalid_message' => 'invalid_email',
                'constraints' => [
                    new NotBlank(['message' => 'not_blank']),
                ]
            ])
            ->add('phone_number', TextType::class, [
                'constraints' => [
                    new NotBlank(['message' => 'not_blank']),
                ]
            ])
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
            ->add('is_payed', CheckboxType::class, [
                'disabled' => true,
            ])
            ->add('price', IntegerType::class, [
                'disabled' => true,
            ])
            ->add('is_accepted')
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
