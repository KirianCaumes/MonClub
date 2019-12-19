# MonClub

## Start API

```sh
cd api/public
PHP -S 0.0.0.0:5000
```

## Start FRONT

```sh
cd front
npm start
```

## Start DRIVE

```sh
cd drive
PHP -S 0.0.0.0:5001
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

#Promote user
php bin/console fos:user:promote kirian.caumes@gmail.com ROLE_SUPER_ADMIN
```
