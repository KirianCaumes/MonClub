FROM php:7.4.3

WORKDIR /app/api

RUN apt update
RUN apt upgrade -y
RUN apt install -y apt-utils
RUN apt install -y git
RUN apt install -y zip
RUN apt install -y unzip
RUN apt-get install -y \
        libzip-dev \
        libpng-dev \
        zip \
  && docker-php-ext-install zip
RUN docker-php-ext-install gd
RUN apt install libsodium-dev -y
RUN docker-php-ext-enable sodium 
RUN docker-php-ext-install pdo_mysql

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# COPY composer.json /app/api/composer.json
# COPY composer.lock /app/api/composer.lock

# RUN composer update; exit 0
# RUN composer install

EXPOSE 5000

# WORKDIR /app/api/public

# CMD ["php -S 0.0.0.0:5000"]