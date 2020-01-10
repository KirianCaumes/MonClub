<?php

namespace App\Service;

/**
 * Service to manipulate Date
 */
class DateService
{
    public function __construct()
    { }

    /**
     * Check if str is date
     */
    public function isDate(string $str)
    {
        if (\DateTime::createFromFormat('Y-m-d', $str)) {
            return true;
        }
        return false;
    }

    /**
     * Check if someone is major by his date string 
     */
    public function isMajor(string $str)
    {
        if ((new \DateTime())->format('Y') - (new \DateTime($str))->format('Y') >= 18) {
            return true;
        } else {
            return false;
        }
    }
    

    /**
     * Get age  
     */
    public function getAge(int $birthYear)
    {
        return (new \DateTime())->format('Y') - $birthYear;
    }
}
