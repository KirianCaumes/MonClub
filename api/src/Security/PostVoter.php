<?php

namespace App\Security;

use App\Constants;
use App\Entity\Member;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

use Symfony\Component\Security\Core\Security;

class PostVoter extends Voter
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    protected function supports($attribute, $member)
    {
        if (!in_array($attribute, [Constants::READ, Constants::UPDATE])) return false;

        if (!$member instanceof Member) return false;

        return true;
    }

    protected function voteOnAttribute($attribute, $member, TokenInterface $token)
    {
        $user = $token->getUser();

        if (!$user instanceof User) return false;

        if ($this->security->isGranted('ROLE_ADMIN')) return true;

        switch ($attribute) {
            case Constants::READ:
                return $this->canView($member, $user);
            case Constants::UPDATE:
                return false;
        }

        throw new \LogicException('This code should not be reached!');
    }

    private function canView(Member $member, User $user)
    {
        if ($member->getUser() === $user) return true;

        if ($member->getUser() !== $user) return false;
    }
}
