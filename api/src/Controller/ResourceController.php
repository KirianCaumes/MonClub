<?php

namespace App\Controller;

use App\Constants;
use App\Entity\ActivityHistory;
use App\Entity\Member;
use App\Entity\Param\ParamDocumentCategory;
use App\Entity\Param\ParamGlobal;
use App\Entity\Param\ParamPaymentSolution;
use App\Entity\Param\ParamPriceGlobal;
use App\Entity\Param\ParamPriceLicense;
use App\Entity\Param\ParamPriceTransfer;
use App\Entity\Param\ParamReductionFamily;
use App\Entity\Param\ParamSeason;
use App\Entity\Param\ParamSex;
use App\Entity\Param\ParamWorkflow;
use App\Entity\Team;
use App\Entity\User;
use App\Form\ActivityHistoricType;
use App\Form\Param\ParamPriceGlobalType;
use App\Form\Param\ParamPriceLicenseType;
use App\Form\Param\ParamPriceTransferType;
use App\Form\Param\ParamReductionFamilyType;
use App\Service\ParamService;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\Controller\Annotations as Rest;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use Symfony\Bundle\MakerBundle\Validator;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Translation\TranslatorInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Param controller.
 * @SWG\Parameter(name="Authorization", in="header", required=true, type="string", default="Bearer ", description="Bearer token")
 * @SWG\Tag(name="Resource")
 * @Route("/api/resource", name="api_")
 */
class ResourceController extends AbstractFOSRestController
{

    /**
     * Get email from members whome have accepted newsletter.
     * @SWG\Response(response=200, description="Mail list", @SWG\Schema(type="array"))
     * @Rest\Get("/mail-newsletter")
     *
     * @return Response
     */
    public function getEmailForNewsletter(ParamService $paramService)
    {
        $members = $this->getDoctrine()->getRepository(Member::class)->findBy(['is_newsletter_allow' => 1, 'season' => $paramService->getCurrentSeason()]);;

        return $this->handleView($this->view(
            array_merge(...array_map(function ($member) {
                $res = [];
                if ($member->getEmail()) array_push($res, ['email' => $member->getEmail(), 'resetNewsletterToken' => $member->getResetNewsletterToken()]);
                if ($member->getParentOneEmail()) array_push($res, ['email' => $member->getParentOneEmail(), 'resetNewsletterToken' => $member->getResetNewsletterToken()]);
                if ($member->getParentTwoEmail()) array_push($res, ['email' => $member->getParentTwoEmail(), 'resetNewsletterToken' => $member->getResetNewsletterToken()]);
                return $res;
            }, $members)),
            Response::HTTP_OK
        ));
    }
}
