<?php

namespace App\Controller;

use App\Constants;
use App\Entity\Document;
use App\Entity\Member;
use App\Entity\Param\ParamDocumentCategory;
use App\Entity\Param\ParamPaymentSolution;
use App\Entity\Param\ParamPriceGlobal;
use App\Entity\Param\ParamPriceLicense;
use App\Entity\Param\ParamPriceTransfer;
use App\Entity\Param\ParamReductionFamily;
use App\Entity\PaypalInformation;
use App\Entity\User;
use App\Form\DocumentType;
use App\Form\Member\MemberMajorAdminType;
use App\Form\Member\MemberMajorType;
use App\Form\Member\MemberMinorAdminType;
use App\Form\Member\MemberMinorType;
use App\Form\PaypalInformationType;
use App\Service\DateService;
use App\Service\MailService;
use App\Service\Namer\FileService;
use App\Service\ParamService;
use App\Service\PriceService;
use App\Service\WorkflowService;
use FOS\RestBundle\Context\Context;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\Controller\Annotations\QueryParam;
use FOS\UserBundle\Util\TokenGenerator;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\Translation\TranslatorInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Vich\UploaderBundle\Mapping\PropertyMapping;
use Vich\UploaderBundle\Mapping\PropertyMappingFactory;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerInterface;

/**
 * Member controller.
 * @SWG\Parameter(name="Authorization", in="header", required=true, type="string", default="Bearer ", description="Bearer token")
 * @SWG\Tag(name="Member")
 * @Route("/api/member", name="api_")
 */
class MemberController extends AbstractFOSRestController
{
    /**
     * Lists all member.
     * @QueryParam(name="name", nullable=true, description="String of firstname/lastname to filter")
     * @QueryParam(name="stepsId", nullable=true, description="Steps ids to filter (ex: '1,2,3,')")
     * @QueryParam(name="teamsId", nullable=true, description="Teams ids to filter (ex: '1,2,3,')")
     * @QueryParam(name="seasonId", nullable=true, description="Seasons ids to filter (ex: '1,2,3,')")
     * @QueryParam(name="userId", nullable=true, description="User ids to filter")
     * @SWG\Response(response=200, description="Returns members", @SWG\Schema(type="array", @Model(type=Member::class)))
     * @Rest\Get("")
     *
     * @return Response
     */
    public function getMembers(ParamFetcher $paramFetcher, ParamService $paramService, SerializerInterface $serializer)
    {
        if ($this->isGranted(Constants::ROLE_ADMIN)) {
            $members = $this->getDoctrine()->getRepository(Member::class)->findMembersByFields(
                $paramFetcher->get('name'),
                $paramFetcher->get('stepsId'),
                $paramFetcher->get('teamsId'),
                $paramFetcher->get('seasonId'),
                $paramFetcher->get('userId')
            );
            return $this->handleView($this->view($members)->setContext((new Context())->setGroups([Constants::BASIC, Constants::ADMIN])));
        } else if ($this->isGranted(Constants::ROLE_COACH)) {
            $teams = [];
            foreach ($this->getUser()->getTeams() as $team) array_push($teams, $team);
            return $this->handleView($this->view(
                $this->getDoctrine()->getRepository(Member::class)->findByTeamsAndSeason($teams, $paramService->getCurrentSeason())
            )
                ->setContext((new Context())->setGroups([Constants::BASIC])
                ));
        }
        return $this->handleView($this->view([], Response::HTTP_FORBIDDEN));
    }

    /**
     * Get member by User connected.
     * @SWG\Response(response=200, description="Returns members", @SWG\Schema(type="array", @Model(type=Member::class)))
     * @Rest\Get("/me")
     *
     * @return Response
     */
    public function getMyMembers(ParamService $paramService)
    {
        $members = $this->getDoctrine()->getRepository(Member::class)->findBy(['user' => $this->getUser(), 'season' => $paramService->getCurrentSeason()]);
        if (!$members) { //Return empty member if none exists
            $member = new Member();
            $member->setSeason($paramService->getCurrentSeason());
            return $this->handleView($this->view([$member]));
        }
        return $this->handleView($this->view($members)->setContext((new Context())->setGroups([Constants::BASIC])));
    }

    /**
     * Get member by User connected from previous season.
     * @SWG\Response(response=200, description="Returns members", @SWG\Schema(type="array", @Model(type=Member::class)))
     * @Rest\Get("/me/previous-season")
     *
     * @return Response
     */
    public function getMyPreviousMembers(ParamService $paramService)
    {
        $membersOld = $this->getDoctrine()->getRepository(Member::class)->findBy(['user' => $this->getUser(), 'season' => $paramService->getPreviousSeason()]);
        $members = [];
        foreach ($membersOld as $member) array_push($members, clone $member);
        return $this->handleView($this->view($members)->setContext((new Context())->setGroups([Constants::BASIC])));
    }

    /**
     * Get new member.
     * @SWG\Response(response=200, description="Returns new member", @SWG\Schema(
     *      type="object",
     *      @SWG\Property(property="member", @Model(type=Member::class)),
     * ))
     * @Rest\Get("/new")
     *
     * @return Response
     */
    public function getNewMember(ParamService $paramService, WorkflowService $workflowService)
    {
        $member = new Member();
        $member->setSeason($paramService->getCurrentSeason());
        if ($this->isGranted(Constants::ROLE_ADMIN)) {
            return $this->handleView($this->view([
                'member' => $member,
                'workflow' => $workflowService->getWorkflow($member)
            ])->setContext((new Context())->setGroups([Constants::BASIC, Constants::ADMIN])));
        } else {
            return $this->handleView($this->view(['member' => $member])->setContext((new Context())->setGroups([Constants::BASIC])));
        }
    }

    /**
     * Get one member by id.
     * @SWG\Response(response=200, description="Returns member", @SWG\Schema(
     *      type="object",
     *      @SWG\Property(property="member", @Model(type=Member::class)),
     *      @SWG\Property(property="workflow", type="array", @SWG\Items(type="object")),
     * ))
     * @SWG\Response(response=404, description="Member not found")
     * @IsGranted("ROLE_COACH")
     * @Rest\Get("/{id}")
     *
     * @return Response
     */
    public function getOneMember(TranslatorInterface $translator, WorkflowService $workflowService, int $id)
    {
        //Find user by id
        $member = $this->getDoctrine()->getRepository(Member::class)->findOneBy(['id' => $id]);
        if (!$member) {
            return $this->handleView($this->view(["message" => $translator->trans('member_not_found')], Response::HTTP_NOT_FOUND)); //Return empty member if none exists
        }
        $this->denyAccessUnlessGranted(Constants::READ, $member);

        return $this->handleView($this->view([
            'member' => $member,
            'workflow' => $workflowService->getWorkflow($member)
        ])->setContext((new Context())->setGroups([Constants::BASIC, Constants::ADMIN])));
    }

    /**
     * Create new member for Admin user
     * @SWG\Parameter(name="member",in="body", description="New member", format="application/json", @SWG\Schema(@Model(type=Member::class)))
     * @SWG\Response(response=201, description="Returns member created", @SWG\Schema(@Model(type=Member::class)))
     * @SWG\Response(response=400, description="Error in data")
     * @IsGranted("ROLE_ADMIN")
     * @Rest\Post("/admin")
     *
     * @return Response
     */
    public function postMemberAdmin(Request $request, DateService $dateService, TranslatorInterface $translator, PriceService $priceService)
    {
        $member = new Member();
        $this->denyAccessUnlessGranted(Constants::CREATE_ADMIN, $member);

        $data = json_decode($request->getContent(), true);

        //Check if birthdate is valid date and Create form by age of member        
        if (array_key_exists('birthdate', $data) && $dateService->isDate($data['birthdate']) && !$dateService->isMajor($data['birthdate'])) {
            $data['is_reduced_price'] = false;
            $data['is_non_competitive'] = false;
            $form = $this->createForm(MemberMinorAdminType::class, $member);
        } else {
            $form = $this->createForm(MemberMajorAdminType::class, $member);
        }
        $form->submit($data);

        if ($form->isSubmitted() && $form->isValid()) {
            $member->setCreationDatetime(new \DateTime('now', new \DateTimeZone('Europe/Paris')));
            $member->setResetNewsletterToken((new TokenGenerator())->generateToken());
            if (!$dateService->isMajor($data['birthdate'])) {
                $member->setIsReducedPrice(false);
                $member->setIsNonCompetitive(false);
            } else {
                $member->setParentOneFirstname(null);
                $member->setParentOneLastname(null);
                $member->setParentOnePhoneNumber(null);
                $member->setParentOneEmail(null);
                $member->setParentOneProfession(null);
                $member->setParentTwoFirstname(null);
                $member->setParentTwoLastname(null);
                $member->setParentTwoPhoneNumber(null);
                $member->setParentTwoEmail(null);
                $member->setParentTwoProfession(null);
                $member->setIsReturnHomeAllow(false);
            }

            if ($member->getPaymentSolution() && $member->getPaymentSolution()->getId() !== 3) $member->setAmountPayedOther(null);
            if ($member->getPaymentSolution() && $member->getPaymentSolution()->getId() !== 1) $member->setPaypalInformation(null);

            $em = $this->getDoctrine()->getManager();
            $em->persist($member);
            $em->flush();
            return $this->handleView($this->view($member, Response::HTTP_CREATED)->setContext((new Context())->setGroups([Constants::BASIC, Constants::ADMIN])));
        }
        return $this->handleView($this->view($form->getErrors(), Response::HTTP_BAD_REQUEST));
    }

    /**
     * Create Member for user.
     * @SWG\Parameter(name="member",in="body", description="New member", format="application/json", @SWG\Schema(@Model(type=Member::class)))
     * @SWG\Response(response=201, description="Returns member created", @SWG\Schema(@Model(type=Member::class)))
     * @SWG\Response(response=400, description="Error in data")
     * @SWG\Response(response=403, description="Feature disabled")
     * @SWG\Response(response=404, description="Member not found")
     * @Rest\Post("")
     *
     * @return Response
     */
    public function postMember(Request $request, DateService $dateService, TranslatorInterface $translator, ParamService $paramService, PropertyMappingFactory $propertyMappingFactory)
    {
        //Disabled new member by deadline, null if not
        if ($paramService->getParam('new_member_deadline') && !(new \DateTime($paramService->getParam('new_member_deadline')) > new \DateTime())) {
            return $this->handleView($this->view([
                'error' => [
                    'message' => $translator->trans('new_member_disabled', ['{{date}}' => (new \DateTime($paramService->getParam('new_member_deadline')))->format('d/m/Y')]),
                    'code' => Response::HTTP_FORBIDDEN
                ]
            ], Response::HTTP_FORBIDDEN));
        }

        //Disable if needed
        if (!filter_var($paramService->getParam('is_create_new_member_able'), FILTER_VALIDATE_BOOLEAN)) {
            return $this->handleView($this->view([
                'error' => [
                    'message' => $translator->trans('register_is_disabled'),
                    'code' => Response::HTTP_FORBIDDEN
                ]
            ], Response::HTTP_FORBIDDEN));
        }

        $member = new Member();
        $this->denyAccessUnlessGranted(Constants::CREATE, $member,  $translator->trans('deny_create_member'));

        $data = json_decode($request->getContent(), true);

        //Check if birthdate is valid date and Create form by age of member        
        if (array_key_exists('birthdate', $data) && $dateService->isDate($data['birthdate']) && !$dateService->isMajor($data['birthdate'])) {
            $data['is_reduced_price'] = false;
            $data['is_non_competitive'] = false;
            $form = $this->createForm(MemberMinorType::class, $member);
        } else {
            $form = $this->createForm(MemberMajorType::class, $member);
        }
        $form->submit($data);

        if ($form->isSubmitted() && $form->isValid()) {
            $member->setUser($this->getUser());
            $member->setSeason($paramService->getCurrentSeason());
            $member->setCreationDatetime(new \DateTime('now', new \DateTimeZone('Europe/Paris')));
            $member->setResetNewsletterToken((new TokenGenerator())->generateToken());
            if (!$dateService->isMajor($data['birthdate'])) {
                $member->setIsReducedPrice(false);
                $member->setIsNonCompetitive(false);
            } else {
                $member->setParentOneFirstname(null);
                $member->setParentOneLastname(null);
                $member->setParentOnePhoneNumber(null);
                $member->setParentOneEmail(null);
                $member->setParentOneProfession(null);
                $member->setParentTwoFirstname(null);
                $member->setParentTwoLastname(null);
                $member->setParentTwoPhoneNumber(null);
                $member->setParentTwoEmail(null);
                $member->setParentTwoProfession(null);
                $member->setIsReturnHomeAllow(false);
            }
            $em = $this->getDoctrine()->getManager();
            $em->persist($member);

            //Check to copy file from previous season member
            // if (array_key_exists('documents', $data)) {
            //     $files = new \Doctrine\Common\Collections\ArrayCollection();

            //     foreach ($data['documents'] as $doc) {
            //         if (array_key_exists('id', $doc)) {
            //             $oldDocument = $this->getDoctrine()->getRepository(Document::class)->findOneBy(['id' => $doc['id']]);
            //             if (!$oldDocument || $oldDocument->getMember()->getUser() !== $this->getUser()) continue; //Ensure acces to user

            //             $baseFile = $propertyMappingFactory->fromField($oldDocument, 'documentFile');
            //             $newDocument = clone $oldDocument;

            //             //Do not clone doc if needed anymore
            //             if (
            //                 $newDocument->getCategory()->getId() === 1 ||
            //                 ($newDocument->getCategory()->getId() === 2 && $member->getIsReducedPrice())
            //             ) {
            //                 //Create temp file
            //                 if (copy(
            //                     $baseFile->getUploadDestination() . '/' . $baseFile->getUploadDir($oldDocument) . '/' . $baseFile->getFileName($oldDocument),
            //                     $baseFile->getUploadDestination() . '/' . $baseFile->getUploadDir($oldDocument) . '/' . 'temp'
            //                 )) {
            //                     $form = $this->createForm(DocumentType::class, $newDocument);
            //                     $form->submit([
            //                         'documentFile' => new UploadedFile(
            //                             $baseFile->getUploadDestination() . '/' . $baseFile->getUploadDir($oldDocument) . '/' . 'temp',
            //                             $oldDocument->getDocument()->getOriginalName(),
            //                             null,
            //                             true
            //                         )
            //                     ]);

            //                     if ($form->isSubmitted() && $form->isValid()) {
            //                         $newDocument->setMember($member);
            //                         $em->persist($newDocument);
            //                         $em->flush();
            //                         $files->add($newDocument);
            //                     } else {
            //                         // return $this->handleView($this->view($form->getErrors(), Response::HTTP_BAD_REQUEST));
            //                         //If error, remove temp file
            //                         unlink($baseFile->getUploadDestination() . '/' . $baseFile->getUploadDir($oldDocument) . '/' . 'temp');
            //                     }
            //                 }
            //             }
            //         }
            //     }
            //     $member->setDocuments($files);
            // }

            // $em->persist($member);
            $em->flush();

            return $this->handleView($this->view($member, Response::HTTP_CREATED)->setContext((new Context())->setGroups([Constants::BASIC])));
        }
        return $this->handleView($this->view($form->getErrors(), Response::HTTP_BAD_REQUEST));
    }

    /**
     * Edit Member for admin.
     * @SWG\Parameter(name="member",in="body", description="New member", format="application/json", @SWG\Schema(@Model(type=Member::class)))
     * @SWG\Response(response=200, description="Returns member", @SWG\Schema(@Model(type=Member::class)))
     * @SWG\Response(response=400, description="Error in data")
     * @SWG\Response(response=404, description="Member not found")
     * @IsGranted("ROLE_ADMIN")
     * @Rest\Put("/{id}/admin")
     *
     * @return Response
     */
    public function putMemberAdmin(Request $request, DateService $dateService, TranslatorInterface $translator, WorkflowService $workflowService, MailService $mailService, int $id)
    {
        //Find user by id
        $member = $this->getDoctrine()->getRepository(Member::class)->findOneBy(['id' => $id]);
        if (!$member) {
            return $this->handleView($this->view(["message" => $translator->trans('member_not_found')], Response::HTTP_NOT_FOUND));
        }
        $this->denyAccessUnlessGranted(Constants::UPDATE_ADMIN, $member);

        $data = json_decode($request->getContent(), true);

        //Check if birthdate is valid date and Create form by age of member        
        if (array_key_exists('birthdate', $data) && $dateService->isDate($data['birthdate']) && !$dateService->isMajor($data['birthdate'])) {
            $form = $this->createForm(MemberMinorAdminType::class, $member);
        } else {
            $form = $this->createForm(MemberMajorAdminType::class, $member);
        }

        //Check to know if have to send email for inscription done
        $emailInscriptionDone = (array_key_exists('is_inscription_done', $data) && $data['is_inscription_done'] === true &&  $member->getIsInscriptionDone() === false);
        //Check to know if have to send email for invalid document
        // $emailDocumentInvalid = (array_key_exists('is_document_complete', $data) && $data['is_document_complete'] === false &&  $member->getIsDocumentComplete() === true);

        $form->submit($data, true);

        if ($form->isSubmitted() && $form->isValid()) {
            if (!$dateService->isMajor($data['birthdate'])) {
                $member->setIsReducedPrice(false);
                $member->setIsNonCompetitive(false);
            } else {
                $member->setParentOneFirstname(null);
                $member->setParentOneLastname(null);
                $member->setParentOnePhoneNumber(null);
                $member->setParentOneEmail(null);
                $member->setParentOneProfession(null);
                $member->setParentTwoFirstname(null);
                $member->setParentTwoLastname(null);
                $member->setParentTwoPhoneNumber(null);
                $member->setParentTwoEmail(null);
                $member->setParentTwoProfession(null);
                $member->setIsReturnHomeAllow(false);
            }
            if ($member->getPaymentSolution() && $member->getPaymentSolution()->getId() !== 3) $member->setAmountPayedOther(null);
            if ($member->getPaymentSolution() && $member->getPaymentSolution()->getId() !== 1) $member->setPaypalInformation(null);

            $em = $this->getDoctrine()->getManager();
            $em->persist($member);
            $em->flush();

            if ($emailInscriptionDone && $member->getUser()) $mailService->sendInscriptionDone($member->getUser(), $member);
            // if ($emailDocumentInvalid && $member->getUser()) $mailService->sendDocumentInvalid($member->getUser(), $member);

            return $this->handleView($this->view([
                'member' => $member,
                'workflow' => $workflowService->getWorkflow($member)
            ])->setContext((new Context())->setGroups([Constants::BASIC, Constants::ADMIN])));
        }
        return $this->handleView($this->view($form->getErrors(), Response::HTTP_BAD_REQUEST));
    }

    /**
     * Edit Member for user.
     * @SWG\Parameter(name="member",in="body", description="New member", format="application/json", @SWG\Schema(@Model(type=Member::class)))
     * @SWG\Response(response=200, description="Returns members", @SWG\Schema(@Model(type=Member::class)))
     * @SWG\Response(response=400, description="Error in data")
     * @SWG\Response(response=403, description="Feature disabled")
     * @SWG\Response(response=404, description="Member not found")
     * @Rest\Put("/{id}")
     *
     * @return Response
     */
    public function putMember(Request $request, DateService $dateService, TranslatorInterface $translator, ParamService $paramService, int $id)
    {
        //Disabled edit member by deadline, null if not
        if ($paramService->getParam('new_member_deadline') && !(new \DateTime($paramService->getParam('new_member_deadline')) > new \DateTime())) {
            return $this->handleView($this->view([
                'error' => [
                    'message' => $translator->trans('new_member_disabled', ['{{date}}' => (new \DateTime($paramService->getParam('new_member_deadline')))->format('d/m/Y')]),
                    'code' => Response::HTTP_FORBIDDEN
                ]
            ], Response::HTTP_FORBIDDEN));
        }

        //Disable if needed
        if (!filter_var($paramService->getParam('is_create_new_member_able'), FILTER_VALIDATE_BOOLEAN)) {
            return $this->handleView($this->view([
                'error' => [
                    'message' => $translator->trans('register_is_disabled'),
                    'code' => Response::HTTP_FORBIDDEN
                ]
            ], Response::HTTP_FORBIDDEN));
        }

        //Find user by id
        $member = $this->getDoctrine()->getRepository(Member::class)->findOneBy(['id' => $id]);
        if (!$member) {
            return $this->handleView($this->view(["message" => $translator->trans('member_not_found')], Response::HTTP_NOT_FOUND));
        }
        $this->denyAccessUnlessGranted(Constants::UPDATE, $member);

        $data = json_decode($request->getContent(), true);

        //Check if birthdate is valid date and Create form by age of member            
        if (array_key_exists('birthdate', $data) && $dateService->isDate($data['birthdate']) && !$dateService->isMajor($data['birthdate'])) {
            $form = $this->createForm(MemberMinorType::class, $member);
        } else {
            $form = $this->createForm(MemberMajorType::class, $member);
        }
        $form->submit($data, true);

        if ($form->isSubmitted() && $form->isValid()) {
            if (!$dateService->isMajor($data['birthdate'])) {
                $member->setIsReducedPrice(false);
                $member->setIsNonCompetitive(false);
            } else {
                $member->setParentOneFirstname(null);
                $member->setParentOneLastname(null);
                $member->setParentOnePhoneNumber(null);
                $member->setParentOneEmail(null);
                $member->setParentOneProfession(null);
                $member->setParentTwoFirstname(null);
                $member->setParentTwoLastname(null);
                $member->setParentTwoPhoneNumber(null);
                $member->setParentTwoEmail(null);
                $member->setParentTwoProfession(null);
                $member->setIsReturnHomeAllow(false);
            }
            $em = $this->getDoctrine()->getManager();
            $em->persist($member);
            $em->flush();
            return $this->handleView($this->view($member)->setContext((new Context())->setGroups([Constants::BASIC])));
        }
        return $this->handleView($this->view($form->getErrors(), Response::HTTP_BAD_REQUEST));
    }

    /**
     * Delete Member.
     * @SWG\Response(response=200, description="Member deleted")
     * @SWG\Response(response=404, description="Member not found")
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
        $this->denyAccessUnlessGranted(Constants::DELETE, $member,  $translator->trans('deny_delete_member'));

        $em = $this->getDoctrine()->getManager();

        //Remove manually each docs
        foreach ($this->getDoctrine()->getRepository(Document::class)->findBy(['member' => $member]) as $document) $em->remove($document);

        //Remove member
        $em->remove($member);
        $em->flush();

        return $this->handleView($this->view([]));
    }

    /**
     * Get price for all User's Members.
     * @SWG\Parameter(name="member",in="body", description="New member", format="application/json", @SWG\Schema(@Model(type=Member::class)))
     * @SWG\Response(response=200, description="Returns prices", @SWG\Schema(@Model(type=Member::class)))
     * @SWG\Response(response=404, description="Members not found")
     * @Rest\Get("/me/price")
     *
     * @return Response
     */
    public function getPriceMe(TranslatorInterface $translator, PriceService $priceService, ParamService $paramService)
    {
        //Find member by id
        $members = $this->getDoctrine()->getRepository(Member::class)->findBy(['user' => $this->getUser(), 'is_payed' => false, 'season' => $paramService->getCurrentSeason()]);

        if (!$members) {
            return $this->handleView($this->view(["message" => $translator->trans('members_to_pay_not_found')], Response::HTTP_NOT_FOUND));
        }

        return $this->handleView($this->view(['price' => $priceService->getPrices($members)]));
    }

    /**
     * Get price for a Member.
     * @SWG\Parameter(name="member",in="body", description="New member", format="application/json", @SWG\Schema(@Model(type=Member::class)))
     * @SWG\Response(response=200, description="Returns price", @SWG\Schema(@Model(type=Member::class)))
     * @SWG\Response(response=404, description="Member not found")
     * @Rest\Get("/{id}/price")
     *
     * @return Response
     */
    public function getPrice(TranslatorInterface $translator, PriceService $priceService, ParamService $paramService, int $id)
    {
        //Find member by id
        $member = $this->getDoctrine()->getRepository(Member::class)->findOneBy(['id' => $id]);
        if (!$member) {
            return $this->handleView($this->view(["message" => $translator->trans('member_not_found')], Response::HTTP_NOT_FOUND));
        }
        $this->denyAccessUnlessGranted(Constants::READ, $member);

        return $this->handleView($this->view([
            'price' => $priceService->getPrice($member, $member->getSeason()),
            'position' => $priceService->getPosition($member),
            'paramPrice' => $member->getSeason() !== $paramService->getCurrentSeason() ? //If calc from an old member, return params from the season
                [
                    'global' => $this->getDoctrine()->getRepository(ParamPriceGlobal::class)->findOneBy(['season' => $member->getSeason()]),
                    'license' => $this->getDoctrine()->getRepository(ParamPriceLicense::class)->findBy(['season' => $member->getSeason()]),
                    'transfer' => $this->getDoctrine()->getRepository(ParamPriceTransfer::class)->findBy(['season' => $member->getSeason()]),
                    'discount' => $this->getDoctrine()->getRepository(ParamReductionFamily::class)->findBy(['season' => $member->getSeason()])
                ]
                :
                null
        ]));
    }

    /**
     * Validate document for a given Member.
     * @deprecated No longer used : no more document are uploaded, so no need for validation.
     * @SWG\Parameter(name="member",in="body", description="New member", format="application/json", @SWG\Schema(@Model(type=Member::class)))
     * @SWG\Response(response=200, description="Returns member", @SWG\Schema(@Model(type=Member::class)))
     * @SWG\Response(response=400, description="Files are missing")
     * @SWG\Response(response=404, description="Members not found")
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
            'category' => $this->getDoctrine()->getRepository(ParamDocumentCategory::class)->findOneBy(['id' => 1]),
            'member' => $member
        ]);

        //Find justificatif
        $isDocJusChoEtuOk = $this->getDoctrine()->getRepository(Document::class)->findOneBy([
            'category' => $this->getDoctrine()->getRepository(ParamDocumentCategory::class)->findOneBy(['id' => 2]),
            'member' => $member
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

            //Update user
            $member->setIsDocumentComplete(false);
            $em = $this->getDoctrine()->getManager();
            $em->persist($member);
            $em->flush();

            return $this->handleView($this->view($res, Response::HTTP_BAD_REQUEST));
        }

        //Update user
        $member->setIsDocumentComplete(true);
        $em = $this->getDoctrine()->getManager();
        $em->persist($member);
        $em->flush();

        return $this->handleView($this->view($member)->setContext((new Context())->setGroups([Constants::BASIC])));
    }

    /**
     * Pay for User's Members
     * @SWG\Parameter(name="member",in="body", description="New member", format="application/json", @SWG\Schema(@Model(type=Member::class)))
     * @SWG\Response(response=200, description="Returns members", @SWG\Schema(@Model(type=Member::class)))
     * @SWG\Response(response=400, description="Files are missing")
     * @SWG\Response(response=404, description="Payment solution or Members not found")
     * @Rest\Post("/me/pay")
     *
     * @return Response
     */
    public function postPay(Request $request, TranslatorInterface $translator, PriceService $priceService, ParamService $paramService, ValidatorInterface $validator, MailService $mailService)
    {
        $data = json_decode($request->getContent(), true);

        //Find member by id
        $members = $this->getDoctrine()->getRepository(Member::class)->findBy(['user' => $this->getUser(), 'is_payed' => false, 'season' => $paramService->getCurrentSeason()]);
        if (!sizeof($members)) {
            return $this->handleView($this->view(["message" => $translator->trans('not_found')], Response::HTTP_NOT_FOUND));
        }
        
        //Check docs
        // foreach ($members as $member) {
        //     if (!$member->getIsDocumentComplete()) {
        //         return $this->handleView($this->view(["message" => $translator->trans('member_missing_document')], Response::HTTP_BAD_REQUEST));
        //     }
        // }

        //Find payment solution
        $paymentSolution = $this->getDoctrine()->getRepository(ParamPaymentSolution::class)->findOneBy(['id' => $data['payment_solution']]);
        if (!$paymentSolution) {
            return $this->handleView($this->view(["message" => $translator->trans('payment_solution_not_found')], Response::HTTP_NOT_FOUND));
        }

        $em = $this->getDoctrine()->getManager();

        switch ($paymentSolution->getId()) {
            case 1: //If paypal
                $paypalInfo = new PaypalInformation();
                $form = $this->createForm(PaypalInformationType::class, $paypalInfo);
                $form->submit($data['paypalInfos'], true);

                if ($form->isSubmitted() && $form->isValid()) {
                    $em->persist($paypalInfo);
                    $em->flush();
                    foreach ($members as $member) {
                        $member->setPaypalInformation($paypalInfo);
                        $member->setAmountPayed(
                            $priceService->getPrice($member) + $em->getRepository(ParamPriceGlobal::class)->findOneBy(['season' => $paramService->getCurrentSeason()])->getPaypalFee()
                        );
                    }
                } else {
                    return $this->handleView($this->view(["message" => $form->getErrors()], Response::HTTP_BAD_REQUEST));
                }
                break;
            case 3: //Set amount other pay if solution 3 "cheque & coupons"
                foreach ($data['each'] as $el) {
                    foreach ($members as $member) {
                        if ($member->getId() === $el['id']) {
                            $member->setAmountPayedOther($el['price_other']);
                            $validation = $validator->validate($member);
                            if (count($validation) > 0) {
                                return $this->handleView($this->view(['form' => ['children' => [$validation[0]->getPropertyPath() => ['errors' => [$validation[0]->getMessage()]]]]], Response::HTTP_BAD_REQUEST));
                            }
                        }
                    }
                }
                break;
            default:
                foreach ($members as $member) {
                    $member->setAmountPayed($priceService->getPrice($member));
                }
                break;
        }

        foreach ($members as $member) {
            $member->setIsPayed(true);
            $member->setPaymentSolution($paymentSolution);
            if ($member->getPaymentSolution()->getId() !== 3) $member->setAmountPayedOther(null);
            if ($member->getPaymentSolution()->getId() !== 1) $member->setPaypalInformation(null);
            $em->persist($member);
        }
        $em->flush();

        //Send mail recap with facture
        if (sizeof($members) > 0) $mailService->sendFacture($members[0]->getUser(), $members);

        return $this->handleView($this->view(
            $this->getDoctrine()->getRepository(Member::class)->findBy(['user' => $this->getUser(), 'season' => $paramService->getCurrentSeason()])
        )->setContext((new Context())->setGroups([Constants::BASIC])));
    }
}
