<?php

namespace App\Controller;

use App\Constants;
use App\Entity\ActivityHistory;
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
 * @SWG\Tag(name="Param")
 * @Route("/api/param", name="api_")
 */
class ParamController extends AbstractFOSRestController
{
    /**
     * Lists all Param Global.
     * @SWG\Response(response=200, description="Returns params", @SWG\Schema(@Model(type="object")))
     * @Rest\Get("")
     *
     * @return Response
     */
    public function getParam(ParamService $paramService)
    {
        //Create new historic entry
        $activityHistoric = new ActivityHistory();
        $form = $this->createForm(ActivityHistoricType::class, $activityHistoric);
        $form->submit(['date' => date('Y-m-d'), 'user' => $this->getUser()->getId()]);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($activityHistoric);
            $em->flush();
        }

        $currentSeason = $paramService->getCurrentSeason();

        return $this->handleView($this->view([
            'teams' => $this->getDoctrine()->getRepository(Team::class)->findall(),
            'workflowStep' => $this->getDoctrine()->getRepository(ParamWorkflow::class)->findall(),
            'global' => $this->getDoctrine()->getRepository(ParamGlobal::class)->findall(),
            'documentCategory' => $this->getDoctrine()->getRepository(ParamDocumentCategory::class)->findall(),
            'roles' => [
                ['key' => Constants::ROLE_SERVICE, 'text' => 'Service', 'icon' => 'PlayerSettings'],
                ['key' => Constants::ROLE_COACH, 'text' => 'Coach', 'icon' => 'AccountManagement'],
                ['key' => Constants::ROLE_ADMIN, 'text' => 'Admin', 'icon' => 'CRMServices'],
                ['key' => Constants::ROLE_SUPER_ADMIN, 'text' => 'Super Admin', 'icon' => 'PartyLeader']
            ],
            'choices' => [
                ['key' => 'true', 'text' => 'Oui', 'icon' => 'Accept'],
                ['key' => 'false', 'text' => 'Non', 'icon' => 'Cancel']
            ],
            'sexes' => $this->getDoctrine()->getRepository(ParamSex::class)->findall(),
            'price' => [
                'global' => $this->getDoctrine()->getRepository(ParamPriceGlobal::class)->findOneBy(['season' => $currentSeason]),
                'license' => $this->getDoctrine()->getRepository(ParamPriceLicense::class)->findBy(['season' => $currentSeason]),
                'transfer' => $this->getDoctrine()->getRepository(ParamPriceTransfer::class)->findBy(['season' => $currentSeason]),
                'discount' => $this->getDoctrine()->getRepository(ParamReductionFamily::class)->findBy(['season' => $currentSeason]),
                'payment_solution' => $this->getDoctrine()->getRepository(ParamPaymentSolution::class)->findall(),
            ],
            'season' => $this->getDoctrine()->getRepository(ParamSeason::class)->findAll(),
            'users' => (function () {
                $usrs = [];
                if ($this->isGranted(Constants::ROLE_ADMIN)) {
                    foreach ($this->getDoctrine()->getRepository(User::class)->findBy([], ['username' => 'ASC']) as $user) array_push($usrs, ['id' => $user->getId(), 'username' => $user->getUsername()]);
                }
                return $usrs;
            })()
        ]));
    }

    /**
     * Get param price by season.
     * @SWG\Response(response=200, description="Param edited")
     * @SWG\Response(response=404, description="ParamSeason not found")
     * @IsGranted("ROLE_SUPER_ADMIN")
     * @Rest\Get("/price/{seasonId}")
     *
     * @return Response
     */
    public function getPriceBySeason(Request $request, TranslatorInterface $translator, int $seasonId)
    {
        //Find season by id
        $season = $this->getDoctrine()->getRepository(ParamSeason::class)->findOneBy(['id' => $seasonId]);
        if (!$season) {
            return $this->handleView($this->view(["message" => $translator->trans('not_found')], Response::HTTP_NOT_FOUND));
        }

        $global = $this->getDoctrine()->getRepository(ParamPriceGlobal::class)->findOneBy(['season' => $season]);
        $license = $this->getDoctrine()->getRepository(ParamPriceLicense::class)->findBy(['season' => $season]);
        $transfer =  $this->getDoctrine()->getRepository(ParamPriceTransfer::class)->findBy(['season' => $season]);
        $discount =  $this->getDoctrine()->getRepository(ParamReductionFamily::class)->findBy(['season' => $season]);

        return $this->handleView($this->view(
            [
                'global' => $global ? $global : new ParamPriceGlobal(),
                'license' => $license ? $license : [new ParamPriceLicense()],
                'transfer' => $transfer ? $transfer : [new ParamPriceTransfer()],
                'discount' => $discount ? $discount : [new ParamReductionFamily()]
            ],
            Response::HTTP_OK
        ));
    }

    /**
     * Edit param price by season.
     * @SWG\Response(response=200, description="Param edited")
     * @SWG\Response(response=404, description="ParamSeason not found")
     * @IsGranted("ROLE_SUPER_ADMIN")
     * @Rest\Put("/price/{seasonId}")
     *
     * @return Response
     */
    public function putPriceBySeason(Request $request, TranslatorInterface $translator, int $seasonId)
    {
        //Find season by id
        $season = $this->getDoctrine()->getRepository(ParamSeason::class)->findOneBy(['id' => $seasonId]);
        if (!$season) {
            return $this->handleView($this->view(["message" => $translator->trans('not_found')], Response::HTTP_NOT_FOUND));
        }

        //Errors to be displayed
        $errors = [
            'global' => null,
            'license' => null,
            'transfer' => null,
            'discount' => null
        ];

        $data = json_decode($request->getContent(), true);

        //ParamPriceGlobal
        if (array_key_exists('id', $data['global']) && $data['global']['id']) {
            $paramPriceGlobal = $this->getDoctrine()->getRepository(ParamPriceGlobal::class)->findOneBy(['id' => $data['global']['id']]);
            $paramPriceGlobal->setSeason($season);
        } else {
            $paramPriceGlobal = new ParamPriceGlobal();
            $paramPriceGlobal->setSeason($season);
        }
        $form = $this->createForm(ParamPriceGlobalType::class, $paramPriceGlobal);
        $form->submit($data['global']);

        if ($form->isSubmitted() && !$form->isValid()) {
            $errors['global'] = $form->getErrors();
        }

        //ParamPriceLicense
        $paramPriceLicenseArray = [];
        foreach ($data['license'] as $key => $license) {
            if (array_key_exists('id', $license) && $license['id']) {
                $paramPriceLicense = $this->getDoctrine()->getRepository(ParamPriceLicense::class)->findOneBy(['id' => $license['id']]);
                $paramPriceLicense->setSeason($season);
            } else {
                $paramPriceLicense = new ParamPriceLicense();
                $paramPriceLicense->setSeason($season);
            }
            $form = $this->createForm(ParamPriceLicenseType::class, $paramPriceLicense);
            $form->submit($license);

            if ($form->isSubmitted() && !$form->isValid()) {
                $errors['license'] = $form->getErrors();
                $paramPriceLicenseArray = [];
                break;
            }
            array_push($paramPriceLicenseArray, $paramPriceLicense);
        }

        //ParamPriceTransfer        
        $paramPriceTransferArray = [];
        foreach ($data['transfer'] as $key => $transfer) {
            if (array_key_exists('id', $transfer) && $transfer['id']) {
                $paramPriceTransfer = $this->getDoctrine()->getRepository(ParamPriceTransfer::class)->findOneBy(['id' => $transfer['id']]);
                $paramPriceTransfer->setSeason($season);
            } else {
                $paramPriceTransfer = new ParamPriceTransfer();
                $paramPriceTransfer->setSeason($season);
            }
            $form = $this->createForm(ParamPriceTransferType::class, $paramPriceTransfer);
            $form->submit($transfer);

            if ($form->isSubmitted() && !$form->isValid()) {
                $errors['transfer'] = $form->getErrors();
                $paramPriceTransferArray = [];
                break;
            }
            array_push($paramPriceTransferArray, $paramPriceTransfer);
        }

        //ParamReductionFamily     
        $paramReductionFamilyArray = [];
        foreach ($data['discount'] as $key => $discount) {
            if (array_key_exists('id', $discount) && $discount['id']) {
                $paramReductionFamily = $this->getDoctrine()->getRepository(ParamReductionFamily::class)->findOneBy(['id' => $discount['id']]);
                $paramReductionFamily->setSeason($season);
            } else {
                $paramReductionFamily = new ParamReductionFamily();
                $paramReductionFamily->setSeason($season);
            }
            $form = $this->createForm(ParamReductionFamilyType::class, $paramReductionFamily);
            $form->submit($discount);

            if ($form->isSubmitted() && !$form->isValid()) {
                $errors['discount'] = $form->getErrors();
                $paramReductionFamilyArray = [];
                break;
            }
            array_push($paramReductionFamilyArray, $paramReductionFamily);
        }

        $paramReductionFamily =  $this->getDoctrine()->getRepository(ParamReductionFamily::class)->findBy(['season' => $season]);

        if ($errors['global'] !== null || $errors['license'] !== null  || $errors['transfer'] !== null || $errors['discount'] !== null) {
            return $this->handleView($this->view($errors, Response::HTTP_BAD_REQUEST));
        }

        $em = $this->getDoctrine()->getManager();

        //Clear
        foreach ($this->getDoctrine()->getRepository(ParamPriceGlobal::class)->findBy(['season' => $season]) as $paramPriceGlobal) $em->remove($paramPriceGlobal);
        foreach ($this->getDoctrine()->getRepository(ParamPriceLicense::class)->findBy(['season' => $season]) as $paramPriceLicense) $em->remove($paramPriceLicense);
        foreach ($this->getDoctrine()->getRepository(ParamPriceTransfer::class)->findBy(['season' => $season]) as $paramPriceTransfer) $em->remove($paramPriceTransfer);
        foreach ($this->getDoctrine()->getRepository(ParamReductionFamily::class)->findBy(['season' => $season]) as $paramReductionFamily) $em->remove($paramReductionFamily);
        $em->flush();

        //Save
        $em->persist($paramPriceGlobal);
        foreach ($paramPriceLicenseArray as $paramPriceLicense) $em->persist($paramPriceLicense);
        foreach ($paramPriceTransferArray as $paramPriceTransfer) $em->persist($paramPriceTransfer);
        foreach ($paramReductionFamilyArray as $paramReductionFamily) $em->persist($paramReductionFamily);
        $em->flush();

        return $this->handleView($this->view([
            'global' => $paramPriceGlobal,
            'license' => $paramPriceLicenseArray,
            'transfer' => $paramPriceTransferArray,
            'discount' => $paramReductionFamilyArray
        ], Response::HTTP_OK));
    }

    /**
     * Edit current season.
     * @SWG\Response(response=200, description="ParamSeason edited", @SWG\Schema(@Model(type=ParamSeason::class)))
     * @SWG\Response(response=404, description="ParamSeason not found")
     * @IsGranted("ROLE_SUPER_ADMIN")
     * @Rest\Put("/current-season/{id}")
     *
     * @return Response
     */
    public function putCurrentSeason(Request $request, TranslatorInterface $translator, int $id)
    {
        //Find param by id
        $season = $this->getDoctrine()->getRepository(ParamSeason::class)->findOneBy(['id' => $id]);
        if (!$season) {
            return $this->handleView($this->view(["message" => $translator->trans('not_found')], Response::HTTP_NOT_FOUND));
        }

        $em = $this->getDoctrine()->getManager();

        foreach ($this->getDoctrine()->getRepository(ParamSeason::class)->findAll() as $s) {
            $s->setIsCurrent(false);
            if ($s->getId() <= $season->getId()) {
                $s->setIsActive(true);
            } else {
                $s->setIsActive(false);
            }
            $em->persist($s);
        }

        $season->setIsCurrent(true);
        $em->persist($season);
        $em->flush();

        return $this->handleView($this->view($season, Response::HTTP_OK));
    }

    /**
     * Edit ParamGlobal.
     * @SWG\Parameter(name="paramglobal",in="body", description="ParamGlobal to edit", format="application/json", @SWG\Schema(@Model(type=ParamGlobal::class)))
     * @SWG\Response(response=200, description="ParamGlobal edited", @SWG\Schema(@Model(type=ParamGlobal::class)))
     * @SWG\Response(response=404, description="ParamGlobal not found")
     * @IsGranted("ROLE_SUPER_ADMIN")
     * @Rest\Put("/{label}")
     *
     * @return Response
     */
    public function putParamGlobal(Request $request, TranslatorInterface $translator, string $label)
    {
        //Find param by label
        $param = $this->getDoctrine()->getRepository(ParamGlobal::class)->findOneBy(['label' => $label]);
        if (!$param) {
            return $this->handleView($this->view(["message" => $translator->trans('not_found')], Response::HTTP_NOT_FOUND));
        }

        $data = json_decode($request->getContent(), true);
        $param->setValue($data['value']);
        $em = $this->getDoctrine()->getManager();
        $em->persist($param);
        $em->flush();

        return $this->handleView($this->view($param, Response::HTTP_OK));
    }
}
