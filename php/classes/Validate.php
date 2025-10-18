<?php

class Validate
{

    public static function ValidateString($string): ?string
    {
        $validatedString = isset($string) ? htmlspecialchars($string, ENT_NOQUOTES | ENT_HTML5, 'UTF-8') : null;
        $untrimmed = isset($validatedString) ? strip_tags($validatedString) : null;
        return $untrimmed !== null ? trim($untrimmed) : null;
    }

    public static function ValidateURL($url): ?string
    {
        $validatedURL = isset($url) ? filter_var($url, FILTER_SANITIZE_URL) : null;
        return $validatedURL ? trim(filter_var($validatedURL, FILTER_VALIDATE_URL)) : null;
    }

    public static function ValidateInt($number): ?int
    {
        $number = is_string($number) ? trim(
            $number
        ) : $number; //remove any leading or trailing whitespace we are passing in.
        $number = is_numeric($number) ? $number : null;
        $validatedInt = isset($number) ? filter_var($number, FILTER_SANITIZE_NUMBER_INT) : null;
        return filter_var($validatedInt, FILTER_VALIDATE_INT) !== false ? (int)$validatedInt : null;
    }

    public static function ValidateFloat($number): ?float
    {
        $validatedFloat = isset($number) ? htmlentities($number, ENT_QUOTES) : null;
        $validatedFloat = filter_var($validatedFloat, FILTER_SANITIZE_NUMBER_FLOAT) ? $validatedFloat : null;
        return filter_var($validatedFloat, FILTER_VALIDATE_FLOAT) ? (float)$validatedFloat : null;
    }

    public static function ValidateBoolean($bool): ?bool
    {
        return isset($bool) ? filter_var($bool, FILTER_VALIDATE_BOOLEAN) : null;
    }

    public static function ValidateEmail($email): ?string
    {
        $validatedEmail = isset($email) ? htmlentities($email, ENT_QUOTES) : null;
        $validatedEmail = filter_var($validatedEmail, FILTER_SANITIZE_EMAIL) ? $validatedEmail : null;
        return filter_var($validatedEmail, FILTER_VALIDATE_EMAIL) ? $validatedEmail : null;
    }
}