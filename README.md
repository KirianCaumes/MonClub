# MonClub

## Start API

```sh
cd api/public
PHP -S localhost:8080
```

## Start FRONT

```sh
cd front
npm start
```

### About API

```sh
#Create entity
php bin/console make:entity

#Init migration
php bin/console make:migration

#Make migration
php bin/console doctrine:migrations:migrate
```
