php -S 127.0.0.1:8080 &
SERVER_PID=$!
sleep 10
firefox --kiosk http://127.0.0.1:8080
echo $SERVER_PID