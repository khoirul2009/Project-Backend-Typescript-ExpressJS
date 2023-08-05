# Rest API Typescript v1

## Register

### body request
```json
{
    "name": "string",
    "username": "string min 6",
    "email": "email@gmail.com valid email",
    "password": "string min 6"
}
```
### Respon jika berhasil membuat user
```json
{
    "code": 200,
    "message": "User created"
}
```
### Respon jika gagal validasi

User telah terdaftar

```json
{
    "code": 422,
    "message": "Username is already registered"
}
```
Input salah

```json
{
    "code": 422,
    "errors": [
        {
            "msg": "The name field cannot be empty",
            "param": "name",
            "location": "body"
        },
        {
            "msg": "The name field cannot be empty",
            "param": "username",
            "location": "body"
        },
        {
            "msg": "Username must be at least 6 chars long",
            "param": "username",
            "location": "body"
        },
        {
            "msg": "The password field cannot be empty",
            "param": "password",
            "location": "body"
        },
        {
            "msg": "Invalid value",
            "param": "password",
            "location": "body"
        },
        {
            "msg": "The password field cannot be empty",
            "param": "email",
            "location": "body"
        },
        {
            "msg": "Email must be valid",
            "param": "email",
            "location": "body"
        }
    ]
}
```

## Login

### body 
```json
{
    "username": "string",
    "password": "string"
}
```

### Respon jika berhasil

```json
{
    "code": 200,
    "message": "Logged In",
    "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpZCI6NCwidXNlcm5hbWUiOiJAa2hvaXJ1bCIsInBhc3N3b3JkIjoiJDJiJDEwJHpRdTdqYnZFLlB6bVJZN2Ryb01SU9NcS5pMnJKTXdETmlwa2ViOEhTa0VPb2ZtZXEyMkJhIiwiaWF0IjoxNjczNjgxODg4fQ.94A99CssZHmilsgNR_nGklDP4J5ApaBB7ym_CgmfSqI"
}
```
### Respon jika gagal

```json
{
    "code": 403,
    "message": "Credential tidak cocok"
}
```
