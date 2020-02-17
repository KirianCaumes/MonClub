<?php

namespace App\Service;

use App\Entity\Member;
use App\Entity\User;
use App\Service\Generator\PdfService;
use PHPMailer\PHPMailer\PHPMailer;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Twig\Environment;

/**
 * Service to handle mail
 */
class MailService
{
    protected $pdfService;
    protected $twig;
    protected $parameterBag;
    private $logger;

    public function __construct(PdfService $pdfService, Environment $twig, ParameterBagInterface $parameterBag, LoggerInterface $logger)
    {
        $this->pdfService = $pdfService;
        $this->twig = $twig;
        $this->parameterBag = $parameterBag;
        $this->logger = $logger;
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
        $mail->CharSet = 'UTF-8';

        try {            
            if ($_ENV['APP_ENV'] === 'dev') {
                $mail->isSMTP();
                //Use smtp Google for dev env
                // $mail->SMTPDebug = 1;
                $mail->SMTPAuth = true;
                $mail->SMTPSecure = 'ssl';
                $mail->Host = "smtp.gmail.com";
                $mail->Port = 465;
                $mail->Username = $_ENV['GMAIL_USERNAME'];
                $mail->Password = $_ENV['GMAIL_PASSWORD'];
            } else {
                //Use Php's mail function for staging/prod
                $mail->isMail();
            }

            $mail->setFrom('monclub@thouarehbc.fr', 'Mon Club - THBC');
            $mail->addAddress($to);

            if ($attachment['file']) $mail->addStringAttachment($attachment['file'], $attachment['name'], 'base64', $attachment['type']);

            $mail->AddEmbeddedImage($this->parameterBag->get('kernel.project_dir') . "/public/img/logo_mail.png", "logo_mail", "thbc.png");

            $mail->isHTML(true);
            $mail->Subject = $subject . ' - MonClub THBC';
            $mail->Body = $this->twig->render('/mail/' . $body['template'], array_merge($body['context'], ['baseUrl' => $_ENV['FRONT_URL']]));

            return $mail->send();
        } catch (\Exception $e) {
            $this->logger->critical($e);
        }
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
                    'user' => $user
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
                    'user' => $user
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
                    'member' => $member
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
                    'member' => $member
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
                'context' => []
            ]
        );
    }
}
