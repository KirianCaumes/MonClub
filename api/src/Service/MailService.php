<?php

namespace App\Service;

use App\Entity\Member;
use App\Entity\User;
use Twig\Environment;

/**
 * Service to handle mail
 */
class MailService
{
    protected $swiftMailer;
    protected $mailer;

    public function __construct(\Swift_Mailer $swiftMailer, Environment $twig)
    {
        $this->swiftMailer = $swiftMailer;
        $this->twig = $twig;
        $this->baseUrl = "";
        switch ($_ENV['APP_ENV']) {
            case 'dev':
                $this->baseUrl = $_ENV['FRONT_URL_DEV'];
                break;
            case 'staging':
                $this->baseUrl = $_ENV['FRONT_URL_STAGING'];
                break;
            case 'prod':
                $this->baseUrl = $_ENV['FRONT_URL_PROD'];
                break;
            default:
                break;
        }
    }

    /**
     * Handle sending email
     */
    private function send(string $to, string $subject, string $body)
    {
        //Use smtp google if localhost
        if ($_ENV['APP_ENV'] === 'dev') {
            return $this->swiftMailer->send(
                (new \Swift_Message())
                    ->setContentType('text/html')
                    ->setFrom('inscription@thouarehbc.fr')
                    ->setSubject($subject . ' - MonClub THBC')
                    ->setTo($to)
                    ->setBody($body)
            );
        }

        return mail(
            $to,
            $subject . ' - MonClub THBC',
            $body,
            "From: Mon Club - THBC <inscription@thouarehbc.fr>\r\n" .
                "Reply-To: inscription@thouarehbc.fr" . "\r\n" .
                "Content-Type: text/html; charset=UTF-8" . "\r\n" .
                "X-Mailer: PHP/" . phpversion()
        );
    }

    /**
     * Send an email to reset password.
     */
    public function sendReset(User $user)
    {
        return $this->send(
            $user->getEmail(),
            'Réinitialisation de votre mot de passe',
            $this->twig->render('/mail/resetPassword.html.twig', [
                'token' => $user->getConfirmationToken(),
                'user' => $user,
                'baseUrl' => $this->baseUrl
            ])
        );
    }

    /**
     * Send an email to remind unfinished member.
     */
    public function sendMemberReminder(User $user)
    {
        return $this->send(
            $user->getEmail(),
            'Vous avez des membres en attente',
            $this->twig->render('/mail/membersReminder.html.twig', [
                'user' => $user,
                'baseUrl' => $this->baseUrl
            ])
        );
    }
    
    /**
     * Send an email to notice inscription is validated by the club
     */
    public function sendInscriptionDone(User $user, Member $member)
    {
        return $this->send(
            $user->getEmail(),
            'Votre inscription à été validée',
            $this->twig->render('/mail/membersInscriptionDone.html.twig', [
                'user' => $user,
                'member' => $member,
                'baseUrl' => $this->baseUrl
            ])
        );
    }
    
    /**
     * Send an email to remind unfinished member.
     */
    public function sendWarningEnableUser(User $user,$inactivityDate)
    {
        return $this->send(
            $user->getEmail(),
            'Attention votre compte sera désactivé',
            $this->twig->render('/mail/warningEnableUser.html.twig', [
                'user' => $user,
                'baseUrl' => $this->baseUrl,
                'inactivityDate' =>  $inactivityDate,
            ])
        );
    }
}
