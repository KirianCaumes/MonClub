<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;

class MainController extends AbstractController
{
    /**
     * @Route("/static/{folder}/{filename}", requirements={"el"="[0-9a-z_.]*"}, methods={"GET"})
     */
    public function static(string $folder, string $filename)
    {
        $file = __DIR__ . "../../../public/app/static/" . $folder . "/" . $filename;
        if (file_exists($file)) {
            $response = new Response(file_get_contents($file));
            $response->headers->set('Content-Type', \Defr\PhpMimeType\MimeType::get($file));
            return $response;
        } else {
            return new Response("App Not Found.");
        }
    }

    /**
     * @Route("/{filename}", name="index", requirements={"filename"="^(?!api).+"}, defaults={"filename": null}, methods={"GET"})
     */
    public function index(?string $filename)
    {
        if ($filename && file_exists(__DIR__ . "../../../public/app/" . $filename)) {
            $response = new BinaryFileResponse(__DIR__ . "../../../public/app/".$filename);
            $response->headers->set('Content-Type', \Defr\PhpMimeType\MimeType::get(__DIR__ . "../../../public/app/".$filename));
            return $response;
        } else {
            if (file_exists(__DIR__ . "../../../public/app/index.html")) {
                $response = new Response(file_get_contents(__DIR__ . "../../../public/app/index.html"));
                $response->headers->set('Content-Type', \Defr\PhpMimeType\MimeType::get(__DIR__ . "../../../public/app/index.html"));
                return $response;
            } else {
                return new Response("App Not Found.");
            }
        }
    }
}
