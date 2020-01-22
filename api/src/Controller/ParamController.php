<?php

namespace App\Controller;

use App\Entity\ActivityHistory;
use App\Entity\Param\ParamDocumentCategory;
use App\Entity\Param\ParamGlobal;
use App\Entity\Param\ParamPaymentSolution;
use App\Entity\Param\ParamPriceLicense;
use App\Entity\Param\ParamPriceTransfer;
use App\Entity\Param\ParamReductionFamily;
use App\Entity\Param\ParamSeason;
use App\Entity\Param\ParamSex;
use App\Entity\Param\ParamWorkflow;
use App\Entity\Team;
use App\Entity\User;
use App\Form\ActivityHistoricType;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * Param controller.
 * @SWG\Parameter(name="Authorization", in="header", required=true, type="string", default="Bearer ", description="Bearer token")
 * @SWG\Tag(name="Param")
 * @Route("/api/param", name="api_")
 */
class ParamController extends FOSRestController
{
    /**
     * Lists all Param Global.
     * @SWG\Response(response=200, description="Returns params", @SWG\Schema(@Model(type="object")))
     * @Rest\Get("")
     *
     * @return Response
     */
    public function getParam()
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

        return $this->handleView($this->view([
            'teams' => $this->getDoctrine()->getRepository(Team::class)->findall(),
            'workflowStep' => $this->getDoctrine()->getRepository(ParamWorkflow::class)->findall(),
            'global' => $this->getDoctrine()->getRepository(ParamGlobal::class)->findall(),
            'documentCategory' => $this->getDoctrine()->getRepository(ParamDocumentCategory::class)->findall(),
            'roles' => ['ROLE_COACH', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'],
            'choices' => [['key' => 'true', 'text' => 'Oui', 'icon' => 'Accept'], ['key' => 'false', 'text' => 'Non', 'icon' => 'Cancel']],
            'sexes' => $this->getDoctrine()->getRepository(ParamSex::class)->findall(),
            'price' => [
                'license' => $this->getDoctrine()->getRepository(ParamPriceLicense::class)->findall(),
                'transfer' => $this->getDoctrine()->getRepository(ParamPriceTransfer::class)->findall(),
                'discount' => $this->getDoctrine()->getRepository(ParamReductionFamily::class)->findall(),
                'payment_solution' => $this->getDoctrine()->getRepository(ParamPaymentSolution::class)->findall(),
            ],
            'season' => $this->getDoctrine()->getRepository(ParamSeason::class)->findAll(),
            'users' => $this->isGranted('ROLE_ADMIN') ?
                array_map(
                    function ($user) {
                        return ['id' => $user->getId(), 'username' => $user->getUsername()];
                    },
                    $this->getDoctrine()->getRepository(User::class)->findBy([], ['username' => 'ASC'])
                )
                : []
        ]));
    }

    /**
     * Edit ParamGloball.
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
}
