<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MainController extends AbstractController
{
    /**
     * @Route("/static/{folder}/{filename}", requirements={"filename"="[0-9a-z_.]*"}, methods={"GET"})
     */
    public function static(string $folder, string $filename)
    {
        $prefix = (array_key_exists('REMOTE_ADDR', $_SERVER) && in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1']) || $_ENV['APP_ENV'] === 'test') ? __DIR__ . "../../../public/" : '';
        $file = $prefix . "app/static/" . $folder . "/" . $filename;
        if (file_exists($file)) {
            $response = new Response(file_get_contents($file));
            $response->headers->set('Content-Type', \Defr\PhpMimeType\MimeType::get($file));
            return $response;
        } else {
            return new Response("App Not Found.", Response::HTTP_NOT_FOUND);
        }
    }

    /**
     * @Route("/{filename}", name="index", requirements={"filename"="^(?!api).+"}, defaults={"filename": null}, methods={"GET"})
     */
    public function index(?string $filename)
    {
        $prefix = (array_key_exists('REMOTE_ADDR', $_SERVER) && in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1']) || $_ENV['APP_ENV'] === 'test') ? __DIR__ . "../../../public/" : '';
        if ($filename && file_exists($prefix . "app/" . $filename)) {
            $response = new Response(file_get_contents($prefix . "app/" . $filename));
            $response->headers->set('Content-Type', \Defr\PhpMimeType\MimeType::get($prefix . "app/" . $filename));
            return $response;
        } else {
            if (file_exists($prefix . "app/index.html")) {
                $response = new Response(file_get_contents($prefix . "app/index.html"));
                $response->headers->set('Content-Type', \Defr\PhpMimeType\MimeType::get($prefix . "app/index.html"));
                return $response;
            } else {
                return new Response("App Not Found.", Response::HTTP_NOT_FOUND);
            }
        }
    }
}
