<?php

namespace App\Service;

use App\Entity\User;
use Twig\Environment;

class MailService
{
    protected $mailer;
    protected $twig;
    protected $from;

    public function __construct(\Swift_Mailer $mailer,  Environment $twig)
    {
        $this->mailer = $mailer;
        $this->twig = $twig;
        $this->from = 'monclub@thouarehbc.fr';
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
     * Send an email to reset password.
     */
    public function sendReset(User $user)
    {
        return $this->mailer->send(
            (new \Swift_Message())
                ->setContentType('text/html')
                ->setFrom($this->from)
                ->setSubject('Réinitialisation de votre mot de passe - MonClub THBC')
                ->setTo($user->getEmail())
                ->setBody($this->twig->render('/mail/resetPassword.html.twig', [
                    'token' => $user->getConfirmationToken(),
                    'user' => $user,
                    'baseUrl' => $this->baseUrl
                ]))
        );
    }

    /**
     * Send an email to remind unfinished member.
     */
    public function sendMemberReminder(User $user)
    {
        return $this->mailer->send(
            (new \Swift_Message())
                ->setContentType('text/html')
                ->setFrom($this->from)
                ->setSubject('Vous avez des membres en attente - MonClub THBC')
                ->setTo($user->getEmail())
                ->setBody($this->twig->render('/mail/membersReminder.html.twig', [
                    'user' => $user,
                    'baseUrl' => $this->baseUrl
                ]))
        );
    }
}
