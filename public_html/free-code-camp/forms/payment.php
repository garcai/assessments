<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'/>
  <title>Contact handler</title>
  <link rel='stylesheet' href='styles.css'/>
</head>
<body>
  <h1>Payment Info</h1>
  <h2>Contact Information</h2>
  <p><?php echo $_POST["title"]; ?>. <?php echo $_POST["username"]; ?></p>
  <p><?php echo $_POST["usermail"]; ?></p>
  <p><?php echo $_POST["password"]; ?></p>

  <h2>Payment information</h2>
  <p><?php echo $_POST["usercard"]; ?></p>
  <p><?php echo $_POST["cardnumber"]; ?></p>
  <p><?php echo $_POST["expiration"]; ?></p>
</body>
</html>
