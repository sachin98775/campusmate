FROM php:8.2-apache

# Install dependencies and MongoDB extension
RUN apt-get update && apt-get install -y \
    libssl-dev \
    unzip \
    git \
 && pecl install mongodb \
 && docker-php-ext-enable mongodb \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# Enable Apache mod_rewrite for routing
RUN a2enmod rewrite

# Setup document root to the public directory
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application files
WORKDIR /var/www/html
COPY . .

# Run composer install
RUN composer install --no-dev --no-interaction --optimize-autoloader

# Expose port (Railway overrides this with $PORT but it's good practice)
EXPOSE 80

# Command to run (Foreground apache)
CMD ["apache2-foreground"]
