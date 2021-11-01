php -S 127.0.0.1:8080 &
SERVER_PID=$!
firefox --kiosk http://127.0.0.1:8080
kill $SERVER_PID
pkill firefox