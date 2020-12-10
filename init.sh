npm install
mkdir -p certs 
cd certs 
openssl genrsa -out key.pem 
openssl req -new -key key.pem -subj /C=IN/ST=CA/O=Cool/CN=localhost -out csr.pem 
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem 
cd ..
