INSERT INTO `mc_param_price_license` (`id`, `label`, `price_before_deadline`, `price_after_deadline`, `min_year`, `max_year`) 
VALUES 
    (NULL, '2014 à 2011 inclus', '100', '120', '2011', '2014'), 
    (NULL, '2010 à 2008 inclus', '135', '155', '2008', '2010'), 
    (NULL, '2007 à 2002 inclus', '145', '165', '2002', '2007'),
    (NULL, '2001 et avant', '160', '180', '1900', '2001');

INSERT INTO `mc_param_price_transfer` (`id`, `label`, `price`, `min_age`, `max_age`) 
VALUES 
    (NULL, '+16 ans', '119', '16', '99'), 
    (NULL, '12 à 16 ans inclus', '73', '12', '16'), 
    (NULL, '-12 ans', '0', '0', '12');

INSERT INTO `mc_param_reduction_family` (`id`, `number`, `discount`) 
VALUES 
    (NULL, '1', '0'), 
    (NULL, '2', '10'), 
    (NULL, '3', '20'), 
    (NULL, '4', '30');

INSERT INTO `mc_param_global` (`id`, `label`, `value`) 
    VALUES 
        (NULL, 'reduced_price_before_deadline', '140'), 
        (NULL, 'reduced_price_after_deadline', '160'), 
        (NULL, 'price_deadline', '2019-07-13');