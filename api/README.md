dbClient → users, posts
- 取り扱いたいdbが2つ(users,posts)ある
- prototype.名前を変更してdb引数なしで対処

callback(setResult(...)) → callback(...)
- setResultを消して、callbackの引数を設定

## Interfaces

### UserType
| member   | type   | description     |
| -------- | ------ | --------------- |
| id       | string | unique id       |
| name     | string | username        |
| email    | string | unique address  |
| passhash | string | hashed password |
