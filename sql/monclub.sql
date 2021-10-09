-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 11, 2020 at 05:14 PM
-- Server version: 5.7.26
-- PHP Version: 7.3.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `monclub`
--

-- --------------------------------------------------------

--
-- Table structure for table `mc_dev_activity_history`
--

DROP TABLE IF EXISTS `mc_dev_activity_history`;
CREATE TABLE IF NOT EXISTS `mc_dev_activity_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_D29D53576B3CA4B` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_dev_activity_history`
--

INSERT INTO `mc_dev_activity_history` (`id`, `id_user`, `date`) VALUES
(1, 2, '2020-01-02'),
(2, 1, '2020-01-03'),
(3, 1, '2020-01-02'),
(4, 1, '2020-01-01'),
(5, 2, '2020-01-03'),
(6, 2, '2020-01-03'),
(7, 2, '2020-01-04'),
(8, 4, '2020-01-04'),
(9, 1, '2020-01-04'),
(10, 2, '2020-01-05'),
(11, 1, '2020-01-05'),
(12, 1, '2020-01-06'),
(13, 1, '2020-01-07'),
(14, 1, '2020-01-08'),
(15, 1, '2020-01-09'),
(16, 1, '2020-01-10'),
(17, 5, '2020-01-10'),
(18, 6, '2020-01-10'),
(19, 1, '2020-01-11'),
(20, 1, '2020-01-12'),
(21, 1, '2020-01-13'),
(22, 1, '2020-01-15'),
(23, 1, '2020-01-16'),
(24, 1, '2020-01-22'),
(25, 1, '2020-01-24'),
(26, 1, '2020-01-25'),
(27, 1, '2020-01-26'),
(28, 1, '2020-01-27'),
(29, 1, '2020-01-28'),
(30, 1, '2020-01-29'),
(31, 1, '2020-02-01'),
(32, 2, '2020-02-01'),
(33, 5, '2020-02-01'),
(34, 1, '2020-02-02'),
(35, 1, '2020-02-11'),
(37, 12, '2020-02-11'),
(38, 1, '2020-02-12'),
(39, 1, '2020-02-13'),
(40, 1, '2020-02-15'),
(41, 1, '2020-02-16'),
(42, 2, '2020-02-16'),
(43, 13, '2020-02-16'),
(44, 1, '2020-02-17'),
(45, 1, '2020-02-18'),
(46, 2, '2020-02-18'),
(47, 13, '2020-02-18'),
(48, 1, '2020-02-19'),
(49, 1, '2020-02-27'),
(50, 1, '2020-03-08'),
(51, 1, '2020-03-11');

-- --------------------------------------------------------

--
-- Table structure for table `mc_dev_document`
--

DROP TABLE IF EXISTS `mc_dev_document`;
CREATE TABLE IF NOT EXISTS `mc_dev_document` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_member` int(11) DEFAULT NULL,
  `id_category` int(11) DEFAULT NULL,
  `updated_at` datetime NOT NULL,
  `document_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `document_original_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `document_mime_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `document_size` int(11) DEFAULT NULL,
  `document_dimensions` longtext COLLATE utf8mb4_unicode_ci COMMENT '(DC2Type:simple_array)',
  PRIMARY KEY (`id`),
  KEY `IDX_56853FD456D34F95` (`id_member`),
  KEY `IDX_56853FD45697F554` (`id_category`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_dev_document`
--

INSERT INTO `mc_dev_document` (`id`, `id_member`, `id_category`, `updated_at`, `document_name`, `document_original_name`, `document_mime_type`, `document_size`, `document_dimensions`) VALUES
(44, 47, 1, '2020-01-29 19:51:13', '2019-2020-aze-qds_electricien_5e31d42155d82.jpeg', 'electricien.jpeg', 'image/jpeg', 197090, '1920,1276'),
(45, 49, 1, '2020-02-15 16:21:21', '2019-2020-caumes-kiki_electricien_5e480c719f7cf.jpeg', 'electricien.jpeg', 'image/jpeg', 197090, '1920,1276'),
(46, 50, 1, '2020-02-15 16:44:11', '2019-2020-qsddqs-eazeaz_electricien_5e4811cb81470.jpeg', 'electricien.jpeg', 'image/jpeg', 197090, '1920,1276'),
(47, 50, 2, '2020-02-15 16:44:13', '2019-2020-qsddqs-eazeaz_cadena_5e4811cd83291.jpg', 'cadena.jpg', 'image/jpeg', 1483697, '1920,1204'),
(48, 52, 1, '2020-02-16 15:48:44', '2019-2020-qsdqsdqsd-ezaqsd_electricien_5e49564c799a6.jpeg', 'electricien.jpeg', 'image/jpeg', 197090, '1920,1276'),
(49, 52, 2, '2020-02-16 15:48:45', '2019-2020-qsdqsdqsd-ezaqsd_connect_5e49564da1883.jpg', 'connect.jpg', 'image/jpeg', 674962, '1920,1281'),
(50, 54, 1, '2020-02-18 21:11:21', '2019-2020-dsqdqs-dsq_electricien_5e4c44e95f603.jpeg', 'electricien.jpeg', 'image/jpeg', 197090, '1920,1276');

-- --------------------------------------------------------

--
-- Table structure for table `mc_dev_member`
--

DROP TABLE IF EXISTS `mc_dev_member`;
CREATE TABLE IF NOT EXISTS `mc_dev_member` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_payment_solution` int(11) DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_season` int(11) DEFAULT NULL,
  `firstname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthdate` date NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `street` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profession` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_one_firstname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_one_lastname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_one_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_one_phone_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_one_profession` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_two_firstname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_two_lastname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_two_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_two_phone_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_two_profession` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_evacuation_allow` tinyint(1) NOT NULL DEFAULT '0',
  `is_transport_allow` tinyint(1) NOT NULL DEFAULT '0',
  `is_image_allow` tinyint(1) NOT NULL DEFAULT '0',
  `is_return_home_allow` tinyint(1) NOT NULL DEFAULT '0',
  `is_newsletter_allow` tinyint(1) NOT NULL DEFAULT '0',
  `is_accepted` tinyint(1) NOT NULL DEFAULT '0',
  `is_reduced_price` tinyint(1) NOT NULL DEFAULT '0',
  `is_non_competitive` tinyint(1) NOT NULL DEFAULT '0',
  `is_transfer_needed` tinyint(1) NOT NULL DEFAULT '0',
  `is_document_complete` tinyint(1) NOT NULL DEFAULT '0',
  `is_payed` tinyint(1) NOT NULL DEFAULT '0',
  `amount_payed` decimal(5,2) DEFAULT NULL,
  `is_check_gest_hand` tinyint(1) NOT NULL DEFAULT '0',
  `is_inscription_done` tinyint(1) NOT NULL DEFAULT '0',
  `creation_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notes` longtext COLLATE utf8mb4_unicode_ci,
  `id_sex` int(11) DEFAULT NULL,
  `gesthand_is_photo` tinyint(1) NOT NULL,
  `gesthand_is_certificate` tinyint(1) NOT NULL,
  `gesthand_certificate_date` date DEFAULT NULL,
  `gesthand_is_health_questionnaire` tinyint(1) NOT NULL,
  `gesthand_is_ffhb_authorization` tinyint(1) NOT NULL,
  `gesthand_qualification_date` date DEFAULT NULL,
  `gesthand_is_photo_id` tinyint(1) NOT NULL,
  `amount_payed_other` int(11) DEFAULT NULL,
  `is_license_renewal` tinyint(1) NOT NULL,
  `payment_notes` longtext COLLATE utf8mb4_unicode_ci,
  `id_paypal_information` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_425D51CB3C7F3E62` (`id_payment_solution`),
  KEY `IDX_425D51CB6B3CA4B` (`id_user`),
  KEY `IDX_425D51CBD6D3EE44` (`id_season`),
  KEY `IDX_425D51CB710681AD` (`id_sex`),
  KEY `IDX_425D51CB54D97364` (`id_paypal_information`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_dev_member`
--

INSERT INTO `mc_dev_member` (`id`, `id_payment_solution`, `id_user`, `id_season`, `firstname`, `lastname`, `birthdate`, `email`, `phone_number`, `postal_code`, `street`, `city`, `profession`, `parent_one_firstname`, `parent_one_lastname`, `parent_one_email`, `parent_one_phone_number`, `parent_one_profession`, `parent_two_firstname`, `parent_two_lastname`, `parent_two_email`, `parent_two_phone_number`, `parent_two_profession`, `is_evacuation_allow`, `is_transport_allow`, `is_image_allow`, `is_return_home_allow`, `is_newsletter_allow`, `is_accepted`, `is_reduced_price`, `is_non_competitive`, `is_transfer_needed`, `is_document_complete`, `is_payed`, `amount_payed`, `is_check_gest_hand`, `is_inscription_done`, `creation_datetime`, `notes`, `id_sex`, `gesthand_is_photo`, `gesthand_is_certificate`, `gesthand_certificate_date`, `gesthand_is_health_questionnaire`, `gesthand_is_ffhb_authorization`, `gesthand_qualification_date`, `gesthand_is_photo_id`, `amount_payed_other`, `is_license_renewal`, `payment_notes`, `id_paypal_information`) VALUES
(1, 3, 1, NULL, 'Kirian', 'Caumes', '1995-01-23', 'kiki@mail.com', '0123456789', '44470', '145 Rue de la Citrie', 'Mauves sur Loire', 'tyest', 'zeryre', 'sfd', 'parent@gmail.com', '0123456789', NULL, NULL, NULL, NULL, '__________', NULL, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, '165.00', 1, 1, '2020-01-02 19:22:18', 'azeeazeazeaz\n\ndsq\n\n>', 1, 0, 0, NULL, 0, 0, NULL, 0, NULL, 0, NULL, NULL),
(2, NULL, 3, NULL, 'test', 'test', '1997-02-19', 'dqsqsd@mail.com', '1254654645', '56445', '456456546', '654654', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, NULL, 0, 0, '2020-01-01 20:32:41', NULL, NULL, 0, 0, NULL, 0, 0, NULL, 0, NULL, 0, NULL, NULL),
(4, 2, 2, NULL, 'dqs', 'dqs', '2005-01-22', 'dqs@mail.com', '7878978789', '77798', 'dqs', 'dqs', 'qds', 'test', 'abcde', 'parent@email.com', '012345789_', 'test', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, '180.00', 0, 0, '2020-01-05 11:46:08', NULL, NULL, 0, 0, NULL, 0, 0, NULL, 0, NULL, 0, NULL, NULL),
(21, 2, 1, 1, 'qds', 'aze', '1997-02-13', 'dqsdqs@mail.com', '1213213213', '23112', '123123123312', '312312', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, '150.00', 0, 0, '2020-01-24 20:33:11', NULL, 1, 0, 0, NULL, 0, 0, NULL, 0, 52, 0, 'test', NULL),
(47, 3, 1, 2, 'qds', 'aze', '1997-01-20', 'dqsdqs@mail.com', '1213213213', '23119', '123123123312', '312312', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, '304.00', 1, 1, '2020-01-29 18:50:29', NULL, 1, 0, 0, NULL, 0, 0, NULL, 0, NULL, 1, NULL, NULL),
(48, 3, 1, 2, 'qsqds }} \" \' }}', 'azeazeaz', '2012-01-14', 'dqsdqs@mail.com', '0123456789', '44444', '47879', '789879', NULL, 'dqs', 'aze', 'qsdqsd@mail.com', '7898797898', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, '110.00', 0, 0, '2020-02-12 20:39:07', NULL, 1, 0, 0, NULL, 0, 0, NULL, 0, 12, 0, NULL, NULL),
(49, 1, 1, 2, 'Kiki', 'caumes', '2012-02-20', 'dsqdqs@mail.com', '__________', '23233', '23323223', '23322332', NULL, 'qdsdqs', 'dqsdqs', 'dqsdqs@mail.com', '1234567899', NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, '105.00', 0, 0, '2020-02-15 16:21:18', NULL, 1, 0, 0, NULL, 0, 0, NULL, 0, NULL, 0, NULL, 8),
(50, 2, 1, 1, 'eazeaz', 'qsddqs', '1977-02-12', 'dqsdqs@mail.com', '0123456789', '41554', '45456564564', '456546546', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, '289.00', 0, 0, '2020-02-15 16:44:08', NULL, 1, 0, 0, NULL, 0, 0, NULL, 0, NULL, 0, NULL, NULL),
(51, NULL, NULL, 2, 'gvdsffsd', 'fsdfdssdf', '1995-02-18', 'dqsdqs@mail.com', '0123456789', '44444', '444', '44', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, NULL, 0, 0, '2020-02-15 19:10:59', NULL, 1, 0, 0, NULL, 0, 0, NULL, 0, NULL, 0, NULL, NULL),
(52, 1, 1, 2, 'ezaqsd', 'qsdqsdqsd', '1997-02-20', 'lrqsdqsd@mail.com', '0123458778', '44447', '0qdsdqs', 'dqsdqsd', 'dsqqds', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, '5.00', 0, 0, '2020-02-16 15:48:40', NULL, 1, 0, 0, NULL, 0, 0, NULL, 0, NULL, 0, NULL, 12),
(53, NULL, 1, 2, 'dqs', 'dqs', '1997-02-19', 'dqsdqs@mail.com', '0121231232', '12121', '1212d123213qds321', 'dqsdqs', '213', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, NULL, 1, 1, '2020-02-16 16:51:31', NULL, 2, 0, 0, '2000-09-30', 0, 0, '2019-09-30', 0, NULL, 0, NULL, NULL),
(54, 2, 13, 2, 'dsq', 'dsqdqs', '1999-02-19', 'dqsdqs@mail.com', '0123132123', '12112', '1213213', '123213', '21123', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, '180.00', 0, 0, '2020-02-18 21:11:08', NULL, 1, 0, 0, NULL, 0, 0, NULL, 0, NULL, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `mc_dev_member_teams`
--

DROP TABLE IF EXISTS `mc_dev_member_teams`;
CREATE TABLE IF NOT EXISTS `mc_dev_member_teams` (
  `member_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  PRIMARY KEY (`member_id`,`team_id`),
  KEY `IDX_28DF48197597D3FE` (`member_id`),
  KEY `IDX_28DF4819296CD8AE` (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mc_dev_param_document_category`
--

DROP TABLE IF EXISTS `mc_dev_param_document_category`;
CREATE TABLE IF NOT EXISTS `mc_dev_param_document_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_dev_param_document_category`
--

INSERT INTO `mc_dev_param_document_category` (`id`, `label`) VALUES
(1, 'Certificat médical'),
(2, 'Justificatif étudiant/chomeur');

-- --------------------------------------------------------

--
-- Table structure for table `mc_dev_param_global`
--

DROP TABLE IF EXISTS `mc_dev_param_global`;
CREATE TABLE IF NOT EXISTS `mc_dev_param_global` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_dev_param_global`
--

INSERT INTO `mc_dev_param_global` (`id`, `label`, `value`) VALUES
(1, 'reduced_price_before_deadline', '140'),
(2, 'reduced_price_after_deadline', '160'),
(3, 'price_deadline', '2019-07-12'),
(4, 'text_infos_admin', 'Bienvenu sur la plateforme <b>Mon Club – club</b>, l’application qui va vous permettre de rejoindre le <b>Thouaré Handball Club 🤾</b> avec une inscription 100% numérique 💻.<br/> Grâce au compte sur lequel vous êtes connecté en ce moment, vous êtes désormais en mesure d’enregistrer l’ensemble des membres de votre famille et vous-même pour rejoindre le club 👪.<br/> Laissez-vous guider via les différentes étapes du processus d’inscription grâce à la page « Mes Membres ». Pensez à vous inscrire avant le <b>14 juillet 2019</b> afin de bénéficier d’une réduction tarifaire. L’ensemble des informations sont retrouvables sur notre site : <a href=\"https://thouarehbc.fr\">thouarehbc.fr</a>.'),
(5, 'text_infos_user', 'Bienvenu sur la plateforme <b>Mon Club – club</b>, l’application qui va vous permettre de rejoindre le <b>Thouaré Handball Club 🤾</b> avec une inscription 100% numérique 💻.<br/> Grâce au compte sur lequel vous êtes connecté en ce moment, vous êtes désormais en mesure d’enregistrer l’ensemble des membres de votre famille et vous-même pour rejoindre le club 👪.<br/> Laissez-vous guider via les différentes étapes du processus d’inscription grâce à la page « Mes Membres ». Pensez à vous inscrire avant le <b>14 juillet 2019</b> afin de bénéficier d’une réduction tarifaire. L’ensemble des informations sont retrouvables sur notre site : <a href=\"https://thouarehbc.fr\">thouarehbc.fr</a>.'),
(6, 'president_firstname', 'benjamin1'),
(7, 'president_lastname', 'paire'),
(8, 'is_create_new_user_able', 'true'),
(9, 'new_member_deadline', ''),
(10, 'is_create_new_member_able', 'true'),
(11, 'secretary_firstname', 'carole'),
(12, 'secretary_lastname', 'blanchard'),
(13, 'date_mail_renew_certif', '01-05'),
(14, 'paypal_fee', '5');

-- --------------------------------------------------------

--
-- Table structure for table `mc_dev_param_payment_solution`
--

DROP TABLE IF EXISTS `mc_dev_param_payment_solution`;
CREATE TABLE IF NOT EXISTS `mc_dev_param_payment_solution` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_dev_param_payment_solution`
--

INSERT INTO `mc_dev_param_payment_solution` (`id`, `label`, `icon`) VALUES
(1, 'Paypal', 'PaymentCard'),
(2, 'Chèque', 'Document'),
(3, 'Chèque & coupon(s)', 'DocumentSet');

-- --------------------------------------------------------

--
-- Table structure for table `mc_dev_param_price_global`
--

DROP TABLE IF EXISTS `mc_dev_param_price_global`;
CREATE TABLE IF NOT EXISTS `mc_dev_param_price_global` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_season` int(11) DEFAULT NULL,
  `reduced_price_before_deadline` int(11) NOT NULL,
  `reduced_price_after_deadline` int(11) NOT NULL,
  `deadline_date` date NOT NULL,
  `paypal_fee` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_91AFC90CD6D3EE44` (`id_season`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_dev_param_price_global`
--

INSERT INTO `mc_dev_param_price_global` (`id`, `id_season`, `reduced_price_before_deadline`, `reduced_price_after_deadline`, `deadline_date`, `paypal_fee`) VALUES
(2, 1, 140, 160, '2019-07-12', 5),
(4, 3, 140, 122, '1999-07-15', 5),
(6, 15, 11, 11, '2021-12-11', 78),
(7, 11, 140, 122, '1999-07-15', 5),
(17, 2, 154, 160, '1998-07-13', 5);

-- --------------------------------------------------------

--
-- Table structure for table `mc_dev_param_price_license`
--

DROP TABLE IF EXISTS `mc_dev_param_price_license`;
CREATE TABLE IF NOT EXISTS `mc_dev_param_price_license` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_before_deadline` int(11) NOT NULL,
  `price_after_deadline` int(11) NOT NULL,
  `min_year` int(11) NOT NULL,
  `max_year` int(11) NOT NULL,
  `id_season` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_2A16C0EAD6D3EE44` (`id_season`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_dev_param_price_license`
--

INSERT INTO `mc_dev_param_price_license` (`id`, `label`, `price_before_deadline`, `price_after_deadline`, `min_year`, `max_year`, `id_season`) VALUES
(5, '2014 à 2011 inclus', 100, 120, 2011, 2014, 1),
(6, '2010 à 2008 inclus', 135, 155, 2008, 2010, 1),
(7, '2007 à 2002 inclus', 145, 165, 2002, 2007, 1),
(8, '2001 et avant', 160, 2000, 1900, 2001, 1),
(10, '2014 à 2011 inclus', 100, 120, 2011, 2014, 3),
(11, '2010 à 2008 inclus', 135, 155, 2008, 2010, 3),
(12, '2007 à 2002 inclus', 145, 165, 2002, 2007, 3),
(13, '2001 et avant', 160, 180, 1900, 2001, 3),
(19, 'test', 123, 123, 1232, 7878, 15),
(20, '2014 à 2011 inclus', 100, 120, 2011, 2014, 11),
(21, '2010 à 2008 inclus', 135, 155, 2008, 2010, 11),
(22, '2007 à 2002 inclus', 145, 165, 2002, 2007, 11),
(23, '2001 et avant', 160, 180, 1900, 2001, 11),
(60, '2014 à 2011 inclus', 100, 120, 2011, 2014, 2),
(61, '2010 à 2008 inclus', 135, 155, 2008, 2010, 2),
(62, '2007 à 2002 inclus', 145, 165, 2002, 2007, 2),
(63, '2001 et avant', 160, 180, 1900, 2001, 2);

-- --------------------------------------------------------

--
-- Table structure for table `mc_dev_param_price_transfer`
--

DROP TABLE IF EXISTS `mc_dev_param_price_transfer`;
CREATE TABLE IF NOT EXISTS `mc_dev_param_price_transfer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int(11) NOT NULL,
  `min_age` int(11) NOT NULL,
  `max_age` int(11) NOT NULL,
  `id_season` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_64FD7E52D6D3EE44` (`id_season`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_dev_param_price_transfer`
--

INSERT INTO `mc_dev_param_price_transfer` (`id`, `label`, `price`, `min_age`, `max_age`, `id_season`) VALUES
(4, '+16 ans', 119, 16, 99, 1),
(5, '12 à 16 ans inclus', 73, 12, 16, 1),
(6, '-12 ans', 0, 0, 12, 1),
(7, '+16 ans', 119, 16, 99, 3),
(8, '12 à 16 ans inclus', 73, 12, 16, 3),
(9, '-12 ans', 0, 0, 12, 3),
(13, 'sqd', 111, 144, 78, 15),
(14, '+16 ans', 119, 16, 99, 11),
(15, '12 à 16 ans inclus', 73, 12, 16, 11),
(16, '-12 ans', 0, 0, 12, 11),
(44, '+16 ans', 119, 17, 99, 2),
(45, '12 à 16 ans inclus', 73, 12, 16, 2),
(46, '-12 ans', 0, 0, 11, 2);

-- --------------------------------------------------------

--
-- Table structure for table `mc_dev_param_reduction_family`
--

DROP TABLE IF EXISTS `mc_dev_param_reduction_family`;
CREATE TABLE IF NOT EXISTS `mc_dev_param_reduction_family` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` int(11) NOT NULL,
  `discount` int(11) NOT NULL,
  `id_season` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_4334D1B7D6D3EE44` (`id_season`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_dev_param_reduction_family`
--

INSERT INTO `mc_dev_param_reduction_family` (`id`, `number`, `discount`, `id_season`) VALUES
(5, 1, 0, 1),
(6, 2, 10, 1),
(7, 3, 20, 1),
(8, 4, 30, 1),
(9, 1, 0, 3),
(10, 2, 10, 3),
(11, 3, 20, 3),
(12, 4, 30, 3),
(17, 0, 12, 15),
(18, 1, 0, 11),
(19, 2, 10, 11),
(20, 3, 20, 11),
(21, 4, 30, 11),
(58, 1, 0, 2),
(59, 2, 10, 2),
(60, 3, 20, 2),
(61, 4, 30, 2);

-- --------------------------------------------------------

--
-- Table structure for table `mc_dev_param_season`
--

DROP TABLE IF EXISTS `mc_dev_param_season`;
CREATE TABLE IF NOT EXISTS `mc_dev_param_season` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `is_current` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_dev_param_season`
--

INSERT INTO `mc_dev_param_season` (`id`, `label`, `is_active`, `is_current`) VALUES
(1, '2018/2019', 1, 0),
(2, '2019/2020', 1, 1),
(3, '2020/2021', 0, 0),
(4, '2021/2022', 0, 0),
(5, '2022/2023', 0, 0),
(6, '2023/2024', 0, 0),
(7, '2024/2025', 0, 0),
(8, '2025/2026', 0, 0),
(9, '2026/2027', 0, 0),
(10, '2027/2028', 0, 0),
(11, '2028/2029', 0, 0),
(12, '2029/2030', 0, 0),
(13, '2030/2031', 0, 0),
(14, '2031/2032', 0, 0),
(15, '2032/2033', 0, 0),
(16, '2033/2034', 0, 0),
(17, '2034/2035', 0, 0),
(18, '2035/2036', 0, 0),
(19, '2036/2037', 0, 0),
(20, '2037/2038', 0, 0),
(21, '2038/2039', 0, 0),
(22, '2039/2040', 0, 0),
(23, '2040/2041', 0, 0),
(24, '2041/2042', 0, 0),
(25, '2042/2043', 0, 0),
(26, '2043/2044', 0, 0),
(27, '2044/2045', 0, 0),
(28, '2045/2046', 0, 0),
(29, '2046/2047', 0, 0),
(30, '2047/2048', 0, 0),
(31, '2048/2049', 0, 0),
(32, '2049/2050', 0, 0),
(33, '2050/2051', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `mc_dev_param_sex`
--

DROP TABLE IF EXISTS `mc_dev_param_sex`;
CREATE TABLE IF NOT EXISTS `mc_dev_param_sex` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `civility` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_dev_param_sex`
--

INSERT INTO `mc_dev_param_sex` (`id`, `label`, `icon`, `civility`) VALUES
(1, 'Homme', 'Man', ''),
(2, 'Femme', 'Woman', '');

-- --------------------------------------------------------

--
-- Table structure for table `mc_dev_param_workflow`
--

DROP TABLE IF EXISTS `mc_dev_param_workflow`;
CREATE TABLE IF NOT EXISTS `mc_dev_param_workflow` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_dev_param_workflow`
--

INSERT INTO `mc_dev_param_workflow` (`id`, `label`, `description`, `message`) VALUES
(1, 'Créé', 'L\'utilisateur est créé.', NULL),
(2, 'Documents', 'L\'utilisateur à fournis les documents nécessaires.', 'Passer cet élément de \"Oui\" à \"Non\" réactivera l\'édition du membre pour l\'utilisateur propriétaire et lui enverras un mail lui signalant que ces documents sont invalides.'),
(3, 'Payé', 'L\'utilisateur à payé.', 'Lorsque cette étape est validée, l\'ensemble des champs relatif au paiement sont désactivés.'),
(4, 'Gest\'hand', 'L\'utilisateur est bien inscris sur Gest\'hand.', NULL),
(5, 'Qualifié', 'L\'inscription est finalisée.', 'Passer cet élément de \"Non\" à \"Oui\" enverra un mail à l\'utilisateur lui signalant que l\'inscription de membre est validée.\r\n');

-- --------------------------------------------------------

--
-- Table structure for table `mc_dev_paypal_information`
--

DROP TABLE IF EXISTS `mc_dev_paypal_information`;
CREATE TABLE IF NOT EXISTS `mc_dev_paypal_information` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_payment` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creation_datetime` datetime DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `currency` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `firstname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_dev_paypal_information`
--

INSERT INTO `mc_dev_paypal_information` (`id`, `id_payment`, `creation_datetime`, `amount`, `currency`, `email`, `country`, `firstname`, `lastname`, `data`) VALUES
(1, '2AV47393LH730133K', '2020-02-13 00:00:00', 115, 'EUR', 'sb-qqpod983866@personal.example.com', 'FR', 'John', 'Doe', '{\"details\":{\"create_time\":\"2020-02-13T17:38:04Z\",\"update_time\":\"2020-02-13T17:38:50Z\",\"id\":\"4PA10916R5172521D\",\"intent\":\"CAPTURE\",\"status\":\"COMPLETED\",\"payer\":{\"email_address\":\"sb-qqpod983866@personal.example.com\",\"payer_id\":\"4SDFF52K6JAHN\",\"address\":{\"country_code\":\"FR\"},\"name\":{\"given_name\":\"John\",\"surname\":\"Doe\"}},\"purchase_units\":[{\"reference_id\":\"default\",\"amount\":{\"value\":\"115.00\",\"currency_code\":\"EUR\"},\"payee\":{\"email_address\":\"sb-htiha986612@business.example.com\",\"merchant_id\":\"5PEQTR2XQ3UCU\"},\"payments\":{\"captures\":[{\"status\":\"COMPLETED\",\"id\":\"2AV47393LH730133K\",\"final_capture\":true,\"create_time\":\"2020-02-13T17:38:50Z\",\"update_time\":\"2020-02-13T17:38:50Z\",\"amount\":{\"value\":\"115.00\",\"currency_code\":\"EUR\"},\"seller_protection\":{\"status\":\"ELIGIBLE\",\"dispute_categories\":[\"ITEM_NOT_RECEIVED\",\"UNAUTHORIZED_TRANSACTION\"]},\"links\":[{\"href\":\"https://api.sandbox.paypal.com/v2/payments/captures/2AV47393LH730133K\",\"rel\":\"self\",\"method\":\"GET\",\"title\":\"GET\"},{\"href\":\"https://api.sandbox.paypal.com/v2/payments/captures/2AV47393LH730133K/refund\",\"rel\":\"refund\",\"method\":\"POST\",\"title\":\"POST\"},{\"href\":\"https://api.sandbox.paypal.com/v2/checkout/orders/4PA10916R5172521D\",\"rel\":\"up\",\"method\":\"GET\",\"title\":\"GET\"}]}]}}],\"links\":[{\"href\":\"https://api.sandbox.paypal.com/v2/checkout/orders/4PA10916R5172521D\",\"rel\":\"self\",\"method\":\"GET\",\"title\":\"GET\"}]},\"data\":{\"orderID\":\"4PA10916R5172521D\",\"payerID\":\"4SDFF52K6JAHN\",\"facilitatorAccessToken\":\"A21AAG_I_3vgj0smc5fLKo8RiguNNeKbWXuqiJybTSEJCMNDC4IXDDPK_kX8J_6-H0q1BOI59KM1d6SpWOd75AA1cVjrwq8lA\"}}'),
(2, '3L285345TG125862X', '2020-02-13 17:44:12', 115, 'EUR', 'sb-qqpod983866@personal.example.com', 'FR', 'John', 'Doe', '{\"details\":{\"create_time\":\"2020-02-13T17:43:28Z\",\"update_time\":\"2020-02-13T17:44:12Z\",\"id\":\"6X545319SN576404H\",\"intent\":\"CAPTURE\",\"status\":\"COMPLETED\",\"payer\":{\"email_address\":\"sb-qqpod983866@personal.example.com\",\"payer_id\":\"4SDFF52K6JAHN\",\"address\":{\"country_code\":\"FR\"},\"name\":{\"given_name\":\"John\",\"surname\":\"Doe\"}},\"purchase_units\":[{\"reference_id\":\"default\",\"amount\":{\"value\":\"115.00\",\"currency_code\":\"EUR\"},\"payee\":{\"email_address\":\"sb-htiha986612@business.example.com\",\"merchant_id\":\"5PEQTR2XQ3UCU\"},\"payments\":{\"captures\":[{\"status\":\"COMPLETED\",\"id\":\"3L285345TG125862X\",\"final_capture\":true,\"create_time\":\"2020-02-13T17:44:12Z\",\"update_time\":\"2020-02-13T17:44:12Z\",\"amount\":{\"value\":\"115.00\",\"currency_code\":\"EUR\"},\"seller_protection\":{\"status\":\"ELIGIBLE\",\"dispute_categories\":[\"ITEM_NOT_RECEIVED\",\"UNAUTHORIZED_TRANSACTION\"]},\"links\":[{\"href\":\"https://api.sandbox.paypal.com/v2/payments/captures/3L285345TG125862X\",\"rel\":\"self\",\"method\":\"GET\",\"title\":\"GET\"},{\"href\":\"https://api.sandbox.paypal.com/v2/payments/captures/3L285345TG125862X/refund\",\"rel\":\"refund\",\"method\":\"POST\",\"title\":\"POST\"},{\"href\":\"https://api.sandbox.paypal.com/v2/checkout/orders/6X545319SN576404H\",\"rel\":\"up\",\"method\":\"GET\",\"title\":\"GET\"}]}]}}],\"links\":[{\"href\":\"https://api.sandbox.paypal.com/v2/checkout/orders/6X545319SN576404H\",\"rel\":\"self\",\"method\":\"GET\",\"title\":\"GET\"}]},\"data\":{\"orderID\":\"6X545319SN576404H\",\"payerID\":\"4SDFF52K6JAHN\",\"facilitatorAccessToken\":\"A21AAG_I_3vgj0smc5fLKo8RiguNNeKbWXuqiJybTSEJCMNDC4IXDDPK_kX8J_6-H0q1BOI59KM1d6SpWOd75AA1cVjrwq8lA\"}}'),
(3, '3L285345TG125862X', '2020-02-13 17:44:12', 115, 'EUR', 'sb-qqpod983866@personal.example.com', 'FR', 'John', 'Doe', '{\"details\":{\"create_time\":\"2020-02-13T17:43:28Z\",\"update_time\":\"2020-02-13T17:44:12Z\",\"id\":\"6X545319SN576404H\",\"intent\":\"CAPTURE\",\"status\":\"COMPLETED\",\"payer\":{\"email_address\":\"sb-qqpod983866@personal.example.com\",\"payer_id\":\"4SDFF52K6JAHN\",\"address\":{\"country_code\":\"FR\"},\"name\":{\"given_name\":\"John\",\"surname\":\"Doe\"}},\"purchase_units\":[{\"reference_id\":\"default\",\"amount\":{\"value\":\"115.00\",\"currency_code\":\"EUR\"},\"payee\":{\"email_address\":\"sb-htiha986612@business.example.com\",\"merchant_id\":\"5PEQTR2XQ3UCU\"},\"payments\":{\"captures\":[{\"status\":\"COMPLETED\",\"id\":\"3L285345TG125862X\",\"final_capture\":true,\"create_time\":\"2020-02-13T17:44:12Z\",\"update_time\":\"2020-02-13T17:44:12Z\",\"amount\":{\"value\":\"115.00\",\"currency_code\":\"EUR\"},\"seller_protection\":{\"status\":\"ELIGIBLE\",\"dispute_categories\":[\"ITEM_NOT_RECEIVED\",\"UNAUTHORIZED_TRANSACTION\"]},\"links\":[{\"href\":\"https://api.sandbox.paypal.com/v2/payments/captures/3L285345TG125862X\",\"rel\":\"self\",\"method\":\"GET\",\"title\":\"GET\"},{\"href\":\"https://api.sandbox.paypal.com/v2/payments/captures/3L285345TG125862X/refund\",\"rel\":\"refund\",\"method\":\"POST\",\"title\":\"POST\"},{\"href\":\"https://api.sandbox.paypal.com/v2/checkout/orders/6X545319SN576404H\",\"rel\":\"up\",\"method\":\"GET\",\"title\":\"GET\"}]}]}}],\"links\":[{\"href\":\"https://api.sandbox.paypal.com/v2/checkout/orders/6X545319SN576404H\",\"rel\":\"self\",\"method\":\"GET\",\"title\":\"GET\"}]},\"data\":{\"orderID\":\"6X545319SN576404H\",\"payerID\":\"4SDFF52K6JAHN\",\"facilitatorAccessToken\":\"A21AAG_I_3vgj0smc5fLKo8RiguNNeKbWXuqiJybTSEJCMNDC4IXDDPK_kX8J_6-H0q1BOI59KM1d6SpWOd75AA1cVjrwq8lA\"}}'),
(4, '94554508RA253202H', '2020-02-13 17:51:15', 115, 'EUR', 'sb-qqpod983866@personal.example.com', 'FR', 'John', 'Doe', '{\"details\":{\"create_time\":\"2020-02-13T17:49:40Z\",\"update_time\":\"2020-02-13T17:51:15Z\",\"id\":\"6C168994X75851223\",\"intent\":\"CAPTURE\",\"status\":\"COMPLETED\",\"payer\":{\"email_address\":\"sb-qqpod983866@personal.example.com\",\"payer_id\":\"4SDFF52K6JAHN\",\"address\":{\"country_code\":\"FR\"},\"name\":{\"given_name\":\"John\",\"surname\":\"Doe\"}},\"purchase_units\":[{\"reference_id\":\"default\",\"amount\":{\"value\":\"115.00\",\"currency_code\":\"EUR\"},\"payee\":{\"email_address\":\"sb-htiha986612@business.example.com\",\"merchant_id\":\"5PEQTR2XQ3UCU\"},\"payments\":{\"captures\":[{\"status\":\"COMPLETED\",\"id\":\"94554508RA253202H\",\"final_capture\":true,\"create_time\":\"2020-02-13T17:51:15Z\",\"update_time\":\"2020-02-13T17:51:15Z\",\"amount\":{\"value\":\"115.00\",\"currency_code\":\"EUR\"},\"seller_protection\":{\"status\":\"ELIGIBLE\",\"dispute_categories\":[\"ITEM_NOT_RECEIVED\",\"UNAUTHORIZED_TRANSACTION\"]},\"links\":[{\"href\":\"https://api.sandbox.paypal.com/v2/payments/captures/94554508RA253202H\",\"rel\":\"self\",\"method\":\"GET\",\"title\":\"GET\"},{\"href\":\"https://api.sandbox.paypal.com/v2/payments/captures/94554508RA253202H/refund\",\"rel\":\"refund\",\"method\":\"POST\",\"title\":\"POST\"},{\"href\":\"https://api.sandbox.paypal.com/v2/checkout/orders/6C168994X75851223\",\"rel\":\"up\",\"method\":\"GET\",\"title\":\"GET\"}]}]}}],\"links\":[{\"href\":\"https://api.sandbox.paypal.com/v2/checkout/orders/6C168994X75851223\",\"rel\":\"self\",\"method\":\"GET\",\"title\":\"GET\"}]},\"data\":{\"orderID\":\"6C168994X75851223\",\"payerID\":\"4SDFF52K6JAHN\",\"facilitatorAccessToken\":\"A21AAG_I_3vgj0smc5fLKo8RiguNNeKbWXuqiJybTSEJCMNDC4IXDDPK_kX8J_6-H0q1BOI59KM1d6SpWOd75AA1cVjrwq8lA\"}}'),
(5, '2NV575982G2813053', '2020-02-13 18:25:58', 404, 'EUR', 'sb-qqpod983866@personal.example.com', 'FR', 'John', 'Doe', '{\"details\":{\"create_time\":\"2020-02-13T18:24:12Z\",\"update_time\":\"2020-02-13T18:25:58Z\",\"id\":\"9WE87096G21065814\",\"intent\":\"CAPTURE\",\"status\":\"COMPLETED\",\"payer\":{\"email_address\":\"sb-qqpod983866@personal.example.com\",\"payer_id\":\"4SDFF52K6JAHN\",\"address\":{\"country_code\":\"FR\"},\"name\":{\"given_name\":\"John\",\"surname\":\"Doe\"}},\"purchase_units\":[{\"reference_id\":\"default\",\"amount\":{\"value\":\"404.00\",\"currency_code\":\"EUR\"},\"payee\":{\"email_address\":\"sb-htiha986612@business.example.com\",\"merchant_id\":\"5PEQTR2XQ3UCU\"},\"payments\":{\"captures\":[{\"status\":\"COMPLETED\",\"id\":\"2NV575982G2813053\",\"final_capture\":true,\"create_time\":\"2020-02-13T18:25:58Z\",\"update_time\":\"2020-02-13T18:25:58Z\",\"amount\":{\"value\":\"404.00\",\"currency_code\":\"EUR\"},\"seller_protection\":{\"status\":\"ELIGIBLE\",\"dispute_categories\":[\"ITEM_NOT_RECEIVED\",\"UNAUTHORIZED_TRANSACTION\"]},\"links\":[{\"href\":\"https://api.sandbox.paypal.com/v2/payments/captures/2NV575982G2813053\",\"rel\":\"self\",\"method\":\"GET\",\"title\":\"GET\"},{\"href\":\"https://api.sandbox.paypal.com/v2/payments/captures/2NV575982G2813053/refund\",\"rel\":\"refund\",\"method\":\"POST\",\"title\":\"POST\"},{\"href\":\"https://api.sandbox.paypal.com/v2/checkout/orders/9WE87096G21065814\",\"rel\":\"up\",\"method\":\"GET\",\"title\":\"GET\"}]}]}}],\"links\":[{\"href\":\"https://api.sandbox.paypal.com/v2/checkout/orders/9WE87096G21065814\",\"rel\":\"self\",\"method\":\"GET\",\"title\":\"GET\"}]},\"data\":{\"orderID\":\"9WE87096G21065814\",\"payerID\":\"4SDFF52K6JAHN\",\"facilitatorAccessToken\":\"A21AAHPDhR6o8SSEshMgony0tgDiLSMZANY1_47TdM3V2jYDSDWW1DmMBFAvGRSmr_winDvlaMTTbW0TDyVol9Si2j-09dJ6Q\"}}'),
(6, '7XY37032RH945025R', '2020-02-13 20:57:08', 115, 'EUR', 'sb-qqpod983866@personal.example.com', 'FR', 'John', 'Doe', '{\"details\":{\"create_time\":\"2020-02-13T20:56:24Z\",\"update_time\":\"2020-02-13T20:57:08Z\",\"id\":\"0M8283285D422203N\",\"intent\":\"CAPTURE\",\"status\":\"COMPLETED\",\"payer\":{\"email_address\":\"sb-qqpod983866@personal.example.com\",\"payer_id\":\"4SDFF52K6JAHN\",\"address\":{\"country_code\":\"FR\"},\"name\":{\"given_name\":\"John\",\"surname\":\"Doe\"}},\"purchase_units\":[{\"reference_id\":\"default\",\"amount\":{\"value\":\"115.00\",\"currency_code\":\"EUR\"},\"payee\":{\"email_address\":\"sb-htiha986612@business.example.com\",\"merchant_id\":\"5PEQTR2XQ3UCU\"},\"payments\":{\"captures\":[{\"status\":\"COMPLETED\",\"id\":\"7XY37032RH945025R\",\"final_capture\":true,\"create_time\":\"2020-02-13T20:57:08Z\",\"update_time\":\"2020-02-13T20:57:08Z\",\"amount\":{\"value\":\"115.00\",\"currency_code\":\"EUR\"},\"seller_protection\":{\"status\":\"ELIGIBLE\",\"dispute_categories\":[\"ITEM_NOT_RECEIVED\",\"UNAUTHORIZED_TRANSACTION\"]},\"links\":[{\"href\":\"https://api.sandbox.paypal.com/v2/payments/captures/7XY37032RH945025R\",\"rel\":\"self\",\"method\":\"GET\",\"title\":\"GET\"},{\"href\":\"https://api.sandbox.paypal.com/v2/payments/captures/7XY37032RH945025R/refund\",\"rel\":\"refund\",\"method\":\"POST\",\"title\":\"POST\"},{\"href\":\"https://api.sandbox.paypal.com/v2/checkout/orders/0M8283285D422203N\",\"rel\":\"up\",\"method\":\"GET\",\"title\":\"GET\"}]}]}}],\"links\":[{\"href\":\"https://api.sandbox.paypal.com/v2/checkout/orders/0M8283285D422203N\",\"rel\":\"self\",\"method\":\"GET\",\"title\":\"GET\"}]},\"data\":{\"orderID\":\"0M8283285D422203N\",\"payerID\":\"4SDFF52K6JAHN\",\"facilitatorAccessToken\":\"A21AAF2bURavVpBpFxFcwtaTuTgDSXgPyKLXAtw3SIR23Stu5hRD9gA56DDKTTpgBfRdpqfH84cUvjedzMqSlfloCmk-3NA_Q\"}}'),
(7, '00A24822FX470963R', '2020-02-15 15:22:24', 105, 'EUR', 'sb-qqpod983866@personal.example.com', 'FR', 'John', 'Doe', '{\"details\":{\"create_time\":\"2020-02-15T15:21:44Z\",\"update_time\":\"2020-02-15T15:22:24Z\",\"id\":\"5TD8253163624944L\",\"intent\":\"CAPTURE\",\"status\":\"COMPLETED\",\"payer\":{\"email_address\":\"sb-qqpod983866@personal.example.com\",\"payer_id\":\"4SDFF52K6JAHN\",\"address\":{\"country_code\":\"FR\"},\"name\":{\"given_name\":\"John\",\"surname\":\"Doe\"}},\"purchase_units\":[{\"reference_id\":\"default\",\"amount\":{\"value\":\"105.00\",\"currency_code\":\"EUR\"},\"payee\":{\"email_address\":\"sb-htiha986612@business.example.com\",\"merchant_id\":\"5PEQTR2XQ3UCU\"},\"payments\":{\"captures\":[{\"status\":\"COMPLETED\",\"id\":\"00A24822FX470963R\",\"final_capture\":true,\"create_time\":\"2020-02-15T15:22:24Z\",\"update_time\":\"2020-02-15T15:22:24Z\",\"amount\":{\"value\":\"105.00\",\"currency_code\":\"EUR\"},\"seller_protection\":{\"status\":\"ELIGIBLE\",\"dispute_categories\":[\"ITEM_NOT_RECEIVED\",\"UNAUTHORIZED_TRANSACTION\"]},\"links\":[{\"href\":\"https://api.sandbox.paypal.com/v2/payments/captures/00A24822FX470963R\",\"rel\":\"self\",\"method\":\"GET\",\"title\":\"GET\"},{\"href\":\"https://api.sandbox.paypal.com/v2/payments/captures/00A24822FX470963R/refund\",\"rel\":\"refund\",\"method\":\"POST\",\"title\":\"POST\"},{\"href\":\"https://api.sandbox.paypal.com/v2/checkout/orders/5TD8253163624944L\",\"rel\":\"up\",\"method\":\"GET\",\"title\":\"GET\"}]}]}}],\"links\":[{\"href\":\"https://api.sandbox.paypal.com/v2/checkout/orders/5TD8253163624944L\",\"rel\":\"self\",\"method\":\"GET\",\"title\":\"GET\"}]},\"data\":{\"orderID\":\"5TD8253163624944L\",\"payerID\":\"4SDFF52K6JAHN\",\"facilitatorAccessToken\":\"A21AAHmmb2Fhb126l8-jNA4ywvsAeQXOHokATnbvxKBXEQ1rHdm8bmnpViLF1OhPD4imFmbWQKb6Zblsyi4JOtzjXnzz112TQ\"}}'),
(8, '98S23129V3648941B', '2020-02-15 15:23:44', 105, 'EUR', 'sb-qqpod983866@personal.example.com', 'FR', 'John', 'Doe', '{\"details\":{\"create_time\":\"2020-02-15T15:23:03Z\",\"update_time\":\"2020-02-15T15:23:44Z\",\"id\":\"3V87507631761445U\",\"intent\":\"CAPTURE\",\"status\":\"COMPLETED\",\"payer\":{\"email_address\":\"sb-qqpod983866@personal.example.com\",\"payer_id\":\"4SDFF52K6JAHN\",\"address\":{\"country_code\":\"FR\"},\"name\":{\"given_name\":\"John\",\"surname\":\"Doe\"}},\"purchase_units\":[{\"reference_id\":\"default\",\"amount\":{\"value\":\"105.00\",\"currency_code\":\"EUR\"},\"payee\":{\"email_address\":\"sb-htiha986612@business.example.com\",\"merchant_id\":\"5PEQTR2XQ3UCU\"},\"payments\":{\"captures\":[{\"status\":\"COMPLETED\",\"id\":\"98S23129V3648941B\",\"final_capture\":true,\"create_time\":\"2020-02-15T15:23:44Z\",\"update_time\":\"2020-02-15T15:23:44Z\",\"amount\":{\"value\":\"105.00\",\"currency_code\":\"EUR\"},\"seller_protection\":{\"status\":\"ELIGIBLE\",\"dispute_categories\":[\"ITEM_NOT_RECEIVED\",\"UNAUTHORIZED_TRANSACTION\"]},\"links\":[{\"href\":\"https://api.sandbox.paypal.com/v2/payments/captures/98S23129V3648941B\",\"rel\":\"self\",\"method\":\"GET\",\"title\":\"GET\"},{\"href\":\"https://api.sandbox.paypal.com/v2/payments/captures/98S23129V3648941B/refund\",\"rel\":\"refund\",\"method\":\"POST\",\"title\":\"POST\"},{\"href\":\"https://api.sandbox.paypal.com/v2/checkout/orders/3V87507631761445U\",\"rel\":\"up\",\"method\":\"GET\",\"title\":\"GET\"}]}]}}],\"links\":[{\"href\":\"https://api.sandbox.paypal.com/v2/checkout/orders/3V87507631761445U\",\"rel\":\"self\",\"method\":\"GET\",\"title\":\"GET\"}]},\"data\":{\"orderID\":\"3V87507631761445U\",\"payerID\":\"4SDFF52K6JAHN\",\"facilitatorAccessToken\":\"A21AAHmmb2Fhb126l8-jNA4ywvsAeQXOHokATnbvxKBXEQ1rHdm8bmnpViLF1OhPD4imFmbWQKb6Zblsyi4JOtzjXnzz112TQ\"}}'),
(9, '44L69554NY0349827', '2020-02-15 17:12:40', 254, 'EUR', 'sb-qqpod983866@personal.example.com', 'FR', 'John', 'Doe', '{\"details\":{\"create_time\":\"2020-02-15T17:12:08Z\",\"update_time\":\"2020-02-15T17:12:40Z\",\"id\":\"3U71854121780834A\",\"intent\":\"CAPTURE\",\"status\":\"COMPLETED\",\"payer\":{\"email_address\":\"sb-qqpod983866@personal.example.com\",\"payer_id\":\"4SDFF52K6JAHN\",\"address\":{\"country_code\":\"FR\"},\"name\":{\"given_name\":\"John\",\"surname\":\"Doe\"}},\"purchase_units\":[{\"reference_id\":\"default\",\"amount\":{\"value\":\"254.00\",\"currency_code\":\"EUR\"},\"payee\":{\"email_address\":\"sb-htiha986612@business.example.com\",\"merchant_id\":\"5PEQTR2XQ3UCU\"},\"payments\":{\"captures\":[{\"status\":\"COMPLETED\",\"id\":\"44L69554NY0349827\",\"final_capture\":true,\"create_time\":\"2020-02-15T17:12:40Z\",\"update_time\":\"2020-02-15T17:12:40Z\",\"amount\":{\"value\":\"254.00\",\"currency_code\":\"EUR\"},\"seller_protection\":{\"status\":\"ELIGIBLE\",\"dispute_categories\":[\"ITEM_NOT_RECEIVED\",\"UNAUTHORIZED_TRANSACTION\"]},\"links\":[{\"href\":\"https://api.sandbox.paypal.com/v2/payments/captures/44L69554NY0349827\",\"rel\":\"self\",\"method\":\"GET\",\"title\":\"GET\"},{\"href\":\"https://api.sandbox.paypal.com/v2/payments/captures/44L69554NY0349827/refund\",\"rel\":\"refund\",\"method\":\"POST\",\"title\":\"POST\"},{\"href\":\"https://api.sandbox.paypal.com/v2/checkout/orders/3U71854121780834A\",\"rel\":\"up\",\"method\":\"GET\",\"title\":\"GET\"}]}]}}],\"links\":[{\"href\":\"https://api.sandbox.paypal.com/v2/checkout/orders/3U71854121780834A\",\"rel\":\"self\",\"method\":\"GET\",\"title\":\"GET\"}]},\"data\":{\"orderID\":\"3U71854121780834A\",\"payerID\":\"4SDFF52K6JAHN\",\"facilitatorAccessToken\":\"A21AAHcReiJgLz4F6xssiU4cJLty-mCOp6eiTIoqfk_ucNTkeGVy6rp9sWeCxlC6aHBgEQgitDQim4cp4U9TqPSZhKhPPZkjw\"}}'),
(10, '98S95131C89477417', '2020-02-16 14:52:22', 135, 'EUR', 'sb-qqpod983866@personal.example.com', 'FR', 'John', 'Doe', '{\"details\":{\"create_time\":\"2020-02-16T14:51:21Z\",\"update_time\":\"2020-02-16T14:52:22Z\",\"id\":\"67C72091T5809732N\",\"intent\":\"CAPTURE\",\"status\":\"COMPLETED\",\"payer\":{\"email_address\":\"sb-qqpod983866@personal.example.com\",\"payer_id\":\"4SDFF52K6JAHN\",\"address\":{\"country_code\":\"FR\"},\"name\":{\"given_name\":\"John\",\"surname\":\"Doe\"}},\"purchase_units\":[{\"reference_id\":\"default\",\"amount\":{\"value\":\"135.00\",\"currency_code\":\"EUR\"},\"payee\":{\"email_address\":\"sb-htiha986612@business.example.com\",\"merchant_id\":\"5PEQTR2XQ3UCU\"},\"payments\":{\"captures\":[{\"status\":\"COMPLETED\",\"id\":\"98S95131C89477417\",\"final_capture\":true,\"create_time\":\"2020-02-16T14:52:22Z\",\"update_time\":\"2020-02-16T14:52:22Z\",\"amount\":{\"value\":\"135.00\",\"currency_code\":\"EUR\"},\"seller_protection\":{\"status\":\"ELIGIBLE\",\"dispute_categories\":[\"ITEM_NOT_RECEIVED\",\"UNAUTHORIZED_TRANSACTION\"]},\"links\":[{\"href\":\"https://api.sandbox.paypal.com/v2/payments/captures/98S95131C89477417\",\"rel\":\"self\",\"method\":\"GET\",\"title\":\"GET\"},{\"href\":\"https://api.sandbox.paypal.com/v2/payments/captures/98S95131C89477417/refund\",\"rel\":\"refund\",\"method\":\"POST\",\"title\":\"POST\"},{\"href\":\"https://api.sandbox.paypal.com/v2/checkout/orders/67C72091T5809732N\",\"rel\":\"up\",\"method\":\"GET\",\"title\":\"GET\"}]}]}}],\"links\":[{\"href\":\"https://api.sandbox.paypal.com/v2/checkout/orders/67C72091T5809732N\",\"rel\":\"self\",\"method\":\"GET\",\"title\":\"GET\"}]},\"data\":{\"orderID\":\"67C72091T5809732N\",\"payerID\":\"4SDFF52K6JAHN\",\"facilitatorAccessToken\":\"A21AAG67CcAvf5XdM2buTZx0uue6-2LWZU8JDtmaKyjtqB3sbXXlPQYC7_M9pqvVKuBAtTCobjglQT46yuBq8qhZVuKGc4Otw\"}}'),
(11, '445244630Y689612J', '2020-02-16 14:53:33', 135, 'EUR', 'sb-qqpod983866@personal.example.com', 'FR', 'John', 'Doe', '{\"details\":{\"create_time\":\"2020-02-16T14:53:08Z\",\"update_time\":\"2020-02-16T14:53:33Z\",\"id\":\"87B59169S62240522\",\"intent\":\"CAPTURE\",\"status\":\"COMPLETED\",\"payer\":{\"email_address\":\"sb-qqpod983866@personal.example.com\",\"payer_id\":\"4SDFF52K6JAHN\",\"address\":{\"country_code\":\"FR\"},\"name\":{\"given_name\":\"John\",\"surname\":\"Doe\"}},\"purchase_units\":[{\"reference_id\":\"default\",\"amount\":{\"value\":\"135.00\",\"currency_code\":\"EUR\"},\"payee\":{\"email_address\":\"sb-htiha986612@business.example.com\",\"merchant_id\":\"5PEQTR2XQ3UCU\"},\"payments\":{\"captures\":[{\"status\":\"COMPLETED\",\"id\":\"445244630Y689612J\",\"final_capture\":true,\"create_time\":\"2020-02-16T14:53:33Z\",\"update_time\":\"2020-02-16T14:53:33Z\",\"amount\":{\"value\":\"135.00\",\"currency_code\":\"EUR\"},\"seller_protection\":{\"status\":\"ELIGIBLE\",\"dispute_categories\":[\"ITEM_NOT_RECEIVED\",\"UNAUTHORIZED_TRANSACTION\"]},\"links\":[{\"href\":\"https://api.sandbox.paypal.com/v2/payments/captures/445244630Y689612J\",\"rel\":\"self\",\"method\":\"GET\",\"title\":\"GET\"},{\"href\":\"https://api.sandbox.paypal.com/v2/payments/captures/445244630Y689612J/refund\",\"rel\":\"refund\",\"method\":\"POST\",\"title\":\"POST\"},{\"href\":\"https://api.sandbox.paypal.com/v2/checkout/orders/87B59169S62240522\",\"rel\":\"up\",\"method\":\"GET\",\"title\":\"GET\"}]}]}}],\"links\":[{\"href\":\"https://api.sandbox.paypal.com/v2/checkout/orders/87B59169S62240522\",\"rel\":\"self\",\"method\":\"GET\",\"title\":\"GET\"}]},\"data\":{\"orderID\":\"87B59169S62240522\",\"payerID\":\"4SDFF52K6JAHN\",\"facilitatorAccessToken\":\"A21AAG67CcAvf5XdM2buTZx0uue6-2LWZU8JDtmaKyjtqB3sbXXlPQYC7_M9pqvVKuBAtTCobjglQT46yuBq8qhZVuKGc4Otw\"}}'),
(12, '9F138877CU951952S', '2020-02-16 14:54:49', 135, 'EUR', 'sb-qqpod983866@personal.example.com', 'FR', 'John', 'Doe', '{\"details\":{\"create_time\":\"2020-02-16T14:54:18Z\",\"update_time\":\"2020-02-16T14:54:49Z\",\"id\":\"9TR6838842289572G\",\"intent\":\"CAPTURE\",\"status\":\"COMPLETED\",\"payer\":{\"email_address\":\"sb-qqpod983866@personal.example.com\",\"payer_id\":\"4SDFF52K6JAHN\",\"address\":{\"country_code\":\"FR\"},\"name\":{\"given_name\":\"John\",\"surname\":\"Doe\"}},\"purchase_units\":[{\"reference_id\":\"default\",\"amount\":{\"value\":\"135.00\",\"currency_code\":\"EUR\"},\"payee\":{\"email_address\":\"sb-htiha986612@business.example.com\",\"merchant_id\":\"5PEQTR2XQ3UCU\"},\"payments\":{\"captures\":[{\"status\":\"COMPLETED\",\"id\":\"9F138877CU951952S\",\"final_capture\":true,\"create_time\":\"2020-02-16T14:54:49Z\",\"update_time\":\"2020-02-16T14:54:49Z\",\"amount\":{\"value\":\"135.00\",\"currency_code\":\"EUR\"},\"seller_protection\":{\"status\":\"ELIGIBLE\",\"dispute_categories\":[\"ITEM_NOT_RECEIVED\",\"UNAUTHORIZED_TRANSACTION\"]},\"links\":[{\"href\":\"https://api.sandbox.paypal.com/v2/payments/captures/9F138877CU951952S\",\"rel\":\"self\",\"method\":\"GET\",\"title\":\"GET\"},{\"href\":\"https://api.sandbox.paypal.com/v2/payments/captures/9F138877CU951952S/refund\",\"rel\":\"refund\",\"method\":\"POST\",\"title\":\"POST\"},{\"href\":\"https://api.sandbox.paypal.com/v2/checkout/orders/9TR6838842289572G\",\"rel\":\"up\",\"method\":\"GET\",\"title\":\"GET\"}]}]}}],\"links\":[{\"href\":\"https://api.sandbox.paypal.com/v2/checkout/orders/9TR6838842289572G\",\"rel\":\"self\",\"method\":\"GET\",\"title\":\"GET\"}]},\"data\":{\"orderID\":\"9TR6838842289572G\",\"payerID\":\"4SDFF52K6JAHN\",\"facilitatorAccessToken\":\"A21AAG67CcAvf5XdM2buTZx0uue6-2LWZU8JDtmaKyjtqB3sbXXlPQYC7_M9pqvVKuBAtTCobjglQT46yuBq8qhZVuKGc4Otw\"}}');

-- --------------------------------------------------------

--
-- Table structure for table `mc_dev_team`
--

DROP TABLE IF EXISTS `mc_dev_team`;
CREATE TABLE IF NOT EXISTS `mc_dev_team` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label_google_contact` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `max_number_members` int(11) DEFAULT NULL,
  `member_years` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referent_parent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coaches` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trainers` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_dev_team`
--

INSERT INTO `mc_dev_team` (`id`, `label`, `label_google_contact`, `max_number_members`, `member_years`, `referent_parent`, `coaches`, `trainers`) VALUES
(1, 'dffsdsdfsdf', 'fsdsfd', 12, '2012-2011-2015', 'aze qsd', 'Test test', 'abc def'),
(2, 'pouet', 'waouuuu', NULL, NULL, NULL, NULL, NULL),
(3, 'qsdazeazeazeaze', 'tes', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `mc_dev_user`
--

DROP TABLE IF EXISTS `mc_dev_user`;
CREATE TABLE IF NOT EXISTS `mc_dev_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username_canonical` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_canonical` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `salt` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `confirmation_token` varchar(180) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_requested_at` datetime DEFAULT NULL,
  `roles` longtext COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '(DC2Type:array)',
  `creation_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_213C299792FC23A8` (`username_canonical`),
  UNIQUE KEY `UNIQ_213C2997A0D96FBF` (`email_canonical`),
  UNIQUE KEY `UNIQ_213C2997C05FB297` (`confirmation_token`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_dev_user`
--

INSERT INTO `mc_dev_user` (`id`, `username`, `username_canonical`, `email`, `email_canonical`, `enabled`, `salt`, `password`, `last_login`, `confirmation_token`, `password_requested_at`, `roles`, `creation_datetime`) VALUES
(1, 'kirian.caumes@gmail.com', 'kirian.caumes@gmail.com', 'kirian.caumes@gmail.com', 'kirian.caumes@gmail.com', 1, 'Y2aBaidKRjicIuoP1gKRpugtJ78zvUZV3lpl/2lTNRs', '$2y$13$48OrgAAhu59k51F/6CbBQeCnSoH1n9JeMxWGpOQd6atCztnm7XAwy', '2020-03-11 16:24:48', '9wytSRAgfx_-YVWvXcDp_atux-evccbMnrOO3xyEBhs', '2020-02-15 11:19:21', 'a:1:{i:0;s:16:\"ROLE_SUPER_ADMIN\";}', '2019-10-18 20:04:04'),
(2, 'kirian.caumes2@gmail.com', 'kirian.caumes2@gmail.com', 'kirian.caumes2@gmail.com', 'kirian.caumes2@gmail.com', 1, 'kPyqtJrkzqJftUvSQ8tWiuud8c5QhJN5J3upMCxMpMY', '$2y$13$ngzM6D8015WCoKFytm8G1OIST3R3MNWLhaDzu60r.sa3ySRKIW4DS', '2020-02-18 20:32:03', NULL, NULL, 'a:1:{i:0;s:16:\"ROLE_SUPER_ADMIN\";}', '2020-01-03 20:12:46'),
(3, 'kirian.caumes3@gmail.com', 'kirian.caumes3@gmail.com', 'kirian.caumes3@gmail.com', 'kirian.caumes3@gmail.com', 1, 'pA.XojVTDcbcSUIjzhSo5Q1GENllAVOj0P22IRzu1YY', '$2y$13$uzZZlzIsCTv/u6r1obpcT.S2e4a5FX/fE.oyp8d9dpTAu3hU..zEW', '2020-01-03 20:25:13', NULL, NULL, 'a:0:{}', '2020-01-03 21:25:11'),
(4, 'kirian.caumes4@gmail.com', 'kirian.caumes4@gmail.com', 'kirian.caumes4@gmail.com', 'kirian.caumes4@gmail.com', 1, 'Z2ML7v9uRv0vZtrKbY7WGsCKlQ04KqNqDCocs4/Tqz0', '$2y$13$hdgyjkI8OtnLwWS0yBgX9Ok1bEUtLav2XIOUCk2ANhaPD2cVZY5IK', '2020-01-04 00:20:38', NULL, NULL, 'a:0:{}', '2020-01-04 00:18:55'),
(5, 'kiki@kiki.com', 'kiki@kiki.com', 'kiki@kiki.com', 'kiki@kiki.com', 1, 'W/XenTu0E8Vdk8DfhyKgiW84nRt3xo98rRAh.BfAAjw', '$2y$13$9J60R5P6XgzB5tx0nzbxdOPxyGkYgrYP/T5ruPCiu4M0YZlK25CKO', '2020-02-01 17:00:53', NULL, NULL, 'a:0:{}', '2020-01-10 19:21:33'),
(6, 'abce@mail.fr', 'abce@mail.fr', 'abce@mail.fr', 'abce@mail.fr', 0, 'QWQqEVXWIVYk.YddzOMuahIeP/corRDn4e.x5Al/uME', '$2y$13$Y1gllMGx/E4J1OZXb53KDe1u1P/kGO4V.BOl3OkWjVDD6NCCoaveC', '2020-01-10 19:25:05', NULL, NULL, 'a:0:{}', '2020-01-10 19:25:03'),
(7, 'kirian.caumes78@gmail.com', 'kirian.caumes78@gmail.com', 'kirian.caumes78@gmail.com', 'kirian.caumes78@gmail.com', 0, '0.dB/MdPYF3VyrKD1Yk9d6qQCJz6QgB/XVt2erYSmCA', '$2y$13$3wOkq6FU1mZqJjlvbjaNpeTw9CW8RVU0xQnB8EzibtY153WxuRpcS', NULL, NULL, NULL, 'a:0:{}', '2020-02-11 18:39:16'),
(8, 'eazaze@mail.com', 'eazaze@mail.com', 'eazaze@mail.com', 'eazaze@mail.com', 0, 'uEdush/IlKCMUrCLOxGuftRn/eBDncSJrS3MAMUfMdU', '$2y$13$dZUPfPFj9At7pUO5mqKbUO63t../l7Aj0BJ2b8k9XUqTsTS7P81LO', NULL, NULL, NULL, 'a:0:{}', '2020-02-11 18:39:52'),
(9, 'eazeazeaze@mail.com', 'eazeazeaze@mail.com', 'eazeazeaze@mail.com', 'eazeazeaze@mail.com', 0, 'xhUqxJoy/R0GRymGF8Fe32KJ.Zvh.Tu0.kNcmBPGBvg', '$2y$13$xoEPwbdurxTWETreuSqz3ONaErADZHTMDPhhtmG2uigXNPKaBlXre', NULL, NULL, NULL, 'a:0:{}', '2020-02-11 18:40:36'),
(10, 'eazeaze@mail.com', 'eazeaze@mail.com', 'eazeaze@mail.com', 'eazeaze@mail.com', 0, 'RiQ5scH3C3GTy7IS5NlY7vWlafM6sTM9TwTLCO362IQ', '$2y$13$b7p61j/hOQLeBRRpNZRdNO1CjHySw8TnqSN5umW2IS/3vioEOTGqS', NULL, NULL, NULL, 'a:0:{}', '2020-02-11 18:45:18'),
(12, 'kirian.caumes@ynov.com', 'kirian.caumes@ynov.com', 'kirian.caumes@ynov.com', 'kirian.caumes@ynov.com', 1, 'cePyL0rw0jFyyGIpnzf9ztUqD9sIrSUwU8AujCAngTk', '$2y$13$SaGOUX/aKU.LkJAWbNOtquTIYbIpfSdojI02uP2z.nUFpulniRTYe', '2020-02-11 19:16:34', 'cDxKaS9Y21CM7LRgkG7HfKPECiXY-h-MVzXAAOvf-Ns', '2020-02-11 19:15:48', 'a:0:{}', '2020-02-11 19:15:48'),
(13, 'kirian.caumes666@gmail.com', 'kirian.caumes666@gmail.com', 'kirian.caumes666@gmail.com', 'kirian.caumes666@gmail.com', 1, 'B7MzdEayZiT8TPxbJYzR6iLIxSNyiX08k2MTZVebcn8', '$2y$13$WtTTU9c7gnGMK04Fu7X5VOJIN1TK24WWohkz3oWQKS8/u0f7fwBm.', '2020-02-18 21:40:09', NULL, NULL, 'a:0:{}', '2020-02-16 17:54:28');

-- --------------------------------------------------------

--
-- Table structure for table `mc_dev_users_teams`
--

DROP TABLE IF EXISTS `mc_dev_users_teams`;
CREATE TABLE IF NOT EXISTS `mc_dev_users_teams` (
  `user_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`team_id`),
  KEY `IDX_9B47FB3FA76ED395` (`user_id`),
  KEY `IDX_9B47FB3F296CD8AE` (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mc_migration_versions`
--

DROP TABLE IF EXISTS `mc_migration_versions`;
CREATE TABLE IF NOT EXISTS `mc_migration_versions` (
  `version` varchar(14) COLLATE utf8mb4_unicode_ci NOT NULL,
  `executed_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_migration_versions`
--

INSERT INTO `mc_migration_versions` (`version`, `executed_at`) VALUES
('20200103215436', '2020-01-03 21:55:07'),
('20200105172558', '2020-01-05 17:26:02'),
('20200105173242', '2020-01-05 17:32:47'),
('20200106190714', '2020-01-06 19:07:19'),
('20200106205707', '2020-01-06 20:57:11'),
('20200106210654', '2020-01-06 21:06:59'),
('20200107175547', '2020-01-07 17:56:24'),
('20200115155220', '2020-01-15 15:52:25'),
('20200129204134', '2020-01-29 20:41:39'),
('20200213171228', '2020-02-13 17:12:33'),
('20200213180250', '2020-02-13 18:02:57'),
('20200215163155', '2020-02-15 16:32:02');

-- --------------------------------------------------------

--
-- Table structure for table `mc_stg_activity_history`
--

DROP TABLE IF EXISTS `mc_stg_activity_history`;
CREATE TABLE IF NOT EXISTS `mc_stg_activity_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_D29D53576B3CA4B` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mc_stg_document`
--

DROP TABLE IF EXISTS `mc_stg_document`;
CREATE TABLE IF NOT EXISTS `mc_stg_document` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_member` int(11) DEFAULT NULL,
  `id_category` int(11) DEFAULT NULL,
  `updated_at` datetime NOT NULL,
  `document_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `document_original_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `document_mime_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `document_size` int(11) DEFAULT NULL,
  `document_dimensions` longtext COLLATE utf8mb4_unicode_ci COMMENT '(DC2Type:simple_array)',
  PRIMARY KEY (`id`),
  KEY `IDX_56853FD456D34F95` (`id_member`),
  KEY `IDX_56853FD45697F554` (`id_category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mc_stg_member`
--

DROP TABLE IF EXISTS `mc_stg_member`;
CREATE TABLE IF NOT EXISTS `mc_stg_member` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_payment_solution` int(11) DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_season` int(11) DEFAULT NULL,
  `firstname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthdate` date NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `street` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profession` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_one_firstname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_one_lastname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_one_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_one_phone_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_one_profession` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_two_firstname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_two_lastname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_two_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_two_phone_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_two_profession` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_evacuation_allow` tinyint(1) NOT NULL DEFAULT '0',
  `is_transport_allow` tinyint(1) NOT NULL DEFAULT '0',
  `is_image_allow` tinyint(1) NOT NULL DEFAULT '0',
  `is_return_home_allow` tinyint(1) NOT NULL DEFAULT '0',
  `is_newsletter_allow` tinyint(1) NOT NULL DEFAULT '0',
  `is_accepted` tinyint(1) NOT NULL DEFAULT '0',
  `is_reduced_price` tinyint(1) NOT NULL DEFAULT '0',
  `is_non_competitive` tinyint(1) NOT NULL DEFAULT '0',
  `is_transfer_needed` tinyint(1) NOT NULL DEFAULT '0',
  `is_document_complete` tinyint(1) NOT NULL DEFAULT '0',
  `is_payed` tinyint(1) NOT NULL DEFAULT '0',
  `amount_payed` decimal(5,2) DEFAULT NULL,
  `is_check_gest_hand` tinyint(1) NOT NULL DEFAULT '0',
  `is_inscription_done` tinyint(1) NOT NULL DEFAULT '0',
  `creation_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notes` longtext COLLATE utf8mb4_unicode_ci,
  `id_sex` int(11) DEFAULT NULL,
  `gesthand_is_photo` tinyint(1) NOT NULL,
  `gesthand_is_certificate` tinyint(1) NOT NULL,
  `gesthand_certificate_date` date DEFAULT NULL,
  `gesthand_is_health_questionnaire` tinyint(1) NOT NULL,
  `gesthand_is_ffhb_authorization` tinyint(1) NOT NULL,
  `gesthand_qualification_date` date DEFAULT NULL,
  `gesthand_is_photo_id` tinyint(1) NOT NULL,
  `amount_payed_other` int(11) DEFAULT NULL,
  `is_license_renewal` tinyint(1) NOT NULL,
  `payment_notes` longtext COLLATE utf8mb4_unicode_ci,
  `id_paypal_information` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_425D51CB3C7F3E62` (`id_payment_solution`),
  KEY `IDX_425D51CB6B3CA4B` (`id_user`),
  KEY `IDX_425D51CBD6D3EE44` (`id_season`),
  KEY `IDX_425D51CB710681AD` (`id_sex`),
  KEY `IDX_425D51CB54D97364` (`id_paypal_information`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mc_stg_member_teams`
--

DROP TABLE IF EXISTS `mc_stg_member_teams`;
CREATE TABLE IF NOT EXISTS `mc_stg_member_teams` (
  `member_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  PRIMARY KEY (`member_id`,`team_id`),
  KEY `IDX_28DF48197597D3FE` (`member_id`),
  KEY `IDX_28DF4819296CD8AE` (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mc_stg_param_document_category`
--

DROP TABLE IF EXISTS `mc_stg_param_document_category`;
CREATE TABLE IF NOT EXISTS `mc_stg_param_document_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_stg_param_document_category`
--

INSERT INTO `mc_stg_param_document_category` (`id`, `label`) VALUES
(1, 'Certificat médical'),
(2, 'Justificatif étudiant/chomeur');

-- --------------------------------------------------------

--
-- Table structure for table `mc_stg_param_global`
--

DROP TABLE IF EXISTS `mc_stg_param_global`;
CREATE TABLE IF NOT EXISTS `mc_stg_param_global` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_stg_param_global`
--

INSERT INTO `mc_stg_param_global` (`id`, `label`, `value`) VALUES
(1, 'reduced_price_before_deadline', '140'),
(2, 'reduced_price_after_deadline', '160'),
(3, 'price_deadline', '2019-07-12'),
(4, 'text_infos_admin', 'Text admin : Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla luctus libero lectus, quis fermentum elit suscipit gravida. Proin vitae ullamcorper dolor. <br />Nullam ultricies elit egestas dictum ultrices. Aliquam suscipit eu diam eu elementum. Fusce volutpat, sem in euismod eleifend, turpis ipsum convallis elit, eget interdum massa felis quis risus.<br />Morbi sed ligula maximus, fermentum nibh quis, interdum diam.'),
(5, 'text_infos_user', 'Text user : Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla luctus libero lectus, quis fermentum elit suscipit gravida. Proin vitae ullamcorper dolor. <br />Nullam ultricies elit egestas dictum ultrices. Aliquam suscipit eu diam eu elementum. Fusce volutpat, sem in euismod eleifend, turpis ipsum convallis elit, eget interdum massa felis quis risus.<br />Morbi sed ligula maximus, fermentum nibh quis, interdum diam.'),
(6, 'president_firstname', 'benjamin1'),
(7, 'president_lastname', 'paire'),
(8, 'is_create_new_user_able', 'true'),
(9, 'new_member_deadline', ''),
(10, 'is_create_new_member_able', 'true'),
(11, 'secretary_firstname', 'carole'),
(12, 'secretary_lastname', 'blanchard'),
(13, 'date_mail_renew_certif', '01-05'),
(14, 'paypal_fee', '5');

-- --------------------------------------------------------

--
-- Table structure for table `mc_stg_param_payment_solution`
--

DROP TABLE IF EXISTS `mc_stg_param_payment_solution`;
CREATE TABLE IF NOT EXISTS `mc_stg_param_payment_solution` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_stg_param_payment_solution`
--

INSERT INTO `mc_stg_param_payment_solution` (`id`, `label`, `icon`) VALUES
(1, 'Paypal', 'PaymentCard'),
(2, 'Chèque', 'Document'),
(3, 'Chèque & coupon(s)', 'DocumentSet');

-- --------------------------------------------------------

--
-- Table structure for table `mc_stg_param_price_global`
--

DROP TABLE IF EXISTS `mc_stg_param_price_global`;
CREATE TABLE IF NOT EXISTS `mc_stg_param_price_global` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_season` int(11) DEFAULT NULL,
  `reduced_price_before_deadline` int(11) NOT NULL,
  `reduced_price_after_deadline` int(11) NOT NULL,
  `deadline_date` date NOT NULL,
  `paypal_fee` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_91AFC90CD6D3EE44` (`id_season`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_stg_param_price_global`
--

INSERT INTO `mc_stg_param_price_global` (`id`, `id_season`, `reduced_price_before_deadline`, `reduced_price_after_deadline`, `deadline_date`, `paypal_fee`) VALUES
(2, 1, 140, 160, '2019-07-12', 5),
(4, 3, 140, 122, '1999-07-15', 5),
(6, 15, 11, 11, '2021-12-11', 78),
(7, 11, 140, 122, '1999-07-15', 5),
(15, 2, 154, 160, '1999-07-15', 5);

-- --------------------------------------------------------

--
-- Table structure for table `mc_stg_param_price_license`
--

DROP TABLE IF EXISTS `mc_stg_param_price_license`;
CREATE TABLE IF NOT EXISTS `mc_stg_param_price_license` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_before_deadline` int(11) NOT NULL,
  `price_after_deadline` int(11) NOT NULL,
  `min_year` int(11) NOT NULL,
  `max_year` int(11) NOT NULL,
  `id_season` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_2A16C0EAD6D3EE44` (`id_season`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_stg_param_price_license`
--

INSERT INTO `mc_stg_param_price_license` (`id`, `label`, `price_before_deadline`, `price_after_deadline`, `min_year`, `max_year`, `id_season`) VALUES
(5, '2014 à 2011 inclus', 100, 120, 2011, 2014, 1),
(6, '2010 à 2008 inclus', 135, 155, 2008, 2010, 1),
(7, '2007 à 2002 inclus', 145, 165, 2002, 2007, 1),
(8, '2001 et avant', 160, 2000, 1900, 2001, 1),
(10, '2014 à 2011 inclus', 100, 120, 2011, 2014, 3),
(11, '2010 à 2008 inclus', 135, 155, 2008, 2010, 3),
(12, '2007 à 2002 inclus', 145, 165, 2002, 2007, 3),
(13, '2001 et avant', 160, 180, 1900, 2001, 3),
(19, 'test', 123, 123, 1232, 7878, 15),
(20, '2014 à 2011 inclus', 100, 120, 2011, 2014, 11),
(21, '2010 à 2008 inclus', 135, 155, 2008, 2010, 11),
(22, '2007 à 2002 inclus', 145, 165, 2002, 2007, 11),
(23, '2001 et avant', 160, 180, 1900, 2001, 11),
(52, '2014 à 2011 inclus', 100, 120, 2011, 2014, 2),
(53, '2010 à 2008 inclus', 135, 155, 2008, 2010, 2),
(54, '2007 à 2002 inclus', 145, 165, 2002, 2007, 2),
(55, '2001 et avant', 160, 180, 1900, 2001, 2);

-- --------------------------------------------------------

--
-- Table structure for table `mc_stg_param_price_transfer`
--

DROP TABLE IF EXISTS `mc_stg_param_price_transfer`;
CREATE TABLE IF NOT EXISTS `mc_stg_param_price_transfer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int(11) NOT NULL,
  `min_age` int(11) NOT NULL,
  `max_age` int(11) NOT NULL,
  `id_season` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_64FD7E52D6D3EE44` (`id_season`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_stg_param_price_transfer`
--

INSERT INTO `mc_stg_param_price_transfer` (`id`, `label`, `price`, `min_age`, `max_age`, `id_season`) VALUES
(4, '+16 ans', 119, 16, 99, 1),
(5, '12 à 16 ans inclus', 73, 12, 16, 1),
(6, '-12 ans', 0, 0, 12, 1),
(7, '+16 ans', 119, 16, 99, 3),
(8, '12 à 16 ans inclus', 73, 12, 16, 3),
(9, '-12 ans', 0, 0, 12, 3),
(13, 'sqd', 111, 144, 78, 15),
(14, '+16 ans', 119, 16, 99, 11),
(15, '12 à 16 ans inclus', 73, 12, 16, 11),
(16, '-12 ans', 0, 0, 12, 11),
(38, '+16 ans', 119, 17, 99, 2),
(39, '12 à 16 ans inclus', 73, 12, 16, 2),
(40, '-12 ans', 0, 0, 11, 2);

-- --------------------------------------------------------

--
-- Table structure for table `mc_stg_param_reduction_family`
--

DROP TABLE IF EXISTS `mc_stg_param_reduction_family`;
CREATE TABLE IF NOT EXISTS `mc_stg_param_reduction_family` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` int(11) NOT NULL,
  `discount` int(11) NOT NULL,
  `id_season` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_4334D1B7D6D3EE44` (`id_season`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_stg_param_reduction_family`
--

INSERT INTO `mc_stg_param_reduction_family` (`id`, `number`, `discount`, `id_season`) VALUES
(5, 1, 0, 1),
(6, 2, 10, 1),
(7, 3, 20, 1),
(8, 4, 30, 1),
(9, 1, 0, 3),
(10, 2, 10, 3),
(11, 3, 20, 3),
(12, 4, 30, 3),
(17, 0, 12, 15),
(18, 1, 0, 11),
(19, 2, 10, 11),
(20, 3, 20, 11),
(21, 4, 30, 11),
(50, 1, 0, 2),
(51, 2, 10, 2),
(52, 3, 20, 2),
(53, 4, 30, 2);

-- --------------------------------------------------------

--
-- Table structure for table `mc_stg_param_season`
--

DROP TABLE IF EXISTS `mc_stg_param_season`;
CREATE TABLE IF NOT EXISTS `mc_stg_param_season` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `is_current` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_stg_param_season`
--

INSERT INTO `mc_stg_param_season` (`id`, `label`, `is_active`, `is_current`) VALUES
(1, '2018/2019', 1, 0),
(2, '2019/2020', 1, 1),
(3, '2020/2021', 0, 0),
(4, '2021/2022', 0, 0),
(5, '2022/2023', 0, 0),
(6, '2023/2024', 0, 0),
(7, '2024/2025', 0, 0),
(8, '2025/2026', 0, 0),
(9, '2026/2027', 0, 0),
(10, '2027/2028', 0, 0),
(11, '2028/2029', 0, 0),
(12, '2029/2030', 0, 0),
(13, '2030/2031', 0, 0),
(14, '2031/2032', 0, 0),
(15, '2032/2033', 0, 0),
(16, '2033/2034', 0, 0),
(17, '2034/2035', 0, 0),
(18, '2035/2036', 0, 0),
(19, '2036/2037', 0, 0),
(20, '2037/2038', 0, 0),
(21, '2038/2039', 0, 0),
(22, '2039/2040', 0, 0),
(23, '2040/2041', 0, 0),
(24, '2041/2042', 0, 0),
(25, '2042/2043', 0, 0),
(26, '2043/2044', 0, 0),
(27, '2044/2045', 0, 0),
(28, '2045/2046', 0, 0),
(29, '2046/2047', 0, 0),
(30, '2047/2048', 0, 0),
(31, '2048/2049', 0, 0),
(32, '2049/2050', 0, 0),
(33, '2050/2051', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `mc_stg_param_sex`
--

DROP TABLE IF EXISTS `mc_stg_param_sex`;
CREATE TABLE IF NOT EXISTS `mc_stg_param_sex` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `civility` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_stg_param_sex`
--

INSERT INTO `mc_stg_param_sex` (`id`, `label`, `icon`, `civility`) VALUES
(1, 'Homme', 'Man', ''),
(2, 'Femme', 'Woman', '');

-- --------------------------------------------------------

--
-- Table structure for table `mc_stg_param_workflow`
--

DROP TABLE IF EXISTS `mc_stg_param_workflow`;
CREATE TABLE IF NOT EXISTS `mc_stg_param_workflow` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_stg_param_workflow`
--

INSERT INTO `mc_stg_param_workflow` (`id`, `label`, `description`, `message`) VALUES
(1, 'Créé', 'L\'utilisateur est créé.', NULL),
(2, 'Documents', 'L\'utilisateur à fournis les documents nécessaires.', 'Passer cet élément de \"Oui\" à \"Non\" réactivera l\'édition du membre pour l\'utilisateur propriétaire et lui enverras un mail lui signalant que ces documents sont invalides.'),
(3, 'Payé', 'L\'utilisateur à payé.', 'Lorsque cette étape est validée, l\'ensemble des champs relatif au paiement sont désactivés.'),
(4, 'Gest\'hand', 'L\'utilisateur est bien inscris sur Gest\'hand.', NULL),
(5, 'Qualifié', 'L\'inscription est finalisée.', 'Passer cet élément de \"Non\" à \"Oui\" enverra un mail à l\'utilisateur lui signalant que l\'inscription de membre est validée.\r\n');

-- --------------------------------------------------------

--
-- Table structure for table `mc_stg_paypal_information`
--

DROP TABLE IF EXISTS `mc_stg_paypal_information`;
CREATE TABLE IF NOT EXISTS `mc_stg_paypal_information` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_payment` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creation_datetime` datetime DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `currency` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `firstname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mc_stg_team`
--

DROP TABLE IF EXISTS `mc_stg_team`;
CREATE TABLE IF NOT EXISTS `mc_stg_team` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label_google_contact` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `max_number_members` int(11) DEFAULT NULL,
  `member_years` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referent_parent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coaches` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trainers` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mc_stg_user`
--

DROP TABLE IF EXISTS `mc_stg_user`;
CREATE TABLE IF NOT EXISTS `mc_stg_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username_canonical` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_canonical` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `salt` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `confirmation_token` varchar(180) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_requested_at` datetime DEFAULT NULL,
  `roles` longtext COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '(DC2Type:array)',
  `creation_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_213C299792FC23A8` (`username_canonical`),
  UNIQUE KEY `UNIQ_213C2997A0D96FBF` (`email_canonical`),
  UNIQUE KEY `UNIQ_213C2997C05FB297` (`confirmation_token`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mc_stg_user`
--

INSERT INTO `mc_stg_user` (`id`, `username`, `username_canonical`, `email`, `email_canonical`, `enabled`, `salt`, `password`, `last_login`, `confirmation_token`, `password_requested_at`, `roles`, `creation_datetime`) VALUES
(1, 'kirian.caumes@gmail.com', 'kirian.caumes@gmail.com', 'kirian.caumes@gmail.com', 'kirian.caumes@gmail.com', 1, 'Y2aBaidKRjicIuoP1gKRpugtJ78zvUZV3lpl/2lTNRs', '$2y$13$48OrgAAhu59k51F/6CbBQeCnSoH1n9JeMxWGpOQd6atCztnm7XAwy', '2020-02-16 18:53:35', '9wytSRAgfx_-YVWvXcDp_atux-evccbMnrOO3xyEBhs', '2020-02-15 11:19:21', 'a:1:{i:0;s:16:\"ROLE_SUPER_ADMIN\";}', '2019-10-18 20:04:04'),
(2, 'kirian.caumes2@gmail.com', 'kirian.caumes2@gmail.com', 'kirian.caumes2@gmail.com', 'kirian.caumes2@gmail.com', 1, 'kPyqtJrkzqJftUvSQ8tWiuud8c5QhJN5J3upMCxMpMY', '$2y$13$ngzM6D8015WCoKFytm8G1OIST3R3MNWLhaDzu60r.sa3ySRKIW4DS', '2020-02-16 17:50:43', NULL, NULL, 'a:1:{i:0;s:16:\"ROLE_SUPER_ADMIN\";}', '2020-01-03 20:12:46'),
(3, 'kirian.caumes3@gmail.com', 'kirian.caumes3@gmail.com', 'kirian.caumes3@gmail.com', 'kirian.caumes3@gmail.com', 1, 'pA.XojVTDcbcSUIjzhSo5Q1GENllAVOj0P22IRzu1YY', '$2y$13$uzZZlzIsCTv/u6r1obpcT.S2e4a5FX/fE.oyp8d9dpTAu3hU..zEW', '2020-01-03 20:25:13', NULL, NULL, 'a:0:{}', '2020-01-03 21:25:11'),
(4, 'kirian.caumes4@gmail.com', 'kirian.caumes4@gmail.com', 'kirian.caumes4@gmail.com', 'kirian.caumes4@gmail.com', 1, 'Z2ML7v9uRv0vZtrKbY7WGsCKlQ04KqNqDCocs4/Tqz0', '$2y$13$hdgyjkI8OtnLwWS0yBgX9Ok1bEUtLav2XIOUCk2ANhaPD2cVZY5IK', '2020-01-04 00:20:38', NULL, NULL, 'a:0:{}', '2020-01-04 00:18:55'),
(5, 'kiki@kiki.com', 'kiki@kiki.com', 'kiki@kiki.com', 'kiki@kiki.com', 1, 'W/XenTu0E8Vdk8DfhyKgiW84nRt3xo98rRAh.BfAAjw', '$2y$13$9J60R5P6XgzB5tx0nzbxdOPxyGkYgrYP/T5ruPCiu4M0YZlK25CKO', '2020-02-01 17:00:53', NULL, NULL, 'a:0:{}', '2020-01-10 19:21:33'),
(6, 'abce@mail.fr', 'abce@mail.fr', 'abce@mail.fr', 'abce@mail.fr', 0, 'QWQqEVXWIVYk.YddzOMuahIeP/corRDn4e.x5Al/uME', '$2y$13$Y1gllMGx/E4J1OZXb53KDe1u1P/kGO4V.BOl3OkWjVDD6NCCoaveC', '2020-01-10 19:25:05', NULL, NULL, 'a:0:{}', '2020-01-10 19:25:03'),
(7, 'kirian.caumes78@gmail.com', 'kirian.caumes78@gmail.com', 'kirian.caumes78@gmail.com', 'kirian.caumes78@gmail.com', 0, '0.dB/MdPYF3VyrKD1Yk9d6qQCJz6QgB/XVt2erYSmCA', '$2y$13$3wOkq6FU1mZqJjlvbjaNpeTw9CW8RVU0xQnB8EzibtY153WxuRpcS', NULL, NULL, NULL, 'a:0:{}', '2020-02-11 18:39:16'),
(8, 'eazaze@mail.com', 'eazaze@mail.com', 'eazaze@mail.com', 'eazaze@mail.com', 0, 'uEdush/IlKCMUrCLOxGuftRn/eBDncSJrS3MAMUfMdU', '$2y$13$dZUPfPFj9At7pUO5mqKbUO63t../l7Aj0BJ2b8k9XUqTsTS7P81LO', NULL, NULL, NULL, 'a:0:{}', '2020-02-11 18:39:52'),
(9, 'eazeazeaze@mail.com', 'eazeazeaze@mail.com', 'eazeazeaze@mail.com', 'eazeazeaze@mail.com', 0, 'xhUqxJoy/R0GRymGF8Fe32KJ.Zvh.Tu0.kNcmBPGBvg', '$2y$13$xoEPwbdurxTWETreuSqz3ONaErADZHTMDPhhtmG2uigXNPKaBlXre', NULL, NULL, NULL, 'a:0:{}', '2020-02-11 18:40:36'),
(10, 'eazeaze@mail.com', 'eazeaze@mail.com', 'eazeaze@mail.com', 'eazeaze@mail.com', 0, 'RiQ5scH3C3GTy7IS5NlY7vWlafM6sTM9TwTLCO362IQ', '$2y$13$b7p61j/hOQLeBRRpNZRdNO1CjHySw8TnqSN5umW2IS/3vioEOTGqS', NULL, NULL, NULL, 'a:0:{}', '2020-02-11 18:45:18'),
(12, 'kirian.caumes@ynov.com', 'kirian.caumes@ynov.com', 'kirian.caumes@ynov.com', 'kirian.caumes@ynov.com', 1, 'cePyL0rw0jFyyGIpnzf9ztUqD9sIrSUwU8AujCAngTk', '$2y$13$SaGOUX/aKU.LkJAWbNOtquTIYbIpfSdojI02uP2z.nUFpulniRTYe', '2020-02-11 19:16:34', 'cDxKaS9Y21CM7LRgkG7HfKPECiXY-h-MVzXAAOvf-Ns', '2020-02-11 19:15:48', 'a:0:{}', '2020-02-11 19:15:48'),
(13, 'kirian.caumes666@gmail.com', 'kirian.caumes666@gmail.com', 'kirian.caumes666@gmail.com', 'kirian.caumes666@gmail.com', 1, 'B7MzdEayZiT8TPxbJYzR6iLIxSNyiX08k2MTZVebcn8', '$2y$13$WtTTU9c7gnGMK04Fu7X5VOJIN1TK24WWohkz3oWQKS8/u0f7fwBm.', '2020-02-16 18:03:10', NULL, NULL, 'a:0:{}', '2020-02-16 17:54:28');

-- --------------------------------------------------------

--
-- Table structure for table `mc_stg_users_teams`
--

DROP TABLE IF EXISTS `mc_stg_users_teams`;
CREATE TABLE IF NOT EXISTS `mc_stg_users_teams` (
  `user_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`team_id`),
  KEY `IDX_9B47FB3FA76ED395` (`user_id`),
  KEY `IDX_9B47FB3F296CD8AE` (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `mc_dev_activity_history`
--
ALTER TABLE `mc_dev_activity_history`
  ADD CONSTRAINT `FK_D29D53576B3CA4B` FOREIGN KEY (`id_user`) REFERENCES `mc_dev_user` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `mc_dev_document`
--
ALTER TABLE `mc_dev_document`
  ADD CONSTRAINT `FK_56853FD45697F554` FOREIGN KEY (`id_category`) REFERENCES `mc_dev_param_document_category` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_56853FD456D34F95` FOREIGN KEY (`id_member`) REFERENCES `mc_dev_member` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `mc_dev_member`
--
ALTER TABLE `mc_dev_member`
  ADD CONSTRAINT `FK_425D51CB3C7F3E62` FOREIGN KEY (`id_payment_solution`) REFERENCES `mc_dev_param_payment_solution` (`id`),
  ADD CONSTRAINT `FK_425D51CB54D97364` FOREIGN KEY (`id_paypal_information`) REFERENCES `mc_dev_paypal_information` (`id`),
  ADD CONSTRAINT `FK_425D51CB6B3CA4B` FOREIGN KEY (`id_user`) REFERENCES `mc_dev_user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_425D51CB710681AD` FOREIGN KEY (`id_sex`) REFERENCES `mc_dev_param_sex` (`id`),
  ADD CONSTRAINT `FK_425D51CBD6D3EE44` FOREIGN KEY (`id_season`) REFERENCES `mc_dev_param_season` (`id`);

--
-- Constraints for table `mc_dev_member_teams`
--
ALTER TABLE `mc_dev_member_teams`
  ADD CONSTRAINT `FK_28DF4819296CD8AE` FOREIGN KEY (`team_id`) REFERENCES `mc_dev_team` (`id`),
  ADD CONSTRAINT `FK_28DF48197597D3FE` FOREIGN KEY (`member_id`) REFERENCES `mc_dev_member` (`id`);

--
-- Constraints for table `mc_dev_param_price_global`
--
ALTER TABLE `mc_dev_param_price_global`
  ADD CONSTRAINT `FK_91AFC90CD6D3EE44` FOREIGN KEY (`id_season`) REFERENCES `mc_dev_param_season` (`id`);

--
-- Constraints for table `mc_dev_param_price_license`
--
ALTER TABLE `mc_dev_param_price_license`
  ADD CONSTRAINT `FK_2A16C0EAD6D3EE44` FOREIGN KEY (`id_season`) REFERENCES `mc_dev_param_season` (`id`);

--
-- Constraints for table `mc_dev_param_price_transfer`
--
ALTER TABLE `mc_dev_param_price_transfer`
  ADD CONSTRAINT `FK_64FD7E52D6D3EE44` FOREIGN KEY (`id_season`) REFERENCES `mc_dev_param_season` (`id`);

--
-- Constraints for table `mc_dev_param_reduction_family`
--
ALTER TABLE `mc_dev_param_reduction_family`
  ADD CONSTRAINT `FK_4334D1B7D6D3EE44` FOREIGN KEY (`id_season`) REFERENCES `mc_dev_param_season` (`id`);

--
-- Constraints for table `mc_dev_users_teams`
--
ALTER TABLE `mc_dev_users_teams`
  ADD CONSTRAINT `FK_9B47FB3F296CD8AE` FOREIGN KEY (`team_id`) REFERENCES `mc_dev_team` (`id`),
  ADD CONSTRAINT `FK_9B47FB3FA76ED395` FOREIGN KEY (`user_id`) REFERENCES `mc_dev_user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
