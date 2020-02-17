<?php

namespace App\Service;

use App\Entity\Member;
use App\Entity\User;
use App\Service\Generator\PdfService;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

/**
 * Service to handle mail
 */
class MailService
{
    protected $pdfService;
    protected $mailer;

    public function __construct(PdfService $pdfService, MailerInterface $mailer)
    {
        $this->mailer = $mailer;
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
    private function send(
        string $to = "mail@mail.com",
        string $subject  = null,
        array $body = ['template' => '_base.html.twig', 'context' => []],
        array $attachment = ['file' => null, 'name' => null, 'type' => null]
    ) {
        $mail = new PHPMailer(true);

        try {
            //Recipients
            $mail->setFrom('inscription@thouarehbc.fr', 'test', 0);
            $mail->addAddress("kirian.caumes@gmail.com");

            // Attachments
            // $mail->addAttachment('/tmp/image.jpg', 'new.jpg');
            $mail->isMail();

            // Content
            $mail->isHTML(true);                                  // Set email format to HTML
            $mail->Subject = $subject . ' - MonClub THBC';
            $mail->Body    = 'This is the HTML message body <b>in bold!</b>';

            $mail->send();
            return 'Message has been sent';
        } catch (\Exception $e) {
            throw $e;
        }




        // $email = (new TemplatedEmail())
        //     ->from('inscription@thouarehbc.fr')
        //     ->to($to)
        //     ->subject($subject . ' - MonClub THBC')
        //     ->htmlTemplate('/mail/' . $body['template'])
        //     ->context($body['context']);

        // if ($attachment['file']) $email->attach($attachment['file'], $attachment['name'], $attachment['type']);

        // return $this->mailer->send($email);
    }

    /**
     * Send an email to reset password.
     */
    public function sendReset(User $user)
    {
        return $this->send(
            $user->getEmail(),
            'Réinitialisation de votre mot de passe',
            [
                'template' => 'resetPassword.html.twig',
                'context' => [
                    'token' => $user->getConfirmationToken(),
                    'user' => $user,
                    'baseUrl' => $this->baseUrl
                ]
            ]
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
            [
                'template' => 'membersReminder.html.twig',
                'context' => [
                    'user' => $user,
                    'baseUrl' => $this->baseUrl
                ]
            ]
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
            [
                'template' => 'membersInscriptionDone.html.twig',
                'context' => [
                    'user' => $user,
                    'member' => $member,
                    'baseUrl' => $this->baseUrl
                ]
            ]
        );
    }

    /**
     * Send an email to notice the user that his documents are invalid
     */
    public function sendDocumentInvalid(User $user, Member $member)
    {
        return $this->send(
            $user->getEmail(),
            'Certains documents ne sont pas valides',
            [
                'template' => 'membersDocumentInvalid.html.twig',
                'context' => [
                    'user' => $user,
                    'member' => $member,
                    'baseUrl' => $this->baseUrl
                ]
            ]
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
            [
                'template' => 'warningEnableUser.html.twig',
                'context' => [
                    'user' => $user,
                    'baseUrl' => $this->baseUrl,
                    'inactivityDate' =>  $inactivityDate,
                ]
            ]
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
            [
                'template' => 'userCreatedByAdmin.html.twig',
                'context' => [
                    'token' => $user->getConfirmationToken(),
                    'user' => $user,
                    'baseUrl' => $this->baseUrl,
                ]
            ]
        );
    }

    /**
     * Send an to notice payment done
     */
    public function sendFacture(User $user, array $members)
    {
        return $this->send(
            $user->getEmail(),
            'Récapitulatif de votre inscription',
            [
                'template' => 'facture.html.twig',
                'context' => [
                    'user' => $user,
                    'baseUrl' => $this->baseUrl,
                ]
            ],
            ['file' => $this->pdfService->generateFacture($members, false), 'name' => 'récapitulatif.pdf', 'type' => 'application/pdf']
        );
    }

    /**
     * Send an email to remind user to renew the gesthand certificat.
     */
    public function sendMailRenewCertificate(User $user)
    {
        return $this->send(
            $user->getEmail(),
            'Avez-vous pensé à renouveler votre certificat médical ?',
            [
                'template' => 'renewCertificate.html.twig',
                'context' => [
                    'baseUrl' => $this->baseUrl,
                ]
            ]
        );
    }
}
