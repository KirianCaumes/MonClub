INSERT INTO `mc_dev_param_price_license` (`id`, `label`, `price_before_deadline`, `price_after_deadline`, `min_year`, `max_year`, `id_season`) 
VALUES
    (1, '2014 à 2011 inclus', 100, 120, 2011, 2014, 2),
    (2, '2010 à 2008 inclus', 135, 155, 2008, 2010, 2),
    (3, '2007 à 2002 inclus', 145, 165, 2002, 2007, 2),
    (4, '2001 et avant', 160, 180, 1900, 2001, 2);

INSERT INTO `mc_dev_param_price_transfer` (`id`, `label`, `price`, `min_age`, `max_age`, `id_season`) 
VALUES
    (1, '+16 ans', 119, 16, 99, 2),
    (2, '12 à 16 ans inclus', 73, 12, 16, 2),
    (3, '-12 ans', 0, 0, 12, 2);


INSERT INTO `mc_dev_param_reduction_family` (`id`, `number`, `discount`, `id_season`) 
VALUES
    (1, 1, 0, 2),
    (2, 2, 10, 2),
    (3, 3, 20, 2),
    (4, 4, 30, 2);

INSERT INTO `mc_dev_param_global` (`id`, `label`, `value`) 
VALUES 
    (1, 'text_infos_admin', 'Text admin : Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla luctus libero lectus, quis fermentum elit suscipit gravida. Proin vitae ullamcorper dolor. <br />Nullam ultricies elit egestas dictum ultrices. Aliquam suscipit eu diam eu elementum. Fusce volutpat, sem in euismod eleifend, turpis ipsum convallis elit, eget interdum massa felis quis risus.<br />Morbi sed ligula maximus, fermentum nibh quis, interdum diam.'),
    (2, 'text_infos_user', 'Text user : Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla luctus libero lectus, quis fermentum elit suscipit gravida. Proin vitae ullamcorper dolor. <br />Nullam ultricies elit egestas dictum ultrices. Aliquam suscipit eu diam eu elementum. Fusce volutpat, sem in euismod eleifend, turpis ipsum convallis elit, eget interdum massa felis quis risus.<br />Morbi sed ligula maximus, fermentum nibh quis, interdum diam.'),
    (3, 'president_firstname', 'benjamin'), 
    (4, 'president_lastname', 'paire'), 
    (5, 'is_create_new_user_able', 'true'), 
    (6, 'new_member_deadline', ''),
    (7, 'is_create_new_member_able', 'true'),
    (8, 'secretary_firstname', 'carole'), 
    (9, 'secretary_lastname', 'blanchard'),
    (10, 'date_mail_renew_certif', '01-05');

INSERT INTO `mc_dev_param_document_category` (`id`, `label`) 
VALUES 
    (1, 'Certificat médical'), 
    (2, 'Justificatif étudiant/chomeur');

INSERT INTO `mc_dev_param_workflow` (`id`, `label`, `description`, `message`) 
VALUES 
    (1, 'Créé', 'L''utilisateur est créé.', null), 
    (2, 'Documents', 'L''utilisateur à fournis les documents nécessaires.', 'Passer cet élément de "Oui" à "Non" réactivera l''édition du membre pour l''utilisateur propriétaire et lui enverras un mail lui signalant que ces documents sont invalides.'), 
    (3, 'Payé','L''utilisateur à payé.', 'Lorsque cette étape est validée, l''ensemble des champs relatif au paiement sont désactivés.'), 
    (4, 'Gest''hand', 'L''utilisateur est bien inscris sur Gest''hand.', null), 
    (5, 'Qualifié', 'L''inscription est finalisée.', 'Passer cet élément de "Non" à "Oui" enverra un mail à l''utilisateur lui signalant que l''inscription de membre est validée.
');

INSERT INTO `mc_dev_param_payment_solution` (`id`, `label`, `icon`) 
VALUES 
    (1, 'Paypal', 'PaymentCard'), 
    (2, 'Chèque', 'Document'), 
    (3, 'Chèque & coupon(s)', 'DocumentSet');

INSERT INTO `mc_dev_param_season` (`id`, `label`, `is_active`, `is_current`) 
VALUES 
    (1, '2018/2019', true, false), (2, '2019/2020', true, true), (3, '2020/2021', false, false), (4, '2021/2022', false, false), (5, '2022/2023', false, false), (6, '2023/2024', false, false), (7, '2024/2025', false, false), (8, '2025/2026', false, false), (9, '2026/2027', false, false), (10, '2027/2028', false, false), (11, '2028/2029', false, false), (12, '2029/2030', false, false), (13, '2030/2031', false, false), (14, '2031/2032', false, false), (15, '2032/2033', false, false), (16, '2033/2034', false, false), (17, '2034/2035', false, false), (18, '2035/2036', false, false), (19, '2036/2037', false, false), (20, '2037/2038', false, false), (21, '2038/2039', false, false), (22, '2039/2040', false, false), (23, '2040/2041', false, false), (24, '2041/2042', false, false), (25, '2042/2043', false, false), (26, '2043/2044', false, false), (27, '2044/2045', false, false), (28, '2045/2046', false, false), (29, '2046/2047', false, false), (30, '2047/2048', false, false), (31, '2048/2049', false, false), (32, '2049/2050', false, false), (33, '2050/2051', false, false);

INSERT INTO `mc_dev_param_sex` (`id`, `label`, `icon`, `civility`) 
VALUES
    (1, 'Homme', 'Man', 'Monsieur'),
    (2, 'Femme', 'Woman', 'Madame');

INSERT INTO `mc_dev_param_price_global` (`id`, `id_season`, `reduced_price_before_deadline`, `reduced_price_after_deadline`, `deadline_date`, `paypal_fee`) 
VALUES
    (1, 2, 140, 160, '2019-07-12', 5);