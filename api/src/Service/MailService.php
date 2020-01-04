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
        $this->from = 'sender@gmail.com';
    }

    /**
     * Send an email to reset password.
     */
    public function sendReset(User $user)
    {
        $baseUrl = "";
        switch ($_ENV['APP_ENV']) {
            case 'dev':
                $baseUrl = $_ENV['FRONT_URL_DEV'];
                break;
            case 'staging':
                $baseUrl = $_ENV['FRONT_URL_STAGING'];
                break;
            case 'prod':
                $baseUrl = $_ENV['FRONT_URL_PROD'];
                break;
            default:
                break;
        }

        return $this->mailer->send(
            (new \Swift_Message())
                ->setSubject('Réinitialisation de votre mot de passe - monclub.thourarehbc.fr')
                ->setFrom($this->from)
                ->setContentType('text/html')
                ->setTo($user->getEmail())
                ->setBody($this->twig->render('/mail/resetPassword.html.twig', [
                    'token' => $user->getConfirmationToken(),
                    'user' => $user,
                    'baseUrl' => $baseUrl
                ]))
        );
    }
}
