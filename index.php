<html>
<body>
<?php

    $hivext->local->SetHeader("Content-Type", "text/html");

    session_start();
    
    $auth = $hivext->users->authentication;

    // Check authentication.
    $resp = $auth->CheckSign($appid, $_SESSION["user_session"]);
    if($resp->result == 0) { // Already authenticated.
        $_SESSION["user_session"] = $resp->session;
        echo "Your email " . $resp->email . " and UserID = " . $resp->uid; // Show user email & id.
        echo "<br /><a href='Signout'>Logout</a>";

    } else { // Not authenticated.

        echo '<form method="post" action="Signin">';
        echo 'Email <input name="login" type="text" value="guest@guest.com">&nbsp;&nbsp;';
        echo 'Password <input name="password" type="text" value="guest">&nbsp;&nbsp;';
        echo '<input type="submit" value="Login">';
        echo '</form>';

        if($login != "" && $password != "") {
            $resp = $auth->Signin($appid, $login, $password);
            if($resp->result == 0) { // Authentication success.
                $_SESSION["user_session"] = $resp->session;
                return $hivext->local->Redirect("Signin");
            } else {
                echo $resp->result . " : " . $resp->error; // Show error & result.
            }
        }
    }

?>
</body>
</html>