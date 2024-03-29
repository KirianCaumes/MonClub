# MonClub

MonClub is an application that allow user to register to join an Handball Club.

**School Project** built with #React, #Symfony, #MySQL

See video presentation:

[![Video](https://img.youtube.com/vi/qLDJHTYs5-g/0.jpg)](https://www.youtube.com/watch?v=qLDJHTYs5-g)

## Init Dev

### Start API

```sh
#Swagger will not work
cd api
php -S 0.0.0.0:5000 public/index.php
#Front Build in ./app will not work
cd api/public
php -S 0.0.0.0:5000
```

#### About API

```sh
#Create db
php bin/console cache:clear
php bin/console doctrine:database:drop --force
php bin/console doctrine:database:create

#Create schema
php bin/console doctrine:schema:update --force

#Create entity
php bin/console make:entity

#Init migration
php bin/console make:migration

#Make migration
php bin/console doctrine:migrations:migrate

#Promote user
php bin/console fos:user:promote kirian.caumes@gmail.com ROLE_SUPER_ADMIN

#Generate blacklist db (sqlite) by plain text list password (can be very long)
php bin/console rollerworks-password:blacklist:update --file="../../mdp.txt"

#Run test
php bin/phpunit src/Test/Controller/UserControllerTest --testdox
php bin/phpunit --testdox
php bin/phpunit --coverage-html ./coverage --testdox
```

### Start FRONT

```sh
cd front
npm start
```

### Start DRIVE

```sh
cd drive/public
PHP -S 0.0.0.0:5001
```

## About going on production

```sh
cd ./2prod
npm start
#choose between staging/prod when prompted
```

You can now copy everything from './2prod/build/final' into your server
Remeber to copy also your database, and edit .env if needed

## Notes

Everything about docker has never been finished, so dont attempt to use it.

About the "attestion médical" here is quote from Michel JACQUET (Directeur Général / m.jacquet@ffhandball.net) : "Dans le cadre de la sécurisation de nos procédures de délivrance des licences, l’archivage par le club de l’original du certificat médical est obligatoire. Toutes les autres opérations sont dématérialisée."
