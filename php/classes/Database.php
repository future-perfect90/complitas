<?php
require_once(__DIR__ . '/Config.php');

class Database
{
    private $conn;

    /**
     * @return PDO|null
     */
    public function connect(): ?PDO
    {

        $dbCredentials = (new Conf())->DbCredentials();
        $username = $dbCredentials['username'];
        $password = $dbCredentials['password'];
        $dbname = $dbCredentials['dbname'];
        $host = $dbCredentials['host'];
        $port = $dbCredentials['port'];

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