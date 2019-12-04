INSERT INTO `mc_param_price_license` (`id`, `label`, `price_before_deadline`, `price_after_deadline`, `min_year`, `max_year`) 
VALUES 
    (1, '2014 à 2011 inclus', '100', '120', '2011', '2014'), 
    (2, '2010 à 2008 inclus', '135', '155', '2008', '2010'), 
    (3, '2007 à 2002 inclus', '145', '165', '2002', '2007'),
    (4, '2001 et avant', '160', '180', '1900', '2001');

INSERT INTO `mc_param_price_transfer` (`id`, `label`, `price`, `min_age`, `max_age`) 
VALUES 
    (1, '+16 ans', '119', '16', '99'), 
    (2, '12 à 16 ans inclus', '73', '12', '16'), 
    (3, '-12 ans', '0', '0', '12');

INSERT INTO `mc_param_reduction_family` (`id`, `number`, `discount`) 
VALUES 
    (1, '1', '0'), 
    (2, '2', '10'), 
    (3, '3', '20'), 
    (4, '4', '30');

INSERT INTO `mc_param_global` (`id`, `label`, `value`) 
VALUES 
    (1, 'reduced_price_before_deadline', '140'), 
    (2, 'reduced_price_after_deadline', '160'), 
    (3, 'price_deadline', '2019-07-13');

INSERT INTO `mc_param_document_category` (`id`, `label`) 
VALUES 
    (1, 'certificat_medical'), 
    (2, 'justificatif_chomeur_etudiant');