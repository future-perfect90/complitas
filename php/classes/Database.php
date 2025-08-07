<?php

/**
 * Class Database
 */
class Database
{

    private $conn;

    /**
     * @return PDO|null
     */
    public function connect(): ?PDO
    {
        //TODO::Implement ENV for values
    
        $username = 'root'; // Default username, change as needed
        $password = 'root'; // Default password, change as needed
        $dbname = 'complitas'; // Default database name, change as needed
        $host = 'localhost'; // Default host, change as needed
        $port = 8889; // Default port, change as needed

        
            try {
                $conn = new PDO(
                    'mysql:host=' . $host . ';port=' . $port . ';dbname=' . $dbname . ';charset=utf8mb4',
                    $username,
                    $password,
                    [
                        PDO::ATTR_PERSISTENT => true
                    ]
                );
                $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                $conn = null;
                error_log('ERROR: ' . $e->getMessage());
                echo "alert('Database connection failed.');";
            }
        
        return $conn;
    }
}