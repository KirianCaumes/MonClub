<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTExpiredEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTInvalidEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTNotFoundEvent;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Translation\TranslatorInterface;

class JWTListener
{
    protected $translator;

    public function __construct(TranslatorInterface $translator)
    {
        $this->translator = $translator;
    }

    /**
     * @param JWTInvalidEvent $event
     */
    public function onJWTInvalid(JWTInvalidEvent $event)
    {
        $event->setResponse(new JsonResponse([
            'error' => [
                'message' => $this->translator->trans('token_invalid'),
                'code' => Response::HTTP_UNAUTHORIZED
            ]
        ], Response::HTTP_UNAUTHORIZED));
    }

    /**
     * @param JWTNotFoundEvent $event
     */
    public function onJWTNotFound(JWTNotFoundEvent $event)
    {
        $event->setResponse(new JsonResponse([
            'error' => [
                'message' => $this->translator->trans('token_missing'),
                'code' => Response::HTTP_UNAUTHORIZED
            ]
        ], Response::HTTP_UNAUTHORIZED));
    }

    /**
     * @param JWTExpiredEvent $event
     */
    public function onJWTExpired(JWTExpiredEvent $event)
    {
        $event->setResponse(new JsonResponse([
            'error' => [
                'message' => $this->translator->trans('token_expired'),
                'code' => Response::HTTP_UNAUTHORIZED
            ]
        ], Response::HTTP_UNAUTHORIZED));
    }
}
