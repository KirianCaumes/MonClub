<?php

namespace App\Service\Generator;

use App\Entity\Member;
use App\Service\ParamService;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Service to generate CSV files
 */
class CsvService
{
    private $em;
    private $paramService;

    public function __construct(EntityManagerInterface $em, ParamService $paramService)
    {
        $this->em = $em;
        $this->paramService = $paramService;
    }

    //Generate CSV for Google Contact
    public function generateCsvGoogleContact() {
        $fp = fopen('php://output', 'w');

        $head = ['Name', 'Given Name', 'Additional Name', 'Family Name', 'Yomi Name', 'Given Name Yomi', 'Additional Name Yomi', 'Family Name Yomi', 'Name Prefix', 'Name Suffix', 'Initials', 'Nickname', 'Short Name', 'Maiden Name', 'Birthday', 'Gender', 'Location', 'Billing Information', 'Directory Server', 'Mileage', 'Occupation', 'Hobby', 'Sensitivity', 'Priority', 'Subject', 'Notes', 'Language', 'Photo', 'Group Membership', 'E-mail 1 - Type', 'E-mail 1 - Value', 'E-mail 2 - Type', 'E-mail 2 - Value', 'E-mail 3 - Type', 'E-mail 3 - Value', 'E-mail 4 - Type', 'E-mail 4 - Value', 'Phone 1 - Type', 'Phone 1 - Value', 'Phone 2 - Type', 'Phone 2 - Value', 'Phone 3 - Type', 'Phone 3 - Value', 'Address 1 - Type', 'Address 1 - Formatted', 'Address 1 - Street', 'Address 1 - City', 'Address 1 - PO Box', 'Address 1 - Region', 'Address 1 - Postal Code', 'Address 1 - Country', 'Address 1 - Extended Address', 'Website 1 - Type', 'Website 1 - Value'];

        $members = $this->em->getRepository(Member::class)->findBy(['season' => $this->paramService->getCurrentSeason()]);

        fputcsv($fp, $head);

        foreach ($members as $member) {
            $data = [];
            foreach ($head as $row) $data[$row] = null;
            $data['Name'] = ucwords($member->getFirstName()) . ' ' . ucwords($member->getLastName());
            $data['Given Name'] = ucwords($member->getFirstName());
            $data['Family Name'] = ucwords($member->getLastName());
            $data['Birthday'] = $member->getBirthdate() ? $member->getBirthdate()->format('d/m/Y') : null;
            $data['Gender'] = $member->getSex() ? $member->getSex()->getLabel() : null;
            $data['Group Membership'] = (function () use ($member) {
                $teams = [];
                foreach ($member->getTeams() as $team) array_push($teams, $team->getLabelGoogleContact());
                return implode(' ::: ', $teams);
            })();
            $data['E-mail 1 - Type'] = 'Emails';
            $data['E-mail 1 - Value'] = (function () use ($member) {
                $mails = array_filter([$member->getEmail(), $member->getParentOneEmail(), $member->getParentTwoEmail()]);
                return implode('>,<', $mails);
            })();
            $data['E-mail 2 - Type'] = 'Membre';
            $data['E-mail 2 - Value'] = $member->getEmail();
            $data['E-mail 3 - Type'] = 'Parent 1';
            $data['E-mail 3 - Value'] = $member->getParentOneEmail();
            $data['E-mail 4 - Type'] = 'Parent 2';
            $data['E-mail 4 - Value'] = $member->getParentTwoEmail();
            $data['Phone 1 - Type'] = 'Membre';
            $data['Phone 1 - Value'] = $member->getPhoneNumber();
            $data['Phone 2 - Type'] = 'Parent 1';
            $data['Phone 2 - Value'] = $member->getParentOnePhoneNumber();
            $data['Phone 3 - Type'] = 'Parent 2';
            $data['Phone 3 - Value'] = $member->getParentTwoPhoneNumber();
            $data['Address 1 - Street'] = $member->getStreet();
            $data['Address 1 - City'] = $member->getCity();
            $data['Address 1 - Postal Code'] = $member->getPostalCode();


            fputcsv($fp, $data);
        }
        return $fp;
    }

}
