<?php

namespace App\Controller;

use App\Constants;
use App\Entity\Document;
use App\Entity\Member;
use App\Entity\ParamDocumentCategory;
use App\Form\MemberMajorType;
use App\Form\MemberMinorType;
use App\Service\DateService;
use App\Service\PriceService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\Controller\Annotations\QueryParam;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Contracts\Translation\TranslatorInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

/**
 * Member controller.
 * @Route("/api/member", name="api_")
 */
class MemberController extends FOSRestController
{
    /**
     * Lists all member.
     * @QueryParam(name="name", nullable=true)
     * @QueryParam(name="stepsId", nullable=true)
     * @QueryParam(name="teamsId", nullable=true)
     * @IsGranted("ROLE_COACH")
     * @Rest\Get("")
     *
     * @return Response
     */
    public function getMembers(ParamFetcher $paramFetcher)
    {

        // return $this->handleView($this->view($paramFetcher->all()['teamsId']));
        if ($this->isGranted('ROLE_ADMIN')) {
            $members = $this->getDoctrine()->getRepository(Member::class)->findMembersByFields(
                $paramFetcher->get('name'),
                $paramFetcher->get('stepsId'),
                $paramFetcher->get('teamsId')
            );
            foreach ($members as $member) { //Hide some informations
                $member->getUser()->setPassword('');
                $member->getUser()->setSalt('');
                $member->getUser()->setConfirmationToken('');
            }
            return $this->handleView($this->view($members));
        } else if ($this->isGranted('ROLE_COACH')) {
            $teams = [];
            foreach ($this->getUser()->getTeams() as $team) array_push($teams, $team);
            return $this->handleView($this->view($this->getDoctrine()->getRepository(Member::class)->findBy(['team' => $teams])));
        }
    }

    /**
     * Lists all member.
     * @Rest\Get("/me")
     *
     * @return Response
     */
    public function getMyMembers()
    {
        $users = $this->getDoctrine()->getRepository(Member::class)->findBy(['user' => $this->getUser()]);
        if (!$users) return $this->handleView($this->view([(new Member())])); //Return empty member if none exists
        return $this->handleView($this->view($users));
    }

    /**
     * Get new member.
     * @Rest\Get("/new")
     *
     * @return Response
     */
    public function getNewMember()
    {
        return $this->handleView($this->view((new Member())));
    }
    /**
     * One member.
     * @Rest\Get("/{id}")
     *
     * @return Response
     */
    public function getOneMember(TranslatorInterface $translator, int $id)
    {
        //Find user by id
        $member = $this->getDoctrine()->getRepository(Member::class)->findOneBy(['id' => $id]);
        if (!$member) {
            return $this->handleView($this->view(["message" => $translator->trans('member_not_found')])); //Return empty member if none exists
        }
        $this->denyAccessUnlessGranted(Constants::READ, $member);

        $member->getUser()->setPassword('');
        $member->getUser()->setSalt('');
        $member->getUser()->setConfirmationToken('');

        return $this->handleView($this->view($member));
    }

    /**
     * Create Member.
     * @Rest\Post("/")
     *
     * @return Response
     */
    public function postMember(Request $request, DateService $dateService, TranslatorInterface $translator, PriceService $priceService)
    {
        $member = new Member();
        $this->denyAccessUnlessGranted(Constants::CREATE, $member);

        $data = json_decode($request->getContent(), true);

        //Check if birthdate is valid date
        if ($dateService->isDate($data['birthdate'])) {
            //Create form by age of member
            if ($dateService->isMajor($data['birthdate'])) {
                $form = $this->createForm(MemberMajorType::class, $member);
            } else {
                $form = $this->createForm(MemberMinorType::class, $member);
            }
            $form->submit($data);

            if ($form->isSubmitted() && $form->isValid()) {
                $member->setUser($this->getUser());
                $member->setCreationDatetime(new \DateTime('now', new \DateTimeZone('Europe/Paris')));
                $em = $this->getDoctrine()->getManager();
                $em->persist($member);
                $em->flush();
                return $this->handleView($this->view($member, Response::HTTP_CREATED));
            }
            return $this->handleView($this->view($form->getErrors(), Response::HTTP_BAD_REQUEST));
        }
        return $this->handleView($this->view(['form' => ['children' => ['birthdate' => ['errors' => [$translator->trans('invalid_date')]]]]], Response::HTTP_BAD_REQUEST));
    }

    /**
     * Edit Member.
     * @Rest\Put("/{id}")
     *
     * @return Response
     */
    public function putMember(Request $request, DateService $dateService, TranslatorInterface $translator, PriceService $priceService, int $id)
    {
        //Find user by id
        $member = $this->getDoctrine()->getRepository(Member::class)->findOneBy(['id' => $id]);
        if (!$member) {
            return $this->handleView($this->view(["message" => $translator->trans('member_not_found')], Response::HTTP_NOT_FOUND));
        }
        $this->denyAccessUnlessGranted(Constants::UPDATE, $member);

        $data = json_decode($request->getContent(), true);

        //Check if birthdate is valid date
        if ($dateService->isDate($data['birthdate'])) {
            //Create form by age of member
            if ($dateService->isMajor($data['birthdate'])) {
                $form = $this->createForm(MemberMajorType::class, $member);
            } else {
                $form = $this->createForm(MemberMinorType::class, $member);
            }
            $form->submit($data, true);

            if ($form->isSubmitted() && $form->isValid()) {
                $em = $this->getDoctrine()->getManager();
                $em->persist($member);
                $em->flush();
                return $this->handleView($this->view($member, Response::HTTP_OK));
            }
            return $this->handleView($this->view($form->getErrors(), Response::HTTP_BAD_REQUEST));
        }
        return $this->handleView($this->view(['form' => ['children' => ['birthdate' => ['errors' => [$translator->trans('invalid_date')]]]]], Response::HTTP_BAD_REQUEST));
    }

    /**
     * Delete Member.
     * @Rest\Delete("/{id}")
     *
     * @return Response
     */
    public function deleteMember(TranslatorInterface $translator, int $id)
    {
        //Find user by id
        $member = $this->getDoctrine()->getRepository(Member::class)->findOneBy(['id' => $id]);
        if (!$member) {
            return $this->handleView($this->view(["message" => $translator->trans('member_not_found')], Response::HTTP_NOT_FOUND));
        }
        $this->denyAccessUnlessGranted(Constants::DELETE, $member);

        $em = $this->getDoctrine()->getManager();

        //Remove manually each docs
        foreach ($this->getDoctrine()->getRepository(Document::class)->findBy(['member' => $member]) as $document) $em->remove($document);

        //Remove member
        $em->remove($member);
        $em->flush();

        return $this->handleView($this->view([]));
    }

    /**
     * Get price for all User's Member.
     * @Rest\Get("/me/price")
     *
     * @return Response
     */
    public function getPriceMe(PriceService $priceService)
    {
        //Find member by id
        $members = $this->getDoctrine()->getRepository(Member::class)->findBy(['user' => $this->getUser()]);

        return $this->handleView($this->view(['price' => $priceService->getPrices($members)]));
    }

    /**
     * Get price for a Member.
     * @Rest\Get("/{id}/price")
     *
     * @return Response
     */
    public function getPrice(TranslatorInterface $translator, PriceService $priceService, int $id)
    {
        //Find member by id
        $member = $this->getDoctrine()->getRepository(Member::class)->findOneBy(['id' => $id]);
        if (!$member) {
            return $this->handleView($this->view(["message" => $translator->trans('member_not_found')], Response::HTTP_NOT_FOUND));
        }
        $this->denyAccessUnlessGranted(Constants::READ, $member);

        return $this->handleView($this->view(['price' => $priceService->getPrice($member)]));
    }

    /**
     * Validate document.
     * @Rest\Post("/{id}/validate-document")
     *
     * @return Response
     */
    public function postValidateDocument(TranslatorInterface $translator, int $id)
    {
        //Find member by id
        $member = $this->getDoctrine()->getRepository(Member::class)->findOneBy(['id' => $id]);
        if (!$member) {
            return $this->handleView($this->view(["message" => $translator->trans('member_not_found')], Response::HTTP_NOT_FOUND));
        }
        $this->denyAccessUnlessGranted(Constants::READ, $member);

        //Find certificat
        $isDocCertMediOk = $this->getDoctrine()->getRepository(Document::class)->findOneBy([
            'category' => $this->getDoctrine()->getRepository(ParamDocumentCategory::class)->findOneBy(['id' => 1])
        ]);

        //Find justificatif
        $isDocJusChoEtuOk = $this->getDoctrine()->getRepository(Document::class)->findOneBy([
            'category' => $this->getDoctrine()->getRepository(ParamDocumentCategory::class)->findOneBy(['id' => 2])
        ]);

        //If docs are missing
        if (!$isDocCertMediOk || !($member->getIsReducedPrice() ? $isDocJusChoEtuOk : true)) {
            $res = [
                'form' => [
                    'children' => [
                        '1' => [],
                        '2' => []
                    ]
                ]
            ];
            if (!$isDocCertMediOk) $res['form']['children']['1'] = [$translator->trans('not_blank')];
            if ($member->getIsReducedPrice() && !$isDocJusChoEtuOk) $res['form']['children']['2'] = [$translator->trans('not_blank')];

            return $this->handleView($this->view($res, Response::HTTP_BAD_REQUEST));
        }

        //Update user
        $member->setIsDocumentComplete(true);
        $em = $this->getDoctrine()->getManager();
        $em->persist($member);
        $em->flush();

        return $this->handleView($this->view($member), Response::HTTP_OK);
    }

    /**
     * Get wf for a Member.
     * @IsGranted("ROLE_COACH")
     * @Rest\Get("/{id}/workflow")
     *
     * @return Response
     */
    public function getWorkflow(TranslatorInterface $translator, int $id)
    {
        //Find member by id
        $member = $this->getDoctrine()->getRepository(Member::class)->findOneBy(['id' => $id]);
        if (!$member) {
            return $this->handleView($this->view(["message" => $translator->trans('member_not_found')], Response::HTTP_NOT_FOUND));
        }
        $this->denyAccessUnlessGranted(Constants::READ, $member);

        return $this->handleView($this->view([
            'isCreated' => true,
            'isDocumentComplete' => $member->getIsDocumentComplete(),
            'isPayed' => $member->getIsPayed(),
            'isCheckGestHand' => $member->getIsCheckGestHand(),
            'isInscriptionDone' => $member->getIsInscriptionDone()
        ]));
    }

    /**
     * Pay for mine Members
     * @Rest\Post("/me/pay")
     *
     * @return Response
     */
    public function postPay(TranslatorInterface $translator, PriceService $priceService)
    {
        //Find member by id
        $members = $this->getDoctrine()->getRepository(Member::class)->findBy(['user' => $this->getUser()]);

        //Check docs
        foreach ($members as $member) {
            if (!$member->getIsDocumentComplete()) {
                return $this->handleView($this->view(["message" => $translator->trans('member_missing_document')], Response::HTTP_NOT_FOUND));
            }
        }

        //TODO : connect return api payment 
        $em = $this->getDoctrine()->getManager();
        foreach ($members as $member) {
            $member->setIsPayed(true);
            $member->setAmountPayed($priceService->getPrice($member));
            $em->persist($member);
        }
        $em->flush();

        return $this->handleView($this->view($members), Response::HTTP_OK);
    }
}
