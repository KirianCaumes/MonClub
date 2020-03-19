<?php

namespace App\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class Birthdate extends Constraint
{
    public $tooYoung = 'invalid_birthdate_too_youg';
    public $tooOld = 'invalid_birthdate_too_old';
}