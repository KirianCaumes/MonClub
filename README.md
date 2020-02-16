# MonClub

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

Build front 
```sh
(npm install)
npm run build
```
Copy everything from ./front/build into ./api/public/app

Edit on ./api/.env
```.env
APP_ENV=prod #staging
APP_DEBUG=0
```

Opti API
```sh
#delete ./vendor
composer install --no-dev --optimize-autoloader
php bin/console cache:clear --env=pro #optional
```

Then, you can copy everything on the server, except :
- ./cache/dev
- ./log

You also may need to create a custom .env.local with you custom configuration