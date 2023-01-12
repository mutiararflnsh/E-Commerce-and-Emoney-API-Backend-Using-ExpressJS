# e-money-kelompok-7
Dokumentasi API E-Money Payfresh dan E-Commerce Fresh Box oleh kelompok 7

# Anggota

| Nama                           | NRP          | 
| -------------------------------| -------------| 
| Muhammad Naufal Pasya                 | `5027201045` | 
| Mutiara Nuraisyah Dinda R           | `5027201054` | 
| Anak Agung Bintang Krisnadewi     | `5027201060` |

## PAYFRESH

### 1. Create User (Register)

### Method
POST
### End Point
api/register
### Authorization
Tidak ada
### Parameter
{userName, email, password, phone}

![Register](/screenshot/register.png)

### 2. Login

### Method
POST
### End Point
api/login
### Authorization
Tidak ada
### Parameter
{email, password}
![Login](/screenshot/login.png)

### 3. Top Up

### Method
POST
### End Point
api/admin/:id
### Authorization
JWT Token Admin
### Parameter
{amount, userId}
![Top Up](/screenshot/topup.png)

### 4. Transfer

### Method
POST
### End Point
api/user/transfer/:id
### Authorization
JWT Token User
### Parameter
{amount, phone}
![Transfer](/screenshot/transfer.png)

### 5. Check Saldo

### Method
GET
### End Point
api/user/amount/:id
### Authorization
JWT Token User
### Parameter
{userId}
![Check Saldo](/screenshot/checkSaldo.png)

### 6. Track History Transaksi

### Method
GET
### End Point
api/user/tracking/:id
### Authorization
JWT Token User
### Parameter
{userId}
![Tracking](/screenshot/trackHistory.png)

### 7. Update Data User
### Method
PUT
### End Point
api/user/:id
### Authorization
JWT Token User
### Parameter
{userId}
![Update user](/screenshot/updateUser.png)

### 8. Get All User
### Method
GET
### End Point
api/admin
### Authorization
JWT Token Admin
### Parameter
Tidak ada
![Get All User](/screenshot/getAllUser.png)




## FRESH BOX

### 1. Create User (Register)

### Method
POST
### End Point
api/register
### Authorization
JWT Token User
### Parameter
{userName, password, email, phone, alamat}

![Register](/screenshot2/register.jpeg)

### 2. Login

### Method
POST
### End Point
api/login
### Authorization
JWT Token User
### Parameter
{password, email}
![Login](/screenshot2/login.jpeg)

### 3. Add Product

### Method
POST
### End Point
api/user/addproduct
### Authorization
JWT Token User
### Parameter
{nama_produk, stok, harga}
![Add Product](/screenshot2/addproduct.jpeg)

### 4. Order

### Method
POST
### End Point
api/user/order
### Authorization
JWT Token User
### Parameter
{produk, quantity, total_harga}
![Order](/screenshot2/order.jpeg)

### 5. Detail Order (My Order)

### Method
GET
### End Point
api/user/myorder
### Authorization
JWT Token User
### Parameter
Tidak ada
![My Order](/screenshot2/myorder.jpeg)

### 6. Cari Produk (Search)

### Method
GET
### End Point
api/user/search
### Authorization
Tidak ada
### Parameter
{nama_produk}
![Search](/screenshot2/search.jpeg)

### 7. List Seluruh Produk (All Product)

### Method
GET
### End Point
api/allproduct
### Authorization
Tidak ada
### Parameter
Tidak ada
![Search](/screenshot2/allproduct.jpeg)

### 8. Pesanan Masuk

### Method
GET
### End Point
api/user/pesananmasuk
### Authorization
JWT Token User
### Parameter
Tidak ada
![Pesanan Masuk](/screenshot2/pesanan.jpeg)

### 9. Pembayaran melalui e-money

Seluruh cara pembayaran melalui e-money adalah sama, yang membedakan hanya end point-nya saja. Di bawah adalah contoh pembayaran melalui e-money Moneyz.
### Method
POST
### End Point
api/user/paymentMoneyz
### Authorization
JWT Token User
### Parameter
{phone, password, tujuan, amount, emoney, order_id}
![Payment](/screenshot2/payment.jpeg)

### 10. Pembayaran Order (Payment Order)

### Method
POST
### End Point
api/user/payment
### Authorization
JWT Token User
### Parameter
{email, password, phone, amount, order_id}
![Payment Order](/screenshot2/paymentorder.jpeg)


