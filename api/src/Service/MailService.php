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
        return $this->mailer->send(
            (new \Swift_Message('Hello Email'))
                ->setFrom($this->from)
                // ->setTo($user->getEmail())
                ->setTo('kirian.caumes@gmail.com')
                ->setBody($this->twig->render('/mail/resetPassword.html.twig', ['token' => $user->getConfirmationToken()]))
        );
    }
}
