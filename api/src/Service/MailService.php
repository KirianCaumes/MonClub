<?php

namespace App\Service;

use App\Entity\Member;
use App\Entity\User;
use App\Service\Generator\PdfService;
use Swift_Attachment;
use Swift_ByteStream_ArrayByteStream;
use Twig\Environment;

/**
 * Service to handle mail
 */
class MailService
{
    protected $swiftMailer;
    protected $pdfService;

    public function __construct(\Swift_Mailer $swiftMailer, Environment $twig, PdfService $pdfService)
    {
        $this->swiftMailer = $swiftMailer;
        $this->twig = $twig;
        $this->pdfService = $pdfService;
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
    private function send(string $to, string $subject, string $body, $attachment = null)
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
                    ->attach($attachment)
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
     * Send an email to notice the user that his documents are invalid
     */
    public function sendDocumentInvalid(User $user, Member $member)
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
     * Send an email to warn user to be disabled.
     */
    public function sendWarningEnableUser(User $user, $inactivityDate)
    {
        return $this->send(
            $user->getEmail(),
            'Votre compte risque d\'être désactivé',
            $this->twig->render('/mail/warningEnableUser.html.twig', [
                'user' => $user,
                'baseUrl' => $this->baseUrl,
                'inactivityDate' =>  $inactivityDate,
            ])
        );
    }

    /**
     * Send an email to let user know accout created by admin.
     */
    public function sendUserCreatedByAdmin(User $user)
    {
        return $this->send(
            $user->getEmail(),
            'Création de votre compte',
            $this->twig->render('/mail/userCreatedByAdmin.html.twig', [
                'token' => $user->getConfirmationToken(),
                'user' => $user,
                'baseUrl' => $this->baseUrl,
            ])
        );
    }
    

    /**
     * Send an to notice payment done
     */
    public function sendFacture(User $user)
    {
        return $this->send(
            $user->getEmail(),
            'Réinitialisation de votre mot de passe',
            $this->twig->render('/mail/resetPassword.html.twig', [
                'user' => $user,
                'baseUrl' => $this->baseUrl
            ]),
            new Swift_Attachment($this->pdfService->generateFacture(), 'facture.pdf', 'application/pdf')
        );
    }

    /**
     * Send an email to remind user to renew the gesthand certificat.
     */
    public function sendWarningGesthandCertificat(Member $member,$gesthandCertifDate)
    {
        return $this->mailer->send(
            (new \Swift_Message())
                ->setContentType('text/html')
                ->setFrom($this->from)
                ->setSubject('Renouvellement de votre certificat Gesthand - MonClub THBC')
                ->setTo($member->getEmail())
                ->setBody($this->twig->render('/mail/renouvellementCertif.html.twig', [
                    'user' => $member,
                    'baseUrl' => $this->baseUrl,
                    'gesthandCertifDate' =>  $gesthandCertifDate,
                ]))
        );
    }
}
