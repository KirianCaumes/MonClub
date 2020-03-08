<?php

namespace App;

class Constants
{
    //ACCESS
    public const CREATE = 'CREATE';
    public const CREATE_ADMIN = 'CREATE_ADMIN';
    public const READ = 'READ';
    public const READ_DOCUMENT = 'READ_DOCUMENT';
    public const UPDATE = 'UPDATE';
    public const UPDATE_ADMIN = 'UPDATE_ADMIN';
    public const DELETE = 'DELETE';

    //COLORS for Excel
    public const COLORS = ['FFFFFF', '00FFFF', 'FFFF00', 'FF9900', '00FF00'];
    
    //ACCESS entity
    public const BASIC = "Default";
    public const ADMIN = "Admin";

    //ROLES
    public const ROLE_USER = "ROLE_USER";
    public const ROLE_COACH = "ROLE_COACH";
    public const ROLE_ADMIN = "ROLE_ADMIN";
    public const ROLE_SUPER_ADMIN = "ROLE_SUPER_ADMIN";
}
