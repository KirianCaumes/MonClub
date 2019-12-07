# MonClub

## Start API

```sh
cd api/public
PHP -S 0.0.0.0:8080
```

## Start FRONT

```sh
cd front
npm start
```

### About API

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
```
