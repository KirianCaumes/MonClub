<?php

namespace App\Security;

use App\Constants;
use App\Entity\Member;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

use Symfony\Component\Security\Core\Security;

class PostVoter extends Voter
{
    private $security;
    private $em;

    public function __construct(Security $security, EntityManagerInterface $em)
    {
        $this->security = $security;
        $this->em = $em;
    }

    protected function supports($attribute, $member)
    {
        if (!in_array($attribute, [Constants::CREATE, Constants::CREATE_ADMIN, Constants::READ, Constants::UPDATE, Constants::DELETE])) return false;

        if (!$member instanceof Member) return false;

        return true;
    }

    protected function voteOnAttribute($attribute, $member, TokenInterface $token)
    {
        $user = $token->getUser();

        if (!$user instanceof User) return false;

        switch ($attribute) {
            case Constants::CREATE:
                return $this->canCreate($member, $user);
            case Constants::CREATE_ADMIN:
                return $this->canCreateAdmin($member, $user);
            case Constants::READ:
                return $this->canRead($member, $user);
            case Constants::UPDATE:
                return $this->canUpdate($member, $user);
            case Constants::DELETE:
                return $this->canDelete($member, $user);
        }

        throw new \LogicException('This code should not be reached!');
    }

    private function canCreate(Member $member, User $user)
    {
        if (sizeof($this->em->getRepository(Member::class)->findBy(['user' => $user])) >= 4) return false;

        return true;
    }

    private function canCreateAdmin(Member $member, User $user)
    {         
        return true;
    }

    private function canRead(Member $member, User $user)
    {
        if ($this->security->isGranted('ROLE_ADMIN')) return true;

        if ($member->getUser() === $user) return true;

        return false;
    }

    private function canUpdate(Member $member, User $user)
    {
        if ($this->security->isGranted('ROLE_ADMIN')) return true;

        if ($member->getUser() === $user) return true;

        return false;
    }

    private function canDelete(Member $member, User $user)
    {
        if ($member->getIsPayed()) return false; //Can't delete a member if he is payed

        if ($member->getUser() === $user) return true;

        return false;
    }
}
